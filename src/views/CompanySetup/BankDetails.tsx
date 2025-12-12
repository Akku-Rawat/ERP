import React, { useState } from "react";
import {
  FaUniversity,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import type { BankAccount } from "../../types/company";

interface Props {
  bankAccounts: BankAccount[];
  onAddAccount: () => void;
}

const BankDetails: React.FC<Props> = ({ bankAccounts, onAddAccount }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<number | null>(
    bankAccounts.length > 0 ? 0 : null,
  );
  const [showAccountNumber, setShowAccountNumber] = useState<
    Record<number, boolean>
  >({});

  const filteredAccounts = bankAccounts.filter(
    (acc) =>
      acc.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.accountNo.includes(searchTerm) ||
      acc.swiftCode.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleAccountVisibility = (index: number) => {
    setShowAccountNumber((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return "•••• •••• " + accountNumber.slice(-4);
  };

  const Detail = ({
    label,
    value,
    canToggle,
    onToggle,
    reveal,
  }: {
    label: string;
    value: string | number | undefined;
    canToggle?: boolean;
    onToggle?: () => void;
    reveal?: boolean;
  }) => (
    <div>
      <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wide">
        {label}
      </label>
      <div className="bg-card border border-theme rounded-lg px-4 py-3 flex justify-between items-center">
        <p className="text-muted font-medium">{value || "—"}</p>

        {canToggle && (
          <button onClick={onToggle} className="text-muted">
            {reveal ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-card">
      <div className="mx-auto">
        <div className="grid grid-cols-5 gap-6">
          {/* LEFT LIST */}
          <div className="col-span-2 bg-card rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-2 bg-primary">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <FaUniversity className="w-5 h-5" />
                Bank Accounts
              </h2>
            </div>

            <div className="p-4 space-y-3">
              {/* SEARCH */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />

                <input
                  type="text"
                  placeholder="Find accounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none bg-card text-main"
                />
              </div>

              {/* ADD ACCOUNT */}
              <button
                onClick={onAddAccount}
                className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 shadow-sm"
                style={{
                  background:
                    "linear-gradient(90deg, var(--primary) 0%, var(--primary-600) 100%)",
                }}
              >
                <FaPlus className="w-4 h-4" />
                Add New Account
              </button>

              {/* LIST */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredAccounts.length === 0 ? (
                  <div className="text-center py-8 text-muted text-sm">
                    No accounts found
                  </div>
                ) : (
                  filteredAccounts.map((acc, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedAccount(i)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedAccount === i
                          ? "table-head text-table-head-text"
                          : "border bg-card hover:row-hover text-main"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-semibold text-main text-sm">
                          {acc.bankName}
                        </p>
                        <span className="text-xs badge-success px-2 py-0.5 rounded-full font-medium">
                          {acc.currency}
                        </span>
                      </div>

                      <p className="text-xs text-muted font-mono">
                        {showAccountNumber[i]
                          ? acc.accountNo
                          : maskAccountNumber(acc.accountNo)}
                      </p>

                      <p className="text-xs text-muted mt-1">
                        SWIFT: {acc.swiftCode}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ACCOUNT DETAILS PANEL */}
          <div className="col-span-3 bg-card rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-2 flex justify-between items-center bg-primary">
              <h2 className="text-lg font-semibold text-white">
                Account Details
              </h2>

              {selectedAccount !== null && (
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1.5 rounded-md text-white"
                    style={{ background: "rgba(255,255,255,0.12)" }}
                  >
                    <FaEdit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-md text-white"
                    style={{ background: "rgba(255,255,255,0.12)" }}
                  >
                    <FaTrash className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              )}
            </div>

            {selectedAccount === null || bankAccounts.length === 0 ? (
              <div className="p-12 text-center">
                <div className="inline-block p-6 rounded-full mb-4 bg-card">
                  <FaUniversity className="w-12 h-12 text-muted" />
                </div>
                <h3 className="text-lg font-semibold text-main mb-2">
                  No Account Selected
                </h3>
                <p className="text-muted">
                  Select an account from the list to view details
                </p>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <Detail
                    label="Bank Name"
                    value={bankAccounts[selectedAccount].bankName}
                  />

                  <Detail
                    label="Account Holder"
                    value={bankAccounts[selectedAccount].accountHolderName}
                  />

                  <Detail
                    label="Account Number"
                    value={
                      showAccountNumber[selectedAccount]
                        ? bankAccounts[selectedAccount].accountNo
                        : maskAccountNumber(
                            bankAccounts[selectedAccount].accountNo,
                          )
                    }
                    canToggle={true}
                    onToggle={() => toggleAccountVisibility(selectedAccount)}
                    reveal={showAccountNumber[selectedAccount]}
                  />

                  <Detail
                    label="Swift/BIC Code"
                    value={bankAccounts[selectedAccount].swiftCode}
                  />

                  <Detail
                    label="Sort Code"
                    value={bankAccounts[selectedAccount].sortCode}
                  />

                  <Detail
                    label="Currency"
                    value={bankAccounts[selectedAccount].currency}
                  />

                  <Detail
                    label="Opening Balance"
                    value={bankAccounts[selectedAccount].openingBalance}
                  />

                  <Detail
                    label="Date Added"
                    value={bankAccounts[selectedAccount].dateAdded}
                  />

                  <div className="col-span-2">
                    <Detail
                      label="Branch Address"
                      value={bankAccounts[selectedAccount].branchAddress}
                    />
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
