// import React, { useState, useEffect } from "react";
// import { Plus, Trash2 } from "lucide-react";

// interface PaymentTermRow {
//   paymentTerm: string;
//   description: string;
//   invoicePortion: number;
//   dueDateBasedOn: string;
//   creditDays: number;
// }

// interface Props {
//   open: boolean;
//   onClose: () => void;
// }

// export const PaymentTermsTemplateModal: React.FC<Props> = ({ open, onClose }) => {
//   const ITEMS_PER_PAGE = 5;

//   const [templateName, setTemplateName] = useState("");
//   const [allocatePayment, setAllocatePayment] = useState(false);
//   const [page, setPage] = useState(0);

//   const [rows, setRows] = useState<PaymentTermRow[]>([
//     {
//       paymentTerm: "",
//       description: "",
//       invoicePortion: 0,
//       dueDateBasedOn: "invoice",
//       creditDays: 0,
//     },
//   ]);

//   // ✅ SAME AUTO PAGINATION LOGIC AS TAX TAB
//   useEffect(() => {
//     const newPage = Math.floor((rows.length - 1) / ITEMS_PER_PAGE);
//     if (newPage !== page) setPage(newPage);
//   }, [rows.length]);

//   if (!open) return null;

//   const paginatedRows = rows.slice(
//     page * ITEMS_PER_PAGE,
//     (page + 1) * ITEMS_PER_PAGE
//   );

//   // ✅ ADD ROW (TaxTab style)
//   const onAddRow = () => {
//     setRows(prev => [
//       ...prev,
//       {
//         paymentTerm: "",
//         description: "",
//         invoicePortion: 0,
//         dueDateBasedOn: "invoice",
//         creditDays: 0,
//       },
//     ]);
//   };

//   // ✅ REMOVE ROW (GLOBAL INDEX LIKE TAX TAB)
//   const onRemoveRow = (idx: number) => {
//     setRows(prev => prev.filter((_, i) => i !== idx));
//   };

//   // ✅ UPDATE ROW (GLOBAL INDEX)
//   const onRowChange = (
//     idx: number,
//     key: keyof PaymentTermRow,
//     value: any
//   ) => {
//     setRows(prev =>
//       prev.map((r, i) =>
//         i === idx ? { ...r, [key]: value } : r
//       )
//     );
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-card border border-theme w-[1200px] max-w-[95vw] rounded-lg p-6 text-main">

//         {/* HEADER */}
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-semibold text-main">
//             New Payment Terms Template
//           </h2>
//           <button onClick={onClose} className="text-danger text-xl">×</button>
//         </div>

//         {/* TEMPLATE NAME */}
//         <div className="mb-3">
//           <label className="text-sm font-medium text-main">Template Name</label>
//           <input
//             className="w-full border border-theme bg-app px-3 h-[34px] rounded mt-1 text-sm"
//             value={templateName}
//             onChange={(e) => setTemplateName(e.target.value)}
//           />
//         </div>

//         {/* ALLOCATE PAYMENT */}
//         <div className="flex items-start gap-2 mb-3">
//           <input
//             type="checkbox"
//             checked={allocatePayment}
//             onChange={(e) => setAllocatePayment(e.target.checked)}
//             className="mt-1"
//           />
//           <div>
//             <p className="font-medium text-sm text-main">
//               Allocate Payment Based On Payment Terms
//             </p>
//             <p className="text-xs text-muted">
//               Paid amount will be split and allocated as per payment schedule
//             </p>
//           </div>
//         </div>

//         {/* PAGINATION */}
//         <div className="flex justify-between text-sm text-muted mt-2">
//           <span>
//             Showing {page * ITEMS_PER_PAGE + 1}–
//             {Math.min((page + 1) * ITEMS_PER_PAGE, rows.length)} of {rows.length}
//           </span>

//           <div className="flex gap-2">
//             <button
//               type="button"
//               onClick={() => setPage(p => Math.max(0, p - 1))}
//               disabled={page === 0}
//               className="px-2 py-1 bg-app border border-theme rounded disabled:opacity-50"
//             >
//               Prev
//             </button>

//             <button
//               type="button"
//               onClick={() => setPage(p => p + 1)}
//               disabled={(page + 1) * ITEMS_PER_PAGE >= rows.length}
//               className="px-2 py-1 bg-app border border-theme rounded disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </div>

//         {/* TABLE */}
//         <div className="overflow-x-auto rounded-lg border border-theme mt-2">
//           <table className="w-full text-sm">
//             <thead className="table-head">
//               <tr>
//                 <th className="px-2 py-2 text-left">#</th>
//                 <th className="px-2 py-2 text-left">Payment Term</th>
//                 <th className="px-2 py-2 text-left">Description</th>
//                 <th className="px-2 py-2 text-right">Invoice Portion (%)</th>
//                 <th className="px-2 py-2 text-left">Due Date Based On</th>
//                 <th className="px-2 py-2 text-right">Credit Days</th>
//                 <th></th>
//               </tr>
//             </thead>

//             <tbody className="divide-y border-theme">
//               {rows.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="text-center p-6 text-muted">
//                     No Data
//                   </td>
//                 </tr>
//               ) : (
//                 paginatedRows.map((row, idx) => {
//                   const i = page * ITEMS_PER_PAGE + idx;

//                   return (
//                     <tr key={i} className="row-hover">
//                       <td className="px-2 py-1 text-center">{i + 1}</td>

//                       <td className="px-1 py-1">
//                         <input
//                           className="w-full border border-theme bg-app p-1 text-sm rounded"
//                           value={row.paymentTerm}
//                           onChange={(e) => onRowChange(i, "paymentTerm", e.target.value)}
//                         />
//                       </td>

//                       <td className="px-1 py-1">
//                         <input
//                           className="w-full border border-theme bg-app p-1 text-sm rounded"
//                           value={row.description}
//                           onChange={(e) => onRowChange(i, "description", e.target.value)}
//                         />
//                       </td>

//                       <td className="px-1 py-1 text-right">
//                         <input
//                           type="number"
//                           className="w-full border border-theme bg-app p-1 text-sm text-right rounded"
//                           value={row.invoicePortion}
//                           onChange={(e) =>
//                             onRowChange(i, "invoicePortion", Number(e.target.value))
//                           }
//                         />
//                       </td>

//                       <td className="px-1 py-1">
//                         <select
//                           className="w-full border border-theme bg-app p-1 text-sm rounded"
//                           value={row.dueDateBasedOn}
//                           onChange={(e) =>
//                             onRowChange(i, "dueDateBasedOn", e.target.value)
//                           }
//                         >
//                           <option value="invoice">Day(s) after invoice date</option>
//                           <option value="delivery">Day(s) after delivery</option>
//                           <option value="fixed">Fixed Date</option>
//                         </select>
//                       </td>

//                       <td className="px-1 py-1 text-right">
//                         <input
//                           type="number"
//                           className="w-full border border-theme bg-app p-1 text-sm text-right rounded"
//                           value={row.creditDays}
//                           onChange={(e) =>
//                             onRowChange(i, "creditDays", Number(e.target.value))
//                           }
//                         />
//                       </td>

//                       <td className="px-1 py-1 text-center">
//                         <button
//                           onClick={() => onRemoveRow(i)}
//                           className="p-1 text-danger hover:bg-app rounded"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* ADD ROW BUTTON */}
//         <button
//           type="button"
//           onClick={onAddRow}
//           className="flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-sm font-medium text-white mt-2"
//         >
//           <Plus className="w-4 h-4" /> Add Row
//         </button>

//         {/* FOOTER */}
//         <div className="flex justify-end gap-2 mt-4">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border border-theme rounded bg-app"
//           >
//             Cancel
//           </button>
//           <button className="px-4 py-2 bg-primary rounded text-white">
//             Save Template
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// };
