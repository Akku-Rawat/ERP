import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

interface PerformanceMetric {
  metricName: string;
  target: string;
  actual: string;
  rating: string;
  comments: string;
}

const emptyMetric: PerformanceMetric = {
  metricName: "",
  target: "",
  actual: "",
  rating: "",
  comments: "",
};

const PerformanceModal: React.FC<PerformanceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    supplier: "",
    reviewPeriodStart: "",
    reviewPeriodEnd: "",
    overallRating: "",
    remarks: "",
  });

  const [metrics, setMetrics] = useState<PerformanceMetric[]>([{ ...emptyMetric }]);

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMetricChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    idx: number
  ) => {
    const updatedMetrics = [...metrics];
    updatedMetrics[idx] = { ...updatedMetrics[idx], [e.target.name]: e.target.value };
    setMetrics(updatedMetrics);
  };

  const addMetric = () => setMetrics([...metrics, { ...emptyMetric }]);

  const removeMetric = (idx: number) => {
    if (metrics.length === 1) return;
    setMetrics(metrics.filter((_, i) => i !== idx));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ ...form, metrics });
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setForm({
      supplier: "",
      reviewPeriodStart: "",
      reviewPeriodEnd: "",
      overallRating: "",
      remarks: "",
    });
    setMetrics([{ ...emptyMetric }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/40">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="rounded-lg bg-white w-[96vw] max-w-6xl shadow-lg flex flex-col max-h-[90vh] overflow-hidden"
        >
          <form className="pb-2 bg-[#fefefe]/10 flex flex-col flex-1 overflow-hidden" onSubmit={handleSave}>
            <div className="flex h-12 items-center justify-between border-b px-6 py-3 rounded-t-lg bg-blue-100/30 shrink-0">
              <h3 className="text-2xl w-full font-semibold text-blue-600">Supplier Performance</h3>
              <button
                type="button"
                className="text-gray-700 hover:bg-[#fefefe] rounded-full w-8 h-8"
                onClick={onClose}
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto border-b px-4">
              {/* PERFORMANCE INFO */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div className="font-semibold text-gray-600 mb-4">PERFORMANCE REVIEW</div>
                <div className="grid grid-cols-8 gap-4 mb-6">
                  <input
                    className="col-span-3 border rounded p-2"
                    placeholder="Supplier"
                    name="supplier"
                    value={form.supplier}
                    onChange={handleFormChange}
                  />
                  <input
                    type="date"
                    className="col-span-2 border rounded p-2"
                    placeholder="Review Period Start"
                    name="reviewPeriodStart"
                    value={form.reviewPeriodStart}
                    onChange={handleFormChange}
                  />
                  <input
                    type="date"
                    className="col-span-2 border rounded p-2"
                    placeholder="Review Period End"
                    name="reviewPeriodEnd"
                    value={form.reviewPeriodEnd}
                    onChange={handleFormChange}
                  />
                  <input
                    className="col-span-1 border rounded p-2"
                    placeholder="Overall Rating"
                    name="overallRating"
                    value={form.overallRating}
                    onChange={handleFormChange}
                  />
                  <textarea
                    className="col-span-8 border rounded p-2"
                    placeholder="Remarks"
                    name="remarks"
                    value={form.remarks}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              {/* PERFORMANCE METRICS */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div className="font-semibold text-gray-600 mb-2">METRICS</div>
                <div className="overflow-x-auto rounded-md border border-gray-200 bg-white mb-2 py-4 px-2">
                  <table className="min-w-full text-xs table-fixed">
                    <thead>
                      <tr className="bg-gray-50 text-gray-800">
                        <th className="w-1/6 px-2 py-1 text-left">METRIC NAME</th>
                        <th className="w-1/6 px-2 py-1 text-left">TARGET</th>
                        <th className="w-1/6 px-2 py-1 text-left">ACTUAL</th>
                        <th className="w-1/6 px-2 py-1 text-left">RATING</th>
                        <th className="w-1/6 px-2 py-1 text-left">COMMENTS</th>
                        <th className="w-1/10 px-2 py-1 text-center"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.map((metric, idx) => (
                        <tr key={idx}>
                          <td className="px-2 py-1">
                            <input
                              className="border rounded p-1 w-full"
                              placeholder="Metric Name"
                              name="metricName"
                              value={metric.metricName}
                              onChange={(e) => handleMetricChange(e, idx)}
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              className="border rounded p-1 w-full"
                              placeholder="Target"
                              name="target"
                              value={metric.target}
                              onChange={(e) => handleMetricChange(e, idx)}
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              className="border rounded p-1 w-full"
                              placeholder="Actual"
                              name="actual"
                              value={metric.actual}
                              onChange={(e) => handleMetricChange(e, idx)}
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              className="border rounded p-1 w-full"
                              placeholder="Rating"
                              name="rating"
                              value={metric.rating}
                              onChange={(e) => handleMetricChange(e, idx)}
                            />
                          </td>
                          <td className="px-2 py-1">
                            <textarea
                              className="border rounded p-1 w-full"
                              placeholder="Comments"
                              name="comments"
                              value={metric.comments}
                              onChange={(e) => handleMetricChange(e, idx)}
                            />
                          </td>
                          <td className="px-2 py-1 text-center">
                            <button
                              type="button"
                              className="bg-red-100 border border-red-300 rounded px-2 py-1"
                              onClick={() => removeMetric(idx)}
                            >
                              -
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div>
                  <button type="button" className="bg-blue-100 border border-blue-300 rounded px-2 py-1" onClick={addMetric}>
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="m-3 flex items-center justify-between gap-x-7 shrink-0">
              <button
                type="button"
                className="w-24 rounded-3xl bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700"
                onClick={onClose}
              >
                Cancel
              </button>
              <div className="flex gap-x-2">
                <button
                  type="submit"
                  className="w-24 rounded-3xl bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="w-24 rounded-3xl bg-gray-300 text-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-500 hover:text-white"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PerformanceModal;