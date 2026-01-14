// import React, { useRef } from "react";
// import QuotationDefaultTemplate from "../quotation/QuotationDefaultTemplate";
// import generateQuotationPDF from "../quotation/QuotationTemplate1";
// import QuotationTemplate2 from "../quotation/QuotationTemplate2";
// import QuotationTemplate3 from "../quotation/QuotationTemplate3";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// // import type { QuotationData } from "../quotation/QuotationTemplate1";

// const templates = [
//   { id: "default", name: "Current Quotation", color: "bg-gray-600" },
//   { id: "quotation1", name: "Quotation Template 1", color: "bg-[#748B75]" },
//   { id: "quotation2", name: "Quotation Template 2", color: "bg-[#D4B5A0]" },
//   { id: "quotation3", name: "Quotation Template 3", color: "bg-[#B2B1CF]" },
// ];

// const templateComponents: { [key: string]: React.FC<{ data: QuotationData }> } =
//   {
//     default: QuotationDefaultTemplate,
//     quotation1: QuotationTemplate1,
//     quotation2: QuotationTemplate2,
//     quotation3: QuotationTemplate3,
//   };

// interface QuotationUploadModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   data: QuotationData;
//   selectedTemplateId: string;
//   setSelectedTemplateId: (id: string) => void;
//   previewMode?: boolean;
// }

// const QuotationUploadModal: React.FC<QuotationUploadModalProps> = ({
//   isOpen,
//   onClose,
//   data,
//   selectedTemplateId,
//   setSelectedTemplateId,
//   previewMode = false,
// }) => {
//   const scrollRef = useRef<HTMLDivElement>(null);

//   if (!isOpen) return null;

//   // Full left/right scroll
//   const handleScroll = (dir: "left" | "right") => {
//     if (!scrollRef.current) return;
//     if (dir === "left") {
//       scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
//     } else {
//       scrollRef.current.scrollTo({
//         left: scrollRef.current.scrollWidth,
//         behavior: "smooth",
//       });
//     }
//   };

//   // Preview Mode: Show only the selected template in full size
//   if (previewMode) {
//     const SelectedComponent = templateComponents[selectedTemplateId];
//     return (
//       <div
//         className="fixed inset-0 z-50 flex justify-center items-center p-4"
//         style={{ background: "rgba(0,0,0,0.7)" }}
//       >
//         <div className="bg-white rounded-2xl shadow-2xl max-w-[95vw] w-full max-h-[95vh] flex flex-col overflow-hidden relative">
//           {/* Header */}
//           <div className="flex items-center justify-between px-8 py-4 border-b bg-gradient-to-r from-gray-50 to-blue-50">
//             <h2 className="text-2xl font-bold">Quotation Preview</h2>
//             <button
//               onClick={onClose}
//               className="ml-2 text-2xl p-1 rounded hover:bg-gray-200 transition text-gray-500"
//             >
//               ×
//             </button>
//           </div>
//           {/* Full Preview */}
//           <div className="flex-1 overflow-auto p-8 bg-gray-100">
//             <div className="max-w-[210mm] mx-auto bg-white shadow-lg">
//               {SelectedComponent && <SelectedComponent data={data} />}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Selection Mode: Show template gallery
//   return (
//     <div
//       className="fixed inset-0 z-50 flex justify-center items-center p-4"
//       style={{ background: "rgba(255,255,255,0.85)" }}
//     >
//       <div className="bg-white rounded-2xl shadow-2xl max-w-[95vw] w-full max-h-[92vh] flex flex-col overflow-hidden relative">
//         {/* Header */}
//         <div className="flex items-center justify-between px-8 py-4 border-b bg-gradient-to-r from-gray-50 to-blue-50">
//           <h2 className="text-2xl font-bold">Update Quotation Template</h2>
//           <button
//             onClick={onClose}
//             className="ml-2 text-2xl p-1 rounded hover:bg-gray-200 transition text-gray-500"
//           >
//             ×
//           </button>
//         </div>

//         {/* Template Gallery */}
//         <div className="relative flex items-center flex-1 min-h-0 py-8">
//           {/* Left Arrow */}
//           <button
//             className="absolute left-2 z-10 top-1/2 -translate-y-1/2 bg-white rounded-full shadow border p-2 hover:bg-gray-100"
//             onClick={() => handleScroll("left")}
//             aria-label="Scroll left"
//             tabIndex={0}
//           >
//             <ChevronLeft size={34} />
//           </button>

//           {/* Scrollable Row */}
//           <div
//             ref={scrollRef}
//             className="overflow-x-auto flex-1 hide-scrollbar px-0"
//             style={{ scrollBehavior: "smooth" }}
//           >
//             <div className="flex min-w-max">
//               {templates.map((template, idx) => {
//                 const Comp = templateComponents[template.id];
//                 return (
//                   <div
//                     key={template.id}
//                     onClick={() => setSelectedTemplateId(template.id)}
//                     onDoubleClick={() => {
//                       setSelectedTemplateId(template.id);
//                       onClose();
//                     }}
//                     className={`bg-white rounded-lg shadow-xl overflow-hidden flex flex-col items-center w-[370px] max-w-[370px] min-w-[340px] border-2 cursor-pointer transition
//                       ${
//                         selectedTemplateId === template.id
//                           ? "border-blue-700 ring-2 ring-blue-400"
//                           : "border-gray-300"
//                       }
//                       hover:shadow-2xl hover:scale-[1.02]"
//                       ${idx < templates.length - 1 ? "mr-8" : ""}`}
//                     tabIndex={0}
//                     role="button"
//                     aria-pressed={selectedTemplateId === template.id}
//                   >
//                     <div className="w-full h-[370px] flex justify-center items-start p-2 overflow-hidden bg-gray-50">
//                       <div className="w-[580px] h-[1050px] flex justify-center items-start scale-[0.36] origin-top">
//                         {Comp && <Comp data={data} />}
//                       </div>
//                     </div>
//                     <div
//                       className={`text-white text-center w-full py-2 font-semibold text-base ${template.color}`}
//                     >
//                       {template.name}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//           {/* Right Arrow */}
//           <button
//             className="absolute right-2 z-10 top-1/2 -translate-y-1/2 bg-white rounded-full shadow border p-2 hover:bg-gray-100"
//             onClick={() => handleScroll("right")}
//             aria-label="Scroll right"
//             tabIndex={0}
//           >
//             <ChevronRight size={34} />
//           </button>
//         </div>
//         <style>{`
//           .hide-scrollbar::-webkit-scrollbar { display:none }
//           .hide-scrollbar { scrollbar-width:none; -ms-overflow-style:none }
//         `}</style>
//       </div>
//     </div>
//   );
// };

// export default QuotationUploadModal;
