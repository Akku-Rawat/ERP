
import React, { useState } from "react";
import {
  FaUniversity,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaRegCreditCard,
} from "react-icons/fa";

interface BankAccount {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  currency: string;
  swiftCode: string;
  isdefault?: boolean;
}

interface Props {
  bankAccounts: BankAccount[];
  onAddAccount: () => void;
  onSetDefault: (index: number) => void;
}

const BankDetails: React.FC<Props> = ({ bankAccounts, onAddAccount, onSetDefault }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<number | null>(
    bankAccounts.length > 0 ? 0 : null,
  );

  const [showAccountNumber, setShowAccountNumber] = useState<Record<string, boolean>>({});

  const filteredAccounts = bankAccounts.filter(
    (acc) =>
      acc.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.accountNumber.includes(searchTerm) ||
      acc.ifscCode.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getGlobalIndex = (filteredIndex: number) => {
    const acc = filteredAccounts[filteredIndex];
    if (!acc) return -1;
    return bankAccounts.findIndex(
      (a) =>
        a.accountNumber === acc.accountNumber &&
        a.bankName === acc.bankName &&
        a.ifscCode === acc.ifscCode,
    );
  };

  const toggleAccountVisibility = (accountNumber: string) => {
    setShowAccountNumber((prev) => ({ ...prev, [accountNumber]: !prev[accountNumber] }));
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (!accountNumber) return "";
    if (accountNumber.length <= 4) return accountNumber;
    return "•••• •••• " + accountNumber.slice(-4);
  };

  const defaultAccount = bankAccounts.find((a) => a.isdefault);

  return (
    <div className="bg-app transition-colors duration-300">
      <div className="mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* --- LEFT SIDE: Accounts List --- */}
          <div className="lg:col-span-2 bg-card rounded-xl shadow-sm border border-[var(--border)] overflow-hidden flex flex-col h-[600px]">
            <div className="px-5 py-4 bg-primary shrink-0">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <FaUniversity className="w-5 h-5" />
                Bank Accounts
              </h2>
            </div>

            <div className="p-4 space-y-4 flex-1 flex flex-col overflow-hidden">
              {/* Search Bar */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by bank or IFSC..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-card text-main transition-all"
                />
              </div>

              {/* Add Button */}
              <button
                onClick={onAddAccount}
                className="w-full px-4 py-3 rounded-lg shadow-md text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
                style={{
                  background: "linear-gradient(90deg, var(--primary) 0%, var(--primary-600) 100%)",
                }}
              >
                <FaPlus className="w-4 h-4" />
                Add New Account
              </button>

              {/* Default Account Pill */}
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">Your Accounts</span>
                {defaultAccount && (
                  <div className="text-[10px] inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-row-hover border border-[var(--primary)]/20 text-primary font-bold uppercase">
                    <FaCheck className="w-2 h-2" /> Default: {defaultAccount.bankName.split(' ')[0]}
                  </div>
                )}
              </div>

              {/* Accounts List Loop */}
              <div className="space-y-2 overflow-y-auto pr-1 custom-scrollbar">
                {filteredAccounts.length === 0 ? (
                  <div className="text-center py-10 text-muted text-sm italic">No accounts matching "{searchTerm}"</div>
                ) : (
                  filteredAccounts.map((acc, i) => {
                    const globalIndex = getGlobalIndex(i);
                    const isSelected = selectedAccount === globalIndex;

                    return (
                      <div
                        key={i}
                        onClick={() => setSelectedAccount(globalIndex !== -1 ? globalIndex : null)}
                        className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                          isSelected 
                            ? "border-[var(--primary)] bg-row-hover shadow-sm translate-x-1" 
                            : "border-[var(--border)] bg-card hover:border-[var(--primary)]/50 hover:bg-row-hover"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className={`font-bold text-sm ${isSelected ? "text-primary" : "text-main"}`}>{acc.bankName}</p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (globalIndex !== -1) onSetDefault(globalIndex);
                              }}
                              className="focus:outline-none"
                            >
                              <FaRegCreditCard className={`text-sm transition-colors ${acc.isdefault ? "text-primary scale-110" : "text-muted hover:text-primary"}`} />
                            </button>
                            <span className="text-[10px] badge-success px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                              {acc.currency}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-muted font-mono tracking-wider">
                          {showAccountNumber[acc.accountNumber] ? acc.accountNumber : maskAccountNumber(acc.accountNumber)}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: Account Details --- */}
          <div className="lg:col-span-3 bg-card rounded-xl shadow-sm border border-[var(--border)] overflow-hidden h-[600px] flex flex-col">
            <div className="px-5 py-4 flex justify-between items-center bg-primary shrink-0">
              <h2 className="text-lg font-semibold text-white">Account Details</h2>
              {selectedAccount !== null && (
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all shadow-inner border border-white/10" title="Edit">
                    <FaEdit className="w-4 h-4" /> 
                  </button>
                  <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all shadow-inner border border-white/10" title="Delete">
                    <FaTrash className="w-4 h-4" /> 
                  </button>
                </div>
              )}
            </div>

            {selectedAccount === null || bankAccounts.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-24 h-24 rounded-full bg-app flex items-center justify-center mb-4 border-2 border-dashed border-[var(--border)]">
                  <FaUniversity className="w-10 h-10 text-muted opacity-50" />
                </div>
                <h3 className="text-xl font-bold text-main mb-2">No Account Selected</h3>
                <p className="text-muted max-w-xs">Please select an account from the sidebar or add a new one to view the full details.</p>
              </div>
            ) : (
              <div className="flex-1 p-8 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Bank Name Field */}
                  <DetailBlock label="Bank Name" value={bankAccounts[selectedAccount].bankName} />

                  {/* SWIFT Code Field */}
                  <DetailBlock label="SWIFT / BIC" value={bankAccounts[selectedAccount].swiftCode} isMono />

                  {/* Account Number Field (with visibility toggle) */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted uppercase tracking-widest ml-1">Account Number</label>
                    <div className="bg-app border border-[var(--border)] rounded-xl px-4 py-3.5 flex items-center justify-between group hover:border-[var(--primary)]/40 transition-colors">
                      <p className="text-main font-mono font-bold text-base tracking-widest">
                        {showAccountNumber[bankAccounts[selectedAccount].accountNumber]
                          ? bankAccounts[selectedAccount].accountNumber
                          : maskAccountNumber(bankAccounts[selectedAccount].accountNumber)}
                      </p>
                      <button
                        onClick={() => toggleAccountVisibility(bankAccounts[selectedAccount].accountNumber)}
                        className="text-muted hover:text-primary transition-all p-1.5 hover:bg-row-hover rounded-lg"
                      >
                        {showAccountNumber[bankAccounts[selectedAccount].accountNumber] ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {/* IFSC Code Field */}
                  <DetailBlock label="IFSC Code" value={bankAccounts[selectedAccount].ifscCode} isMono />

                  {/* Currency Field */}
                  <DetailBlock label="Primary Currency" value={bankAccounts[selectedAccount].currency} />

                  {/* Status Field */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted uppercase tracking-widest ml-1">Account Status</label>
                    <div className="bg-app border border-[var(--border)] rounded-xl px-4 py-3.5 flex items-center justify-between">
                      <span className="flex items-center gap-2 text-success font-bold text-sm">
                        <span className="w-2 h-2 rounded-full animate-pulse bg-[var(--success)]" />
                        ACTIVE
                      </span>
                      {bankAccounts[selectedAccount].isdefault && (
                        <span className="text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full uppercase">
                          Primary Account
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Reusable Small Component for Detail Blocks ---
const DetailBlock = ({ label, value, isMono = false }: { label: string, value: string, isMono?: boolean }) => (
  <div className="space-y-2">
    <label className="text-[11px] font-bold text-muted uppercase tracking-widest ml-1">{label}</label>
    <div className="bg-app border border-[var(--border)] rounded-xl px-4 py-3.5 group hover:border-[var(--primary)]/40 transition-colors">
      <p className={`text-main font-bold text-base ${isMono ? 'font-mono tracking-wider' : ''}`}>{value}</p>
    </div>
  </div>
);

const FaCheck = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

export default BankDetails;