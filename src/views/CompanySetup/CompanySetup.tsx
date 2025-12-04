import React, { useState } from 'react';
import { FaBuilding,FaIdCard,FaMoneyCheckAlt ,FaExchangeAlt,FaEnvelope,FaUniversity,FaRegFile,FaFileUpload} from 'react-icons/fa';
import BasicDetails from './BasicDetails';
import AccountingDetails from './AccountingDetails';
import BuyingSelling from './BuyingSelling';
import SubscribedModules from './subscribedmodule';
import BankDetails from "./BankDetails"; 
import Templates from "./Templates";
import AddBankAccountModal from "../../components/CompanySetup/AddBankAccountModal";
import Upload from './upload';

const navTabs = [
  { key: 'basic', label: 'Basic Details', icon: <FaIdCard/> },
  {key: 'bank', label:'Bank Details', icon:<FaUniversity/>},
  { key: 'accounting', label: 'Accounting Details', icon: <FaMoneyCheckAlt /> },
  { key: 'buyingSelling', label: 'Buying & Selling', icon: <FaExchangeAlt /> },
  { key:'subscribed',label:'Subscription',icon:<FaEnvelope/>},
  {key:'Templates', label:'Templates', icon:<FaRegFile/>},
  { key: 'logo', label: 'Logo & Signature', icon: <FaFileUpload /> },
];


interface BankAccount {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  currency: string;
  swiftCode: string;
}


const CompanySetup: React.FC = () => {
  const [tab, setTab] = useState(navTabs[0].key);
 const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
 const [showBankModal, setShowBankModal] = useState(false);

const handleAddBankAccount = (newAccount: BankAccount) => {
  setBankAccounts(prev => [...prev, newAccount]);
  setShowBankModal(false);
};


  return (
    <div className="bg-gray-50 min-h-screen p-8 pb-20">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-main">

        <FaBuilding /> Company Setup
      </h1>
      {/* Navbar */}
      <div className="flex gap-8 mb-8 border-b">
        {navTabs.map(t => (
      <button
  key={t.key}
  onClick={() => setTab(t.key)}
  className={`flex items-center gap-2 pb-3 text-base font-medium transition border-b-2 
    ${
      tab === t.key
        ? "border-[var(--primary)] text-[var(--text)] font-semibold"
        : "border-transparent text-[var(--muted)] hover:text-[var(--primary)]"
    }
  `}
  style={{ background: "transparent" }}
>
  {t.icon}
  <span className="ml-1">{t.label}</span>
</button>

        ))}
      </div>
      <div>
        {tab === 'basic' && <BasicDetails />}
            {tab === 'bank' && (
          <BankDetails
            bankAccounts={bankAccounts}
            onAddAccount={() => setShowBankModal(true)}
          />
        )}
        {tab === 'accounting' && <AccountingDetails />}
        {tab === 'buyingSelling' && <BuyingSelling />}
        {tab === 'subscribed' && <SubscribedModules/>}
        {tab === 'Templates' && <Templates/>}
        {tab === 'logo' && <Upload />}
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
