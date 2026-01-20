// LoansAdvances.tsx - Loan and Advance Management Components

import React, { useState } from 'react';
import { DollarSign, CreditCard, Plus, TrendingDown } from 'lucide-react';
import type { LoanRecord, AdvanceRecord, Employee } from './types';
import { demoLoans, demoAdvances } from './constants';

interface LoanManagerProps {
  employees: Employee[];
}

export const LoanManager: React.FC<LoanManagerProps> = ({ employees }) => {
  const [loans, setLoans] = useState<LoanRecord[]>(demoLoans);
  const [showAddLoan, setShowAddLoan] = useState(false);
  const [newLoan, setNewLoan] = useState<Partial<LoanRecord>>({
    employeeId: '',
    loanType: 'Personal',
    amount: 0,
    emiAmount: 0,
    startDate: '',
    endDate: ''
  });

  const handleAddLoan = () => {
    if (!newLoan.employeeId || !newLoan.amount || !newLoan.emiAmount) {
      alert('Fill all required fields');
      return;
    }

    const loan: LoanRecord = {
      id: `LOAN${Date.now()}`,
      employeeId: newLoan.employeeId!,
      loanType: newLoan.loanType as any,
      amount: newLoan.amount!,
      remainingAmount: newLoan.amount!,
      emiAmount: newLoan.emiAmount!,
      startDate: newLoan.startDate!,
      endDate: newLoan.endDate!,
      status: 'Active'
    };

    setLoans([...loans, loan]);
    setShowAddLoan(false);
    setNewLoan({
      employeeId: '',
      loanType: 'Personal',
      amount: 0,
      emiAmount: 0,
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-orange-600" />
          Loan Management
        </h3>
        <button
          onClick={() => setShowAddLoan(!showAddLoan)}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />Add Loan
        </button>
      </div>

      {showAddLoan && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-orange-900 mb-3">New Loan</h4>
          <div className="grid grid-cols-2 gap-4">
            <select
              value={newLoan.employeeId}
              onChange={(e) => setNewLoan({ ...newLoan, employeeId: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
            <select
              value={newLoan.loanType}
              onChange={(e) => setNewLoan({ ...newLoan, loanType: e.target.value as any })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Personal">Personal Loan</option>
              <option value="Home">Home Loan</option>
              <option value="Vehicle">Vehicle Loan</option>
              <option value="Emergency">Emergency Loan</option>
            </select>
            <input
              type="number"
              value={newLoan.amount || ''}
              onChange={(e) => setNewLoan({ ...newLoan, amount: parseFloat(e.target.value) })}
              placeholder="Loan Amount"
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="number"
              value={newLoan.emiAmount || ''}
              onChange={(e) => setNewLoan({ ...newLoan, emiAmount: parseFloat(e.target.value) })}
              placeholder="EMI Amount"
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="date"
              value={newLoan.startDate}
              onChange={(e) => setNewLoan({ ...newLoan, startDate: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="date"
              value={newLoan.endDate}
              onChange={(e) => setNewLoan({ ...newLoan, endDate: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAddLoan}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Add Loan
            </button>
            <button
              onClick={() => setShowAddLoan(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {loans.map(loan => {
          const emp = employees.find(e => e.id === loan.employeeId);
          const progress = ((loan.amount - loan.remainingAmount) / loan.amount) * 100;
          
          return (
            <div key={loan.id} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-slate-800">{emp?.name}</p>
                  <p className="text-sm text-slate-600">{loan.loanType} Loan • {loan.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  loan.status === 'Active' ? 'bg-green-100 text-green-700' :
                  loan.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {loan.status}
                </span>
              </div>
              
              <div className="grid grid-cols-4 gap-3 mb-3">
                <div className="bg-orange-50 rounded p-2">
                  <p className="text-xs text-slate-600">Total Amount</p>
                  <p className="font-bold text-slate-800">₹{loan.amount.toLocaleString()}</p>
                </div>
                <div className="bg-red-50 rounded p-2">
                  <p className="text-xs text-slate-600">Remaining</p>
                  <p className="font-bold text-red-600">₹{loan.remainingAmount.toLocaleString()}</p>
                </div>
                <div className="bg-blue-50 rounded p-2">
                  <p className="text-xs text-slate-600">EMI/Month</p>
                  <p className="font-bold text-blue-600">₹{loan.emiAmount.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 rounded p-2">
                  <p className="text-xs text-slate-600">Paid</p>
                  <p className="font-bold text-green-600">{progress.toFixed(0)}%</p>
                </div>
              </div>
              
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <p className="text-xs text-slate-500 mt-2">
                {new Date(loan.startDate).toLocaleDateString()} - {new Date(loan.endDate).toLocaleDateString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface AdvanceManagerProps {
  employees: Employee[];
}

export const AdvanceManager: React.FC<AdvanceManagerProps> = ({ employees }) => {
  const [advances, setAdvances] = useState<AdvanceRecord[]>(demoAdvances);
  const [showAddAdvance, setShowAddAdvance] = useState(false);
  const [newAdvance, setNewAdvance] = useState<Partial<AdvanceRecord>>({
    employeeId: '',
    amount: 0,
    deductionAmount: 0,
    reason: ''
  });

  const handleAddAdvance = () => {
    if (!newAdvance.employeeId || !newAdvance.amount || !newAdvance.deductionAmount) {
      alert('Fill all required fields');
      return;
    }

    const advance: AdvanceRecord = {
      id: `ADV${Date.now()}`,
      employeeId: newAdvance.employeeId!,
      amount: newAdvance.amount!,
      deductionAmount: newAdvance.deductionAmount!,
      remainingAmount: newAdvance.amount!,
      reason: newAdvance.reason!,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };

    setAdvances([...advances, advance]);
    setShowAddAdvance(false);
    setNewAdvance({
      employeeId: '',
      amount: 0,
      deductionAmount: 0,
      reason: ''
    });
  };

  const handleApprove = (id: string) => {
    setAdvances(advances.map(a => a.id === id ? { ...a, status: 'Deducting' as const } : a));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-teal-600" />
          Advance Management
        </h3>
        <button
          onClick={() => setShowAddAdvance(!showAddAdvance)}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />Add Advance
        </button>
      </div>

      {showAddAdvance && (
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-teal-900 mb-3">New Advance</h4>
          <div className="grid grid-cols-2 gap-4">
            <select
              value={newAdvance.employeeId}
              onChange={(e) => setNewAdvance({ ...newAdvance, employeeId: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
            <input
              type="number"
              value={newAdvance.amount || ''}
              onChange={(e) => setNewAdvance({ ...newAdvance, amount: parseFloat(e.target.value) })}
              placeholder="Advance Amount"
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="number"
              value={newAdvance.deductionAmount || ''}
              onChange={(e) => setNewAdvance({ ...newAdvance, deductionAmount: parseFloat(e.target.value) })}
              placeholder="Monthly Deduction"
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="text"
              value={newAdvance.reason}
              onChange={(e) => setNewAdvance({ ...newAdvance, reason: e.target.value })}
              placeholder="Reason"
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAddAdvance}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              Request Advance
            </button>
            <button
              onClick={() => setShowAddAdvance(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {advances.map(advance => {
          const emp = employees.find(e => e.id === advance.employeeId);
          const progress = ((advance.amount - advance.remainingAmount) / advance.amount) * 100;
          
          return (
            <div key={advance.id} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-slate-800">{emp?.name}</p>
                  <p className="text-xs text-slate-500">{advance.id} • {new Date(advance.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    advance.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                    advance.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    advance.status === 'Deducting' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {advance.status}
                  </span>
                  {advance.status === 'Pending' && (
                    <button
                      onClick={() => handleApprove(advance.id)}
                      className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-slate-600 mb-3 italic">{advance.reason}</p>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-teal-50 rounded p-2">
                  <p className="text-xs text-slate-600">Total</p>
                  <p className="font-bold text-slate-800">₹{advance.amount.toLocaleString()}</p>
                </div>
                <div className="bg-blue-50 rounded p-2">
                  <p className="text-xs text-slate-600">Deduction/Month</p>
                  <p className="font-bold text-blue-600">₹{advance.deductionAmount.toLocaleString()}</p>
                </div>
                <div className="bg-red-50 rounded p-2">
                  <p className="text-xs text-slate-600">Remaining</p>
                  <p className="font-bold text-red-600">₹{advance.remainingAmount.toLocaleString()}</p>
                </div>
              </div>
              
              {advance.status === 'Deducting' && (
                <>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{progress.toFixed(0)}% recovered</p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};