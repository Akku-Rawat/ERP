// EntryFormTabs.tsx - New Payroll Entry Form Tab Components

import React from 'react';
import type { PayrollEntry, Employee } from './types';

interface OverviewTabProps {
  data: PayrollEntry;
  onChange: (field: string, value: any) => void;
}


export const OverviewTab: React.FC<OverviewTabProps> = ({ data, onChange }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-6">
      <div>
  <label className="block text-sm font-semibold text-slate-700 mb-2">
    Payroll Name <span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    value={data.payrollName}
    onChange={(e) => onChange("payrollName", e.target.value)}
    placeholder="e.g. March Payroll"
    className="w-full px-4 py-3 border border-slate-300 rounded-lg
      focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
  />
</div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Posting Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={data.postingDate}
          onChange={(e) => onChange('postingDate', e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Currency <span className="text-red-500">*</span>
        </label>
        <select
          value={data.currency}
          onChange={(e) => onChange('currency', e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
        >
          <option value="INR">INR</option>
          <option value="USD">USD</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Company <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.company}
          onChange={(e) => onChange('company', e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Payroll Payable Account <span className="text-red-500">*</span>
        </label>
        <select
          value={data.payrollPayableAccount}
          onChange={(e) => onChange('payrollPayableAccount', e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
        >
          <option value="Payroll Payable - I">Payroll Payable - I</option>
          <option value="Payroll Payable - II">Payroll Payable - II</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
        <input
          type="text"
          value={data.status}
          readOnly
          className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Payroll Frequency <span className="text-red-500">*</span>
        </label>
        <select
          value={data.payrollFrequency}
          onChange={(e) => onChange('payrollFrequency', e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
        >
          <option value="">Select</option>
          <option value="Monthly">Monthly</option>
          <option value="Biweekly">Biweekly</option>
        </select>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6">
      <label className="flex items-center gap-3 p-4 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer">
        <input
          type="checkbox"
          checked={data.salarySlipTimesheet}
          onChange={(e) => onChange('salarySlipTimesheet', e.target.checked)}
          className="w-5 h-5 text-blue-600 rounded"
        />
        <span className="text-sm font-medium">Salary Slip Based on Timesheet</span>
      </label>
      <label className="flex items-center gap-3 p-4 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer">
        <input
          type="checkbox"
          checked={data.deductTaxForProof}
          onChange={(e) => onChange('deductTaxForProof', e.target.checked)}
          className="w-5 h-5 text-blue-600 rounded"
        />
        <span className="text-sm font-medium">Deduct Tax For Unsubmitted Proof</span>
      </label>
    </div>
    <div className="grid grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Start Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={data.startDate}
          onChange={(e) => onChange('startDate', e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          End Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={data.endDate}
          onChange={(e) => onChange('endDate', e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
        />
      </div>
    </div>
  </div>
);

interface EmployeesTabProps {
  data: PayrollEntry;
  onChange: (field: string, value: any) => void;
  employees: Employee[];
}

export const EmployeesTab: React.FC<EmployeesTabProps> = ({ data, onChange, employees }) => {
  const toggleEmployee = (empId: string) => {
    const current = data.selectedEmployees || [];
    const updated = current.includes(empId) 
      ? current.filter(id => id !== empId) 
      : [...current, empId];
    onChange('selectedEmployees', updated);
  };
  const filteredEmployees = employees.filter((e) => {
  if (!e.isActive) return false;

  if (data.branch && e.branch !== data.branch) return false;
  if (data.department && e.department !== data.department) return false;
  if (data.designation && e.designation !== data.designation) return false;
  if (data.grade && e.grade !== data.grade) return false;

  return true;
});


  const selectAll = () => {
    const allIds = filteredEmployees.map(e => e.id);

    onChange('selectedEmployees', 
      data.selectedEmployees?.length === allIds.length ? [] : allIds
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-slate-50">
  <input
    placeholder="Branch"
    value={data.branch || ""}
    onChange={(e) => onChange("branch", e.target.value)}
    className="px-4 py-2 border rounded-lg"
  />
  <input
    placeholder="Designation"
    value={data.designation || ""}
    onChange={(e) => onChange("designation", e.target.value)}
    className="px-4 py-2 border rounded-lg"
  />
  <input
    placeholder="Department"
    value={data.department || ""}
    onChange={(e) => onChange("department", e.target.value)}
    className="px-4 py-2 border rounded-lg"
  />
  <input
    placeholder="Grade"
    value={data.grade || ""}
    onChange={(e) => onChange("grade", e.target.value)}
    className="px-4 py-2 border rounded-lg"
  />
  <span className="text-sm font-medium text-blue-700">
  {filteredEmployees.length} employees
</span>
</div>

      <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.selectedEmployees?.length === employees.filter(e => e.isActive).length}
            onChange={selectAll}
            className="w-5 h-5 text-blue-600 rounded"
          />
          <span className="font-semibold text-blue-900">Select All Employees</span>
        </label>
        <span className="text-sm font-medium text-blue-700">
          {data.selectedEmployees?.length || 0} selected
        </span>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {employees.filter(e => e.isActive).map(emp => {
          const isSelected = data.selectedEmployees?.includes(emp.id);
          return (
            <div
              key={emp.id}
              onClick={() => toggleEmployee(emp.id)}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <div>
                    <p className="font-semibold text-slate-800">{emp.name}</p>
                    <p className="text-sm text-slate-600">{emp.id} • {emp.designation}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">
                    ₹{(emp.basicSalary + emp.hra + emp.allowances).toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">Gross</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface AccountingTabProps {
  data: PayrollEntry;
  onChange: (field: string, value: any) => void;
  employees: Employee[];
}

export const AccountingTab: React.FC<AccountingTabProps> = ({ data, onChange, employees }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Payment Account <span className="text-red-500">*</span>
        </label>
        <select
          value={data.paymentAccount}
          onChange={(e) => onChange('paymentAccount', e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
        >
          <option value="">Select</option>
          <option value="HDFC Bank">HDFC Bank</option>
          <option value="ICICI Bank">ICICI Bank</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Cost Center</label>
        <select
          value={data.costCenter}
          onChange={(e) => onChange('costCenter', e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
        >
          <option value="">Select</option>
          <option value="Engineering">Engineering</option>
          <option value="Sales">Sales</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Project</label>
        <select
          value={data.project}
          onChange={(e) => onChange('project', e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
        >
          <option value="">Select</option>
          <option value="Project Alpha">Project Alpha</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Letter Head</label>
        <select
          value={data.letterHead}
          onChange={(e) => onChange('letterHead', e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
        >
          <option value="">Select</option>
          <option value="Company">Company</option>
        </select>
      </div>
    </div>
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
      <h3 className="font-bold text-blue-900 mb-4">Payment Summary</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4">
          <p className="text-xs text-slate-600 mb-1">Employees</p>
          <p className="text-2xl font-bold text-slate-800">{data.selectedEmployees?.length || 0}</p>
        </div>
        <div className="bg-white rounded-lg p-4">
          <p className="text-xs text-slate-600 mb-1">Est. Gross</p>
          <p className="text-2xl font-bold text-green-600">
            ₹{employees.filter(e => data.selectedEmployees?.includes(e.id))
              .reduce((sum, e) => sum + e.basicSalary + e.hra + e.allowances, 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4">
          <p className="text-xs text-slate-600 mb-1">Est. Net</p>
          <p className="text-2xl font-bold text-blue-600">
            ₹{Math.round(
              employees.filter(e => data.selectedEmployees?.includes(e.id))
                .reduce((sum, e) => sum + e.basicSalary + e.hra + e.allowances, 0) * 0.76
            ).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  </div>
);