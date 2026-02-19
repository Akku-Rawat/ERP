import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getPaymentMethodLabel } from "../../../constants/invoice.constants";
import { ERP_BASE } from "../../../config/api";

const loadImageFromUrl = async (url: string): Promise<string> => {
  console.log("Fetching image from URL:", url);

  try {
    const res = await fetch(url, {
      mode: "cors",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Image fetch failed: ${res.status} ${res.statusText}`);
    }

    const blob = await res.blob();
    console.log("Image blob type:", blob.type);

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("FileReader failed"));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error loading image:", error);
    throw error;
  }
};

export const generateInvoicePDF = async (
  invoice: any,
  company: any,
  resultType: "save" | "bloburl" = "save",
) => {
  const getFullImageUrl = (path: string): string => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    return `${ERP_BASE}${path}`;
  };

  const doc = new jsPDF("p", "mm", "a4");
  const currency = invoice.currencyCode || "ZMW";

  // ✅ FIX 1: Always reset text color to black at the very start
  doc.setTextColor(0, 0, 0);

  /* ================= HEADER ================= */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(company.companyName, 15, 15);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`TPIN: ${company.tpin}`, 15, 20);
  doc.text(`Phone: ${company.contactInfo.companyPhone}`, 15, 24);
  doc.text(`Email: ${company.contactInfo.companyEmail}`, 15, 28);

  /* ================= LOGO ================= */
  // ✅ FIX 2: Logo block is now STANDALONE — no longer wraps the rest of the document
  if (company.documents?.companyLogoUrl) {
    try {
      const fullLogoUrl = getFullImageUrl(company.documents.companyLogoUrl);
      console.log("Original path:", company.documents.companyLogoUrl);
      console.log("Full URL:", fullLogoUrl);

      const logoBase64 = await loadImageFromUrl(fullLogoUrl);

      let format: "PNG" | "JPEG" = "PNG";
      if (
        logoBase64.includes("image/jpeg") ||
        logoBase64.includes("image/jpg")
      ) {
        format = "JPEG";
      }

      doc.addImage(logoBase64, format, 150, 10, 30, 15);
      console.log("Logo added successfully");
    } catch (e) {
      console.error("Logo load failed:", e);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("[Logo]", 165, 18, { align: "center" });
      // ✅ FIX 1: Reset color back to black after gray placeholder
      doc.setTextColor(0, 0, 0);
    }
  }

  /* ================= TITLE ================= */
  // ✅ Always set black before writing text sections
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("TAX INVOICE", 105, 42, { align: "center" });

  /* ================= BILL TO ================= */
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 15, 52);

  doc.setFont("helvetica", "normal");
  doc.text(
    [
      invoice.customerName,
      `TPIN: 2484778086`,
      invoice.billingAddress?.line1,
      invoice.billingAddress?.line2,
    ].filter(Boolean) as string[],
    15,
    56,
  );

  doc.setFont("helvetica", "bold");
  doc.text(`Invoice No: ${invoice.invoiceNumber}`, 150, 52);
  doc.text(`Date: ${invoice.dateOfInvoice}`, 150, 56);
  doc.text(`Due Date: ${invoice.dueDate}`, 150, 60);

  /* ================= ITEMS TABLE ================= */
  autoTable(doc, {
    startY: 80,
    head: [
      ["#", "Name", "Qty", "Unit Price", `Total (${currency})`, "Tax Cat"],
    ],
    body: invoice.items.map((i: any, idx: number) => [
      idx + 1,
      i.description,
      Number(i.quantity).toFixed(1),
      Number(i.price).toFixed(2),
      (i.quantity * i.price - (i.discount || 0)).toFixed(2),
      i.vatCode || "",
    ]),
    styles: {
      fontSize: 8,
      halign: "center",
      textColor: [0, 0, 0], // ✅ FIX 1: Explicit black for table cells
    },
    headStyles: {
      fillColor: [44, 62, 80],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    columnStyles: {
      1: { halign: "left" },
      3: { halign: "right" },
      4: { halign: "right" },
    },
    margin: { left: 15, right: 15 },
  });

  const y = (doc as any).lastAutoTable.finalY + 6;

  // ✅ FIX 1: Reset text color after autoTable (autoTable can sometimes affect state)
  doc.setTextColor(0, 0, 0);

  /* ================= TAX SUMMARY ================= */
  const summary = invoice.items.reduce(
    (acc: any, i: any) => {
      const qty = Number(i.quantity || 0);
      const price = Number(i.price || 0);
      const discount = Number(i.discount || 0);

      const inclusive = qty * price - discount;
      const exclusive = Number(i.vatTaxableAmount || 0);
      const vat = inclusive - exclusive;

      acc.taxable += exclusive;
      acc.vat += vat;
      acc.total += inclusive;

      return acc;
    },
    { taxable: 0, vat: 0, total: 0 },
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);

  doc.text(`Taxable Standard Rated (16%)`, 110, y);
  doc.text(`${summary.taxable.toFixed(2)} ${currency}`, 195, y, {
    align: "right",
  });

  doc.text("Sub-total", 110, y + 6);
  doc.text(`${summary.taxable.toFixed(2)} ${currency}`, 195, y + 6, {
    align: "right",
  });

  doc.text("VAT Total", 110, y + 12);
  doc.text(`${summary.vat.toFixed(2)} ${currency}`, 195, y + 12, {
    align: "right",
  });

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Total Amount", 110, y + 20);
  doc.text(`${summary.total.toFixed(2)} ${currency}`, 195, y + 20, {
    align: "right",
  });

  /* ================= SDC INFO ================= */
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("SDC Information", 15, y + 32);

  doc.setFont("helvetica", "normal");
  doc.text(
    [
      `Invoice Date: ${invoice.dateOfInvoice}`,
      `SDC ID: SDC0010002709`,
      `Invoice Number: ${invoice.invoiceNumber}`,
      `Invoice Type: ${invoice.invoiceType}`,
      `Payment Type: ${getPaymentMethodLabel(
        invoice.paymentInformation.paymentMethod,
      )}`,
    ],
    15,
    y + 38,
  );

  /* ================= BANK DETAILS ================= */
  doc.setFont("helvetica", "bold");
  doc.text("Banking Details", 110, y + 32);

  doc.setFont("helvetica", "normal");
  doc.text(
    [
      `${company.financialConfig.baseCurrency}`,
      `ACC NO ${invoice.paymentInformation.accountNumber}`,
      `BANK ${invoice.paymentInformation.bankName}`,
      `BRANCH CROSSROADS`,
      `SWIFTCODE ${invoice.paymentInformation.swiftCode}`,
    ],
    110,
    y + 38,
  );

  /* ================= FOOTER ================= */
  doc.setFontSize(7);
  // ✅ FIX 1: Use RGB form so it doesn't bleed — and it's scoped to ONLY footer
  doc.setTextColor(120, 120, 120);
  doc.text("Powered by LoremIpsum Smart Invoice!", 105, 287, {
    align: "center",
  });
  doc.text("Created By: Lorem Ipsum", 105, 292, { align: "center" });

  // ✅ FIX 1: Always reset after gray footer text
  doc.setTextColor(0, 0, 0);

  return resultType === "save"
    ? doc.save(`Invoice_${invoice.invoiceNumber}.pdf`)
    : doc.output("bloburl");
};