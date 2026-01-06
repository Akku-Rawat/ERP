// CompensationTab.tsx - FIXED WITH OVERRIDE & ADD FEATURES
import React, { useState, useEffect } from "react";
import { Info, AlertTriangle, Plus, Edit2, Trash2, Check } from "lucide-react";
import { 
  getActiveSalaryStructures, 
  calculateSalaryBreakdown,
  getSalaryStructureById,
  getDefaultGrossSalary 
} from "../../../views/hr/tabs/salarystructure";
import type { SalaryComponent } from "../../../views/hr/tabs/salarystructure";

type CompensationTabProps = {
  formData: any;
  handleInputChange: (field: string, value: string | boolean | any) => void;
};

const CompensationTab: React.FC<CompensationTabProps> = ({
  formData,
  handleInputChange,
}) => {
  const [selectedStructure, setSelectedStructure] = useState(formData.salaryStructure || "");
  const [grossSalary, setGrossSalary] = useState(formData.grossSalaryStarting || "");
  const [breakdown, setBreakdown] = useState<any[]>([]);
  const [structures, setStructures] = useState(getActiveSalaryStructures());
  
  // ✅ Custom components state - for overriding & adding
  const [customComponents, setCustomComponents] = useState<SalaryComponent[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingComponent, setEditingComponent] = useState<SalaryComponent | null>(null);

  // ✅ Load default gross salary when structure changes
  useEffect(() => {
    if (!selectedStructure) return;
    
    const defaultGross = getDefaultGrossSalary(selectedStructure);
    if (defaultGross && !grossSalary) {
      setGrossSalary(defaultGross.toString());
    }
  }, [selectedStructure]);

  // ✅ SYNC selectedStructure with formData.salaryStructure
  useEffect(() => {
    if (formData.salaryStructure && formData.salaryStructure !== selectedStructure) {
      setSelectedStructure(formData.salaryStructure);
    }
  }, [formData.salaryStructure]);

  // ✅ Load custom components or default components
  useEffect(() => {
    if (!selectedStructure) {
      setCustomComponents([]);
      return;
    }

    const structure = getSalaryStructureById(selectedStructure);
    if (!structure) return;

    // If formData has custom components, use them; otherwise use structure's default
    if (formData.customSalaryComponents && formData.customSalaryComponents.length > 0) {
      setCustomComponents(formData.customSalaryComponents);
    } else {
      // Deep clone to avoid mutation
      setCustomComponents(JSON.parse(JSON.stringify(structure.components)));
    }
  }, [selectedStructure, formData.customSalaryComponents]);

  // ✅ Calculate breakdown when structure, gross, or custom components change
  useEffect(() => {
    if (!selectedStructure || !grossSalary || customComponents.length === 0) {
      setBreakdown([]);
      return;
    }

    const gross = parseFloat(grossSalary) || 0;
    const calculated = calculateSalaryBreakdown(selectedStructure, gross, customComponents);
    
    setBreakdown(calculated);
    
    // Update formData
    handleInputChange("salaryStructure", selectedStructure);
    handleInputChange("grossSalaryStarting", grossSalary);
    handleInputChange("salaryBreakdown", calculated);
    handleInputChange("customSalaryComponents", customComponents);
  }, [selectedStructure, grossSalary, customComponents]);

  const totalCalculated = breakdown.reduce((sum, item) => sum + item.amount, 0);
  const selectedStructureData = structures.find(s => s.id === selectedStructure);

  // ✅ Edit existing component only
  const handleEditComponent = (component: SalaryComponent) => {
    if (!component.editable) {
      alert("This component cannot be modified (statutory requirement)");
      return;
    }
    setEditingComponent(JSON.parse(JSON.stringify(component)));
    setShowAddModal(true);
  };

  // ✅ Save component (update only)
  const handleSaveComponent = (component: SalaryComponent) => {
    const existingIndex = customComponents.findIndex(c => c.id === component.id);
    
    if (existingIndex >= 0) {
      const updated = [...customComponents];
      updated[existingIndex] = component;
      setCustomComponents(updated);
    }
    
    setShowAddModal(false);
    setEditingComponent(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5">
      <div className="grid grid-cols-2 gap-6">
        {/* Left - Salary Structure Selection */}
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Salary Structure
              </h4>
              <Info className="w-4 h-4 text-gray-400" />
            </div>

            {structures.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">No Active Structures</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Please create salary structures in HR Settings first.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs text-gray-600 mb-2 font-medium">
                    Select Structure *
                  </label>
                  <select
                    value={selectedStructure}
                    onChange={(e) => {
                      setSelectedStructure(e.target.value);
                      handleInputChange("salaryStructure", e.target.value);
                      handleInputChange("salaryStructureSource", "MANUAL");
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Choose salary structure...</option>
                    {structures.map(struct => (
                      <option key={struct.id} value={struct.id}>
                        {struct.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedStructureData && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800 mb-1">
                      <strong>{selectedStructureData.name}</strong>
                    </p>
                    <p className="text-xs text-blue-700">
                      {selectedStructureData.description}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {customComponents.length} components • 
                      Used by {selectedStructureData.usedBy} employees
                    </p>
                  </div>
                )}

                {/* ✅ Gross Salary Input */}
                <div>
                  <label className="block text-xs text-gray-600 mb-2 font-medium">
                    Annual Gross Salary (ZMW) *
                  </label>
                  <input
                    type="number"
                    value={grossSalary}
                    onChange={(e) => setGrossSalary(e.target.value)}
                    placeholder="e.g., 120000"
                    disabled={!selectedStructure}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Monthly: ZMW {(parseFloat(grossSalary || "0") / 12).toLocaleString(undefined, {maximumFractionDigits: 2})}
                  </p>
                  {selectedStructureData?.defaultGrossSalary && (
                    <p className="text-xs text-purple-600 mt-1">
                      💡 Default for this level: ZMW {selectedStructureData.defaultGrossSalary.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* ✅ Components List with Override Only */}
                {customComponents.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-gray-700">Component Breakdown:</p>
                      <p className="text-xs text-gray-500">Click ✏️ to modify values</p>
                    </div>
                    <div className="space-y-2">
                      {breakdown.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                          <div className="flex-1">
                            <span className="text-gray-700 font-medium">
                              {item.component.name}
                            </span>
                            <span className="text-gray-500 text-xs ml-2">
                              {item.component.valueType === "percentage" && `(${item.component.value}%)`}
                              {item.component.valueType === "fixed" && `(Fixed)`}
                              {item.component.valueType === "auto" && `(Auto)`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${
                              item.component.category === "Deduction" ? "text-red-600" : "text-gray-900"
                            }`}>
                              {item.component.category === "Deduction" ? "-" : ""}
                              ZMW {item.amount.toLocaleString(undefined, {maximumFractionDigits: 2})}
                            </span>
                            {item.component.editable && (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleEditComponent(item.component)}
                                  className="text-gray-500 hover:text-purple-600"
                                  title="Edit value"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm font-semibold pt-2 mt-2 border-t">
                      <span>Total Calculated</span>
                      <span className="text-purple-600">
                        ZMW {totalCalculated.toLocaleString(undefined, {maximumFractionDigits: 2})}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Payroll Config */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Payroll Configuration
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleInputChange("currency", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option>ZMW</option>
                  <option>USD</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Frequency</label>
                <select
                  value={formData.paymentFrequency}
                  onChange={(e) => handleInputChange("paymentFrequency", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option>Monthly</option>
                  <option>Bi-weekly</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="BANK">Bank</option>
                  <option value="CASH">Cash</option>
                </select>
              </div>
            </div>
          </div>

        
        </div>

        {/* Right - Bank Details & Insurance */}
        <div className="space-y-5">
          {/* Bank Details */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Bank Account Details
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Account Type</label>
                <select
                  value={formData.accountType}
                  onChange={(e) => handleInputChange("accountType", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Savings">Savings</option>
                  <option value="Current">Current</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Account Name *</label>
                <input
                  type="text"
                  value={formData.accountName}
                  onChange={(e) => handleInputChange("accountName", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Account Number *</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Bank Name *</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange("bankName", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Branch Code</label>
                <input
                  type="text"
                  value={formData.branchCode}
                  onChange={(e) => handleInputChange("branchCode", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
              {/*  Insurance Section */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Insurance & Benefits
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">NHIMA Number</label>
                <input
                  type="text"
                  value={formData.nhimaHealthInsurance || ""}
                  onChange={(e) => handleInputChange("nhimaHealthInsurance", e.target.value)}
                  placeholder="e.g., NH2024001234"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Medical Scheme</label>
                <select
                  value={formData.medicalScheme || "NHIMA"}
                  onChange={(e) => handleInputChange("medicalScheme", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="NHIMA">NHIMA (National)</option>
                  <option value="Private">Private Insurance</option>
                  <option value="Both">NHIMA + Private</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Insurance Provider (Optional)</label>
                <input
                  type="text"
                  value={formData.insuranceProvider || ""}
                  onChange={(e) => handleInputChange("insuranceProvider", e.target.value)}
                  placeholder="e.g., Madison, Medico"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Policy Number (Optional)</label>
                <input
                  type="text"
                  value={formData.insurancePolicyNumber || ""}
                  onChange={(e) => handleInputChange("insurancePolicyNumber", e.target.value)}
                  placeholder="Insurance policy number"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
          </div>
        </div>
        
      </div>

      {/* ✅ Component Edit Modal */}
      {showAddModal && editingComponent && (
        <ComponentEditModal
          component={editingComponent}
          onSave={handleSaveComponent}
          onClose={() => {
            setShowAddModal(false);
            setEditingComponent(null);
          }}
        />
      )}
    </div>
  );
};

// ✅ Component Edit Modal
function ComponentEditModal({ component, onSave, onClose }: {
  component: SalaryComponent;
  onSave: (c: SalaryComponent) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<SalaryComponent>(component);

  const handleSubmit = () => {
    if (formData.valueType !== "auto" && !formData.value && formData.value !== 0) {
      alert("Please enter value");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">
            Edit Component Value
          </h4>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Component Name</label>
            <input
              type="text"
              value={formData.name}
              disabled
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Component name cannot be changed</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                disabled
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Value Type</label>
              <input
                type="text"
                value={formData.valueType === 'percentage' ? 'Percentage' : formData.valueType === 'fixed' ? 'Fixed Amount' : 'Auto'}
                disabled
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Value * {formData.valueType === 'percentage' ? '(%)' : '(ZMW)'}
            </label>
            <input
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
              placeholder={formData.valueType === 'percentage' ? '0-100' : 'Amount'}
              step={formData.valueType === 'percentage' ? '0.1' : '1'}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="taxable"
              checked={formData.taxable}
              onChange={(e) => setFormData({ ...formData, taxable: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="taxable" className="text-sm text-gray-700">Taxable</label>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompensationTab;