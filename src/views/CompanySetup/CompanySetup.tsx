// CompanySetup.tsx
import React, { useState } from "react";
import {
  FaBuilding,
  FaIdCard,
  FaMoneyCheckAlt,
  FaExchangeAlt,
  FaEnvelope,
  FaUniversity,
  FaRegFile,
  FaFileUpload,
} from "react-icons/fa";
import BasicDetails from "./BasicDetails";
import AccountingDetails from "./AccountingDetails";
import BuyingSelling from "./BuyingSelling";
import SubscribedModules from "./subscribedmodule";
import BankDetails from "./BankDetails";
import Templates from "./Templates";
import AddBankAccountModal from "../../components/CompanySetup/AddBankAccountModal";
import Upload from "./upload";

const navTabs = [
  { key: "basic", label: "Basic Details", icon: <FaIdCard /> },
  { key: "bank", label: "Bank Details", icon: <FaUniversity /> },
  { key: "accounting", label: "Accounting Details", icon: <FaMoneyCheckAlt /> },
  { key: "buyingSelling", label: "Buying & Selling", icon: <FaExchangeAlt /> },
  { key: "subscribed", label: "Subscription", icon: <FaEnvelope /> },
  { key: "Templates", label: "Templates", icon: <FaRegFile /> },
  { key: "logo", label: "Logo & Signature", icon: <FaFileUpload /> },
];

interface BankAccount {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  currency: string;
  swiftCode: string;
  isdefault?: boolean;
}

// Dummy initial accounts (2) — you can remove/replace with real API data later
const initialAccounts: BankAccount[] = [
  {
    bankName: "HDFC Bank",
    accountNumber: "123456789012",
    ifscCode: "HDFC0001234",
    currency: "INR",
    swiftCode: "HDFCINBB",
    isdefault: true,
  },
  {
    bankName: "Barclays UK",
    accountNumber: "987654321000",
    ifscCode: "BARC00UK01",
    currency: "GBP",
    swiftCode: "BARCGB22",
    isdefault: false,
  },
];

const CompanySetup: React.FC = () => {
  const [tab, setTab] = useState(navTabs[0].key);

  // single source of truth for accounts
  const [accounts, setAccounts] = useState<BankAccount[]>(initialAccounts);

  // modal toggles
  const [showBankModal, setShowBankModal] = useState(false);

  // open modal (passed to BankDetails as onAddAccount)
  const openAddModal = () => setShowBankModal(true);

  // called by AddBankAccountModal on submit (adds to accounts)
  const handleAddBankAccount = (newAccount: BankAccount) => {
    setAccounts((prev) => [...prev, newAccount]);
    setShowBankModal(false);
  };

  // mark one account default by index (global index in `accounts`)
  const handleSetDefault = (index: number) => {
    setAccounts((prev) => prev.map((a, i) => ({ ...a, isdefault: i === index })));
  };

  return (
    <div className="bg-app min-h-screen p-8 pb-20">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-main">
        <FaBuilding /> Company Setup
      </h1>

      {/* Navbar */}
      <div className="flex gap-8 mb-8 border-b border-theme">
        {navTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 pb-3 text-base font-medium transition border-b-2 border-theme 
              ${
                tab === t.key
                  ? "border-[var(--primary)] text-main font-semibold"
                  : "border-transparent text-muted hover:text-primary"
              }
            `}
            style={{ background: "transparent" }}
          >
            {t.icon}
            <span className="ml-1">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {tab === "basic" && <BasicDetails />}
        {tab === "bank" && (
          <BankDetails
            bankAccounts={accounts}
            onAddAccount={openAddModal}
            onSetDefault={handleSetDefault}
          />
        )}
        {tab === "accounting" && <AccountingDetails />}
        {tab === "buyingSelling" && <BuyingSelling />}
        {tab === "subscribed" && <SubscribedModules />}
        {tab === "Templates" && <Templates />}
        {tab === "logo" && <Upload />}
      </div>

      {/* Add Bank Account Modal */}
      {showBankModal && (
        <AddBankAccountModal
          onClose={() => setShowBankModal(false)}
          onSubmit={handleAddBankAccount}
        />
      )}
    </div>
  );
};

export default CompanySetup;
