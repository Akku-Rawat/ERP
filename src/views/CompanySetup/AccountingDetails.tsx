import React, { useState } from 'react';
import { DollarSign, TrendingDown, RefreshCw, Target, CheckCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800 font-medium text-sm">Configuration saved successfully!</p>
          </div>
        )}

   

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* General Accounts Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
                <DollarSign className="w-4 h-4 text-slate-600" />
                <h2 className="text-base font-semibold text-slate-900">General Accounts</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Chart of Accounts <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="chartOfAccounts"
                    value={formData.chartOfAccounts}
                    onChange={handleChange}
                    placeholder="e.g., Standard Chart of Accounts"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Default Expense GL
                  </label>
                  <input
                    type="text"
                    name="defaultExpenseGL"
                    value={formData.defaultExpenseGL}
                    onChange={handleChange}
                    placeholder="e.g., 5000-001"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Exchange Rate Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
                <RefreshCw className="w-4 h-4 text-slate-600" />
                <h2 className="text-base font-semibold text-slate-900">Exchange Rate</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Exchange Gain and Loss Account
                  </label>
                  <input
                    type="text"
                    name="exchangeGainLossAccount"
                    value={formData.exchangeGainLossAccount}
                    onChange={handleChange}
                    placeholder="e.g., 7500-001"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Revaluation Frequency
                  </label>
                  <select
                    name="exchangeRateRevaluationFreq"
                    value={formData.exchangeRateRevaluationFreq}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all cursor-pointer"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Rounding Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
                <Target className="w-4 h-4 text-slate-600" />
                <h2 className="text-base font-semibold text-slate-900">Rounding Configuration</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Round Off Account
                  </label>
                  <input
                    type="text"
                    name="roundOffAccount"
                    value={formData.roundOffAccount}
                    onChange={handleChange}
                    placeholder="e.g., 6800-001"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Round Off Cost Center
                  </label>
                  <input
                    type="text"
                    name="roundOffCostCenter"
                    value={formData.roundOffCostCenter}
                    onChange={handleChange}
                    placeholder="e.g., CC-001"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Asset Accounts Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
                <TrendingDown className="w-4 h-4 text-slate-600" />
                <h2 className="text-base font-semibold text-slate-900">Asset Valuation</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Depreciation Expense Account
                  </label>
                  <input
                    type="text"
                    name="depreciationExpenseAccount"
                    value={formData.depreciationExpenseAccount}
                    onChange={handleChange}
                    placeholder="e.g., 6500-001"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Appreciation Income Account
                  </label>
                  <input
                    type="text"
                    name="appreciationIncomeAccount"
                    value={formData.appreciationIncomeAccount}
                    onChange={handleChange}
                    placeholder="e.g., 4500-001"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-xs text-slate-500">
            <span className="text-red-500">*</span> Required fields
          </p>
          <div className="flex gap-3">
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
              })}
              className="px-5 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 shadow-sm hover:shadow transition-all"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountingDetails;