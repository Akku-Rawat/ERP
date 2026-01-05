import { useState } from "react";
import { Plus, Edit2, Trash2, Save } from "lucide-react";

type Component = {
  id: number;
  name: string;
  category: "Earning" | "Deduction";
  valueType: "percentage" | "fixed" | "auto";
  value: number | string;
  taxable: boolean;
};

export default function SalaryStructureTab() {
  const [structureName, setStructureName] = useState("Executive Level");
  const [components, setComponents] = useState<Component[]>([
    { id: 1, name: "Basic Salary", category: "Earning", valueType: "percentage", value: 60, taxable: true },
    { id: 2, name: "House Allowance", category: "Earning", valueType: "percentage", value: 20, taxable: true },
    { id: 3, name: "Transport", category: "Earning", valueType: "percentage", value: 15, taxable: true },
    { id: 4, name: "Medical", category: "Earning", valueType: "fixed", value: 500, taxable: false },
    { id: 5, name: "NAPSA (5%)", category: "Deduction", valueType: "auto", value: "5% of Basic", taxable: false },
    { id: 6, name: "PAYE", category: "Deduction", valueType: "auto", value: "Tax Slab", taxable: false },
  ]);

  const handleSave = () => {
    alert("Salary Structure saved successfully!");
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this component?")) {
      setComponents(components.filter((c) => c.id !== id));
    }
  };

  // Calculate preview
  const grossExample = 10000;
  const basic = grossExample * 0.6;
  const hra = grossExample * 0.2;
  const transport = grossExample * 0.15;
  const medical = 500;
  const totalEarnings = basic + hra + transport + medical;
  const napsa = basic * 0.05;
  const paye = 850;
  const totalDeductions = napsa + paye;
  const netPay = totalEarnings - totalDeductions;

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Salary Structure</h2>
        <p className="text-sm text-gray-600 mt-1">Define salary components and calculations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Structure Name *</label>
              <input
                type="text"
                value={structureName}
                onChange={(e) => setStructureName(e.target.value)}
                placeholder="e.g., Executive Level"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Effective From *</label>
                <input
                  type="date"
                  defaultValue="2025-01-01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option>Active</option>
                  <option>Draft</option>
                </select>
              </div>
            </div>
          </div>

          {/* Components Table */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Components</h3>
              <button className="text-sm text-purple-600 font-medium hover:underline flex items-center gap-1">
                <Plus className="w-4 h-4" />
                Add Component
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Component</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Category</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Value</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {components.map((comp) => (
                    <tr key={comp.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{comp.name}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                            comp.category === "Earning"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {comp.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 capitalize">{comp.valueType}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {typeof comp.value === "number"
                          ? comp.valueType === "percentage"
                            ? `${comp.value}%`
                            : `ZMW ${comp.value}`
                          : comp.value}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button className="text-gray-600 hover:text-purple-600">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(comp.id)}
                            className="text-gray-600 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Structure
            </button>
          </div>
        </div>

        {/* Right - Preview */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6 sticky top-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">💰 Calculation Preview</h3>

            <div className="bg-white rounded-lg p-4 text-sm space-y-3">
              <div className="text-center pb-3 border-b">
                <p className="text-xs text-gray-600">Example for</p>
                <p className="text-xl font-bold text-gray-900">ZMW {grossExample.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Gross Pay</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">EARNINGS:</p>
                <div className="space-y-1 pl-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Basic (60%)</span>
                    <span className="font-medium">{basic.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">HRA (20%)</span>
                    <span className="font-medium">{hra.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Transport (15%)</span>
                    <span className="font-medium">{transport.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Medical</span>
                    <span className="font-medium">{medical.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-between text-xs font-semibold pt-2 mt-2 border-t">
                  <span>Total Earnings</span>
                  <span>{totalEarnings.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">DEDUCTIONS:</p>
                <div className="space-y-1 pl-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">NAPSA (5%)</span>
                    <span className="font-medium">{napsa.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">PAYE</span>
                    <span className="font-medium">{paye.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-between text-xs font-semibold pt-2 mt-2 border-t">
                  <span>Total Deductions</span>
                  <span>{totalDeductions.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-900">NET PAY</span>
                  <span className="text-lg font-bold text-green-600">
                    ZMW {netPay.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}