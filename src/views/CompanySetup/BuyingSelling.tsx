import React, { useState } from 'react';
import { ShoppingCart, TrendingUp, CheckCircle } from 'lucide-react';

const BuyingSelling: React.FC = () => {
  const [formData, setFormData] = useState({
    defaultBuyingTerms: '',
    defaultSellingTerms: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log(formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex  justify-center">
      <div className="w-full max-w-4xl">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800 font-medium text-sm">Terms saved successfully!</p>
          </div>
        )}


        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Buying Terms */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">Default Buying Terms</h2>
                <p className="text-xs text-slate-500">Terms for purchase orders</p>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Terms & Conditions <span className="text-red-500">*</span>
              </label>
              <textarea
                name="defaultBuyingTerms"
                value={formData.defaultBuyingTerms}
                onChange={handleChange}
                placeholder="e.g., Payment within 30 days, FOB shipping point, 2% discount if paid within 10 days..."
                rows={6}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
              <p className="text-xs text-slate-500 mt-2">These terms will be applied to all purchase orders by default</p>
            </div>
          </div>

          {/* Selling Terms */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">Default Selling Terms</h2>
                <p className="text-xs text-slate-500">Terms for sales orders</p>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Terms & Conditions <span className="text-red-500">*</span>
              </label>
              <textarea
                name="defaultSellingTerms"
                value={formData.defaultSellingTerms}
                onChange={handleChange}
                placeholder="e.g., Net 30 days, goods remain property of seller until payment received, late payments subject to 1.5% monthly interest..."
                rows={6}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
              />
              <p className="text-xs text-slate-500 mt-2">These terms will be applied to all sales orders by default</p>
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
                defaultBuyingTerms: '',
                defaultSellingTerms: '',
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
              Save Terms
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyingSelling;