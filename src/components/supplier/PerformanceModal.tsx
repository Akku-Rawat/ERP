import React, { useState } from "react";

interface PerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const PerformanceModal: React.FC<PerformanceModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    supplier: "",
    period: "",
    onTimeDelivery: "",
    qtyReceivedVsOrdered: "",
    qualityDefectRate: "",
    costVariance: "",
    complianceRating: "",
    overallScore: "",
    remarks: "",
  });

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-h-full overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Add Performance Record</h3>
        <input
          type="text"
          placeholder="Supplier"
          value={form.supplier}
          onChange={(e) => setForm({ ...form, supplier: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />
        <input
          type="date"
          placeholder="Period / Date"
          value={form.period}
          onChange={(e) => setForm({ ...form, period: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />
        <input
          type="number"
          placeholder="On-Time Delivery (%)"
          value={form.onTimeDelivery}
          onChange={(e) => setForm({ ...form, onTimeDelivery: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />
        <input
          type="number"
          placeholder="Qty Received vs Ordered (%)"
          value={form.qtyReceivedVsOrdered}
          onChange={(e) => setForm({ ...form, qtyReceivedVsOrdered: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />
        <input
          type="number"
          placeholder="Quality Defect Rate (%)"
          value={form.qualityDefectRate}
          onChange={(e) => setForm({ ...form, qualityDefectRate: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />
        <input
          type="number"
          placeholder="Cost Variance (%)"
          value={form.costVariance}
          onChange={(e) => setForm({ ...form, costVariance: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />
        <input
          type="text"
          placeholder="Compliance / Contract Adherence"
          value={form.complianceRating}
          onChange={(e) => setForm({ ...form, complianceRating: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />
        <input
          type="number"
          placeholder="Overall Score (1-5)"
          value={form.overallScore}
          onChange={(e) => setForm({ ...form, overallScore: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />
        <textarea
          placeholder="Remarks"
          value={form.remarks}
          onChange={(e) => setForm({ ...form, remarks: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-md border">
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmit(form);
              onClose();
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerformanceModal;
