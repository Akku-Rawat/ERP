import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DEV_INVOICE = {
  invoiceNumber: "INV-2025-001",
  currencyCode: "INR",
  customerId: "Acme Corporation Pvt Ltd",

  billingAddress: {
    line1: "4th Floor, Prestige Towers",
    city: "Bangalore",
    state: "Karnataka",
    postalCode: "560001",
  },

  shippingAddress: {
    line1: "4th Floor, Prestige Towers",
    city: "Bangalore",
    state: "Karnataka",
    postalCode: "560001",
  },

  dateOfInvoice: new Date().toISOString(),
  dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),

  items: [
    { description: "Custom Software Development", quantity: 1, price: 75000 },
    { description: "Cloud Infrastructure Setup", quantity: 1, price: 25000 },
    { description: "Annual Support & Maintenance", quantity: 1, price: 15000 },
  ],
};

export const generateInvoicePDF = (
  resultType: "save" | "bloburl" = "save"
) => {
  const data = DEV_INVOICE;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const symbol =
    data.currencyCode === "INR" ? "Rs." : data.currencyCode === "ZMW" ? "ZK" : "$";

  /* ---------- Header ---------- */
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("INVOICE", 15, 22);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`#${data.invoiceNumber}`, 15, 28);

  doc.setFontSize(14);
  doc.text("Rolaface Software Pvt Limited", 195, 20, { align: "right" });
  doc.setFontSize(9);
  doc.setTextColor(219, 234, 254);
  doc.text("Your Trusted Technology Partner", 195, 26, { align: "right" });

  /* ---------- Addresses ---------- */
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO", 15, 55);
  doc.text("SHIP TO", 80, 55);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(70, 70, 70);

  doc.text(
    [
      data.customerId,
      data.billingAddress.line1,
      `${data.billingAddress.city}, ${data.billingAddress.state} ${data.billingAddress.postalCode}`,
    ],
    15,
    60
  );

  doc.text(
    [
      data.customerId,
      data.shippingAddress.line1,
      `${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}`,
    ],
    80,
    60
  );

  /* ---------- Dates ---------- */
  doc.setFillColor(249, 250, 251);
  doc.rect(140, 50, 55, 20, "F");
  doc.setFontSize(8);
  doc.text("DATE:", 145, 58);
  doc.text("DUE DATE:", 145, 65);

  doc.setFont("helvetica", "bold");
  doc.text(new Date(data.dateOfInvoice).toLocaleDateString(), 190, 58, {
    align: "right",
  });
  doc.setTextColor(220, 38, 38);
  doc.text(new Date(data.dueDate).toLocaleDateString(), 190, 65, {
    align: "right",
  });

  /* ---------- Items Table ---------- */
  autoTable(doc, {
    startY: 85,
    head: [["Description", "Qty", "Price", "Amount"]],
    body: data.items.map((i) => [
      i.description,
      i.quantity,
      `${symbol}${i.price.toFixed(2)}`,
      `${symbol}${(i.quantity * i.price).toFixed(2)}`,
    ]),
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    columnStyles: {
      1: { halign: "center" },
      2: { halign: "right" },
      3: { halign: "right" },
    },
    margin: { left: 15, right: 15 },
  });

  /* ---------- Total ---------- */
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const total = data.items.reduce((s, i) => s + i.quantity * i.price, 0);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("TOTAL", 140, finalY + 8);

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 58, 138);
  doc.text(`${symbol}${total.toFixed(2)}`, 195, finalY + 8, {
    align: "right",
  });

  /* ---------- Signature ---------- */
  doc.setDrawColor(200, 200, 200);
  doc.line(150, finalY + 35, 190, finalY + 35);
  doc.setFontSize(8);
  doc.setTextColor(40, 40, 40);
  doc.text("Priya Chopra", 170, finalY + 40, { align: "center" });
  doc.setFontSize(6);
  doc.text("AUTHORIZED SIGNATORY", 170, finalY + 44, {
    align: "center",
  });

  return resultType === "save"
    ? doc.save(`Invoice_${data.invoiceNumber}.pdf`)
    : doc.output("bloburl");
};
