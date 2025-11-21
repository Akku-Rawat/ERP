import React, { useState } from 'react';
import {
  FaDollarSign,
  FaChartArea,
  FaSyncAlt,
  FaBullseye,
  FaCheckCircle
} from "react-icons/fa";

const AccountingDetails: React.FC = () => {
  const [formData, setFormData] = useState({
    chartOfAccounts: '',
    defaultExpenseGL: '',
    exchangeGainLossAccount: '',
    exchangeRateRevaluationFreq: 'Monthly',
    roundOffAccount: '',
    roundOffCostCenter: '',
    depreciationExpenseAccount: '',
    appreciationIncomeAccount: '',
    currency: 'INR',
    financialYearBegins: 'April',
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log(formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="bg-slate-50 min-h-screen p-1">
      <div className="max-w-7xl mx-auto">
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <FaCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm font-medium text-green-800">Configuration saved successfully!</p>
          </div>
        )}

        <div className="bg-white rounded-lg border border-slate-200">
          <div className="px-6 py-6">

            <div className="mb-4 border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Currency</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                  </select>
                  <p className="mt-1.5 text-xs text-slate-500">Base currency for financial reporting</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Financial Year Begins</label>
                  <select
                    name="financialYearBegins"
                    value={formData.financialYearBegins}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="January">January</option>
                    <option value="April">April</option>
                    <option value="July">July</option>
                    <option value="October">October</option>
                  </select>
                  <p className="mt-1.5 text-xs text-slate-500">Month when the financial year starts</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-md font-semibold text-slate-900 flex items-center gap-2">
                      <FaDollarSign className="w-4 h-4 text-teal-600" />
                      General Accounts
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Primary general ledger accounts</p>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Chart of Accounts <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="chartOfAccounts"
                      value={formData.chartOfAccounts}
                      onChange={handleChange}
                      placeholder="e.g., Standard Chart of Accounts"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <p className="mt-1.5 text-xs text-slate-500">Primary chart of accounts for your organization</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Default Expense GL</label>
                    <input
                      type="text"
                      name="defaultExpenseGL"
                      value={formData.defaultExpenseGL}
                      onChange={handleChange}
                      placeholder="e.g., 5000-001"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <p className="mt-1.5 text-xs text-slate-500">Default account for general expense transactions</p>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-md font-semibold text-slate-900 flex items-center gap-2">
                      <FaSyncAlt className="w-4 h-4 text-teal-600" />
                      Exchange Rate
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Currency exchange settings and revaluation</p>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Exchange Gain and Loss Account</label>
                    <input
                      type="text"
                      name="exchangeGainLossAccount"
                      value={formData.exchangeGainLossAccount}
                      onChange={handleChange}
                      placeholder="e.g., 7500-001"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <p className="mt-1.5 text-xs text-slate-500">Account to record foreign exchange gains and losses</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Revaluation Frequency</label>
                    <select
                      name="exchangeRateRevaluationFreq"
                      value={formData.exchangeRateRevaluationFreq}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                    </select>
                    <p className="mt-1.5 text-xs text-slate-500">How often currency revaluation should be performed</p>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-md font-semibold text-slate-900 flex items-center gap-2">
                      <FaBullseye className="w-4 h-4 text-teal-600" />
                      Rounding Configuration
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Accounts for handling rounding differences</p>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Round Off Account</label>
                    <input
                      type="text"
                      name="roundOffAccount"
                      value={formData.roundOffAccount}
                      onChange={handleChange}
                      placeholder="e.g., 6800-001"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <p className="mt-1.5 text-xs text-slate-500">Account to track rounding adjustments in transactions</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Round Off Cost Center</label>
                    <input
                      type="text"
                      name="roundOffCostCenter"
                      value={formData.roundOffCostCenter}
                      onChange={handleChange}
                      placeholder="e.g., CC-001"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <p className="mt-1.5 text-xs text-slate-500">Cost center for allocating rounding differences</p>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-md font-semibold text-slate-900 flex items-center gap-2">
                      <FaChartArea className="w-4 h-4 text-teal-600" />
                      Asset Valuation
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Accounts for depreciation and appreciation</p>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Depreciation Expense Account</label>
                    <input
                      type="text"
                      name="depreciationExpenseAccount"
                      value={formData.depreciationExpenseAccount}
                      onChange={handleChange}
                      placeholder="e.g., 6500-001"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <p className="mt-1.5 text-xs text-slate-500">Account to record asset depreciation expenses</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Appreciation Income Account</label>
                    <input
                      type="text"
                      name="appreciationIncomeAccount"
                      value={formData.appreciationIncomeAccount}
                      onChange={handleChange}
                      placeholder="e.g., 4500-001"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <p className="mt-1.5 text-xs text-slate-500">Account to record asset appreciation income</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setFormData({
                  chartOfAccounts: '',
                  defaultExpenseGL: '',
                  exchangeGainLossAccount: '',
                  exchangeRateRevaluationFreq: 'Monthly',
                  roundOffAccount: '',
                  roundOffCostCenter: '',
                  depreciationExpenseAccount: '',
                  appreciationIncomeAccount: '',
                  currency: 'INR',
                  financialYearBegins: 'April',
                })}
                className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-5 py-2.5 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountingDetails;
