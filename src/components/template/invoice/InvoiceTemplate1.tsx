import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CloudCog } from "lucide-react";




export const generateInvoicePDF = (
  invoice: any,  
  resultType: "save" | "bloburl" = "save"
) => {
  const data = invoice; 
  console.log("Generating PDF for invoice:", data);

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

 const symbol = data.currency === "INR" ? "₹" : 
               data.currency === "ZMW" ? "ZK" : "$";

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

//  Billing Address
doc.text(
  [
    data.customerName || "",
    data.billingAddressLine1 || "",
    `${data.billingCity || ""}, ${data.billingState || ""} ${data.billingPostalCode || ""}`,
  ].filter(Boolean),
  15,
  60
);

//  Shipping Address - Same pattern
doc.text(
  [
    data.customerName || "",
    data.shippingAddressLine1 || "",  //  Flat field
    `${data.shippingCity || ""}, ${data.shippingState || ""} ${data.shippingPostalCode || ""}`,  // ✅ Flat fields
  ].filter(Boolean),
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
body: data.items.map((i: any) => [
  i.description || i.productName || "",
  i.quantity || 0,
  `${symbol}${((i.listPrice || i.price) || 0).toFixed(2)}`,
  `${symbol}${((i.quantity * (i.listPrice || i.price)) || 0).toFixed(2)}`,
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
const total = data.items.reduce((s: number, i: any) => 
  s + (i.quantity || 0) * (i.listPrice || i.price || 0), 0
);

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
