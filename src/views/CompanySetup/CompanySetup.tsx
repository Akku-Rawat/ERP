import React, { useEffect, useState } from "react";
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

import type { BasicDetailsForm, Company, RegistrationDetails } from "../../types/company";

import {
  getCompanyById
} from "../../api/companySetupApi";

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
}

let basicDetail: BasicDetailsForm = {};

const CompanySetup: React.FC = () => {
  const [tab, setTab] = useState(navTabs[0].key);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [showBankModal, setShowBankModal] = useState(false);
  const [companyDetail, setCompanyDetail] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  const handleAddBankAccount = (newAccount: BankAccount) => {
    setBankAccounts((prev) => [...prev, newAccount]);
    setShowBankModal(false);
  };
  const fetchCompanyDetail = async () => {
    try {
      setLoading(true);
      const response = await getCompanyById("COMP-00003");
      console.log("response: ", response);
      let registrationDetails: RegistrationDetails = {
        registerNo: response.data.registrationNumber ?? "",
        tpin: response.data.tpin ?? "",
        companyName: response.data.companyName ?? "",
        dateOfIncorporation: response.data.dateOfIncorporation ?? "",
        companyType: response.data.companyType ?? "",
        companyStatus: response.data.companyStatus ?? "",
        industryType: response.data.industryType ?? "",
      };


      basicDetail.registration = registrationDetails,
      basicDetail.contact = response.data.contactInfo,
      basicDetail.address = response.data.address
      // console.log("registrationDetails: ", registrationDetails);
      // console.log("contacts: ", response.data.contactInfo);
      // console.log("adress: ", response.data.address);
      // console.log("bank: ", response.data.bankAccounts);
      // console.log("financialConfig: ", response.data.financialConfig);
      // console.log("terms: ", response.data.terms);
      // console.log("accounsetup: ", response);
      // console.log("modules: ", response.data.modules);
      // console.log("document: ", response.data.documents);
      // console.log("templates: ", response.data.templates);
      setCompanyDetail(response.data as Company);
    } catch (err) {
      console.error("Error loading company data:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCompanyDetail();
  }, []);

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
    ${tab === t.key
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
      <div>
        {tab === "basic" && <BasicDetails basic={basicDetail} />}
        {tab === "bank" && (
          <BankDetails
            bankAccounts={bankAccounts}
            onAddAccount={() => setShowBankModal(true)}
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
