// BankDetails.tsx
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
  // selectedAccount is the global index inside bankAccounts (or null)
  const [selectedAccount, setSelectedAccount] = useState<number | null>(
    bankAccounts.length > 0 ? 0 : null,
  );

  // showAccountNumber keyed by accountNumber for consistent behaviour across filtered/global indices
  const [showAccountNumber, setShowAccountNumber] = useState<Record<string, boolean>>({});

  const filteredAccounts = bankAccounts.filter(
    (acc) =>
      acc.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.accountNumber.includes(searchTerm) ||
      acc.ifscCode.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // map filtered index -> global index
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
    <div className="bg-card">
      <div className="mx-auto">
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-2 bg-card rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-2 bg-primary">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <FaUniversity className="w-5 h-5" />
                Bank Accounts
              </h2>
            </div>

            <div className="p-4 space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-4" />

                <input
                  type="text"
                  placeholder="Find accounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none focus-ring bg-card text-main"
                />
              </div>

              {/* Add New Account Button */}
              <button
                onClick={onAddAccount}
                className="w-full px-4 py-2.5 rounded-lg shadow-sm text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-95"
                style={{
                  background:
                    "linear-gradient(90deg, var(--primary) 0%, var(--primary-600) 100%)",
                }}
              >
                <FaPlus className="w-4 h-4" />
                Add New Account
              </button>

              {/* DEFAULT pill under Add */}
              <div className="mt-1 mb-2">
                {defaultAccount ? (
                  <div className="text-xs inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border">
                    < FaRegCreditCard className="text-primary" />
                    <span className="font-semibold">{defaultAccount.bankName}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs badge-success">{defaultAccount.currency}</span>
                  </div>
                ) : (
                  <div className="text-xs text-muted">No default account set</div>
                )}
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredAccounts.length === 0 ? (
                  <div className="text-center py-8 text-muted text-sm">No accounts found</div>
                ) : (
                  filteredAccounts.map((acc, i) => {
                    const globalIndex = getGlobalIndex(i);
                    const isSelected = selectedAccount === globalIndex;

                    return (
                      <div
                        key={i}
                        onClick={() => setSelectedAccount(globalIndex !== -1 ? globalIndex : null)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected ? " text-table-head-text" : "border bg-card hover:row-hover text-main"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-semibold text-main text-sm">{acc.bankName}</p>

                          <div className="flex items-center gap-2">
                            {/* clickable star */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (globalIndex !== -1) onSetDefault(globalIndex);
                              }}
                              title={acc.isdefault ? "Default account" : "Set as default"}
                              className="text-sm"
                            >
                              {acc.isdefault ? (
                                < FaRegCreditCard className="text-primary text-sm" />
                              ) : (
                                <FaRegCreditCard className="text-muted text-sm" />
                              )}
                            </button>

                            <span className="text-xs badge-success px-2 py-0.5 rounded-full font-medium">
                              {acc.currency}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-muted font-mono">
                          {showAccountNumber[acc.accountNumber] ? acc.accountNumber : maskAccountNumber(acc.accountNumber)}
                        </p>
                        <p className="text-xs text-muted mt-1">IFSC: {acc.ifscCode}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="col-span-3 bg-card rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-2 flex justify-between items-center bg-primary">
              <h2 className="text-lg font-semibold text-white">Account Details</h2>

              <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded-md transition-all text-white" style={{ background: "rgba(255,255,255,0.12)" }}>
                  <FaEdit className="w-3.5 h-3.5" /> 
                </button>

                <button className="px-3 py-1.5 rounded-md transition-all text-white" style={{ background: "rgba(255,255,255,0.12)" }}>
                  <FaTrash className="w-3.5 h-3.5" /> 
                </button>

                <button
                  className="px-3 py-1.5 rounded-md transition-all text-white"
                  style={{ background: "rgba(255,255,255,0.12)" }}
                  onClick={() => {
                    if (selectedAccount !== null) {
                      // selectedAccount is already a global index
                      onSetDefault(selectedAccount);
                    }
                  }}
                >
                  < FaRegCreditCard className="mr-2 text-primary" />
                  
                </button>
              </div>
            </div>

            {selectedAccount === null || bankAccounts.length === 0 ? (
              <div className="p-12 text-center">
                <div className="inline-block p-6 rounded-full mb-4 bg-card">
                  <FaUniversity className="w-12 h-12 text-muted" />
                </div>
                <h3 className="text-lg font-semibold text-main mb-2">No Account Selected</h3>
                <p className="text-muted">Select an account from the list to view details</p>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Bank Name</label>
                    <div className="bg-card border border-theme rounded-lg px-4 py-3">
                      <p className="text-muted font-medium">{bankAccounts[selectedAccount].bankName}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wide">SWIFT/BIC Code</label>
                    <div className="bg-card border border-theme rounded-lg px-4 py-3 flex items-center justify-between">
                      <p className="text-muted font-mono">{bankAccounts[selectedAccount].swiftCode}</p>
                      <span className="text-success">✓</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Account Number</label>
                    <div className="bg-card border border-theme rounded-lg px-4 py-3 flex items-center justify-between">
                      <p className="text-muted font-mono font-semibold">
                        { /* use accountNumber-keyed visibility */ }
                        {showAccountNumber[bankAccounts[selectedAccount].accountNumber]
                          ? bankAccounts[selectedAccount].accountNumber
                          : maskAccountNumber(bankAccounts[selectedAccount].accountNumber)}
                      </p>
                      <button
                        onClick={() => toggleAccountVisibility(bankAccounts[selectedAccount].accountNumber)}
                        className="text-muted hover:text-muted transition-colors"
                      >
                        {showAccountNumber[bankAccounts[selectedAccount].accountNumber] ? (
                          <FaEyeSlash className="w-4 h-4" />
                        ) : (
                          <FaEye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wide">IFSC Code</label>
                    <div className="bg-card border border-theme rounded-lg px-4 py-3 flex items-center justify-between">
                      <p className="text-muted font-mono">{bankAccounts[selectedAccount].ifscCode}</p>
                      <span className="text-success">✓</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Currency</label>
                    <div className="bg-card border border-theme rounded-lg px-4 py-3">
                      <p className="text-muted font-semibold">{bankAccounts[selectedAccount].currency}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Status</label>
                    <div className="bg-card border border-theme rounded-lg px-4 py-3 flex items-center gap-3">
                      <span className="inline-flex items-center gap-2 text-success font-medium">
                        <span className="w-2 h-2" style={{ background: "var(--success)", borderRadius: 4 }}></span>
                        Active
                      </span>

                      {bankAccounts[selectedAccount] && bankAccounts[selectedAccount].isdefault && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border">
                          < FaRegCreditCard className="text-primary" />
                          <span className="text-sm font-semibold">Default</span>
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

export default BankDetails;
