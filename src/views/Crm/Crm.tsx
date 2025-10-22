import React, { useState } from "react";
import LeadModal from '../../components/crm/LeadModal';
import TicketModal from '../../components/crm/TicketModal';
import CustomerModal from '../../components/crm/CustomerModal';  
import CustomerManagement from "./CustomerManagement";        
import CRMSettings from "./Settings";
import CRMDashboard from "./CRMDashboard";
import CRMReports from "./Reports";
import Leads from "./Leads";
import SupportTickets from "./Support-tickets";

import { 
  FaUsers, 
  FaUser,
  FaTicketAlt, 
  FaCog, 
  FaChartBar, 
  FaCalendarAlt,
  FaIdBadge
} from "react-icons/fa";

const crmModule = {
  name: "CRM",
  icon: <FaUsers />,
  defaultTab: "dashboard",
  tabs: [
    { id: "dashboard", name: "Dashboard", icon: <FaCalendarAlt /> },
    { id: "customer-managment", name: "Customer Management", icon: <FaIdBadge /> },
    { id: "leads", name: "Leads", icon: <FaUser /> },
    { id: "tickets", name: "Support Tickets", icon: <FaTicketAlt /> },
    { id: "settings", name: "Settings", icon: <FaCog /> },
    { id: "reports", name: "Reports", icon: <FaChartBar /> },
  ],
  leads: [
    { id: "LEAD-001", name: "Global Enterprises", contact: "Jane Wilson", status: "Qualified", value: 150000, source: "Website" },
    { id: "LEAD-002", name: "StartupCo", contact: "Bob Chen", status: "New", value: 50000, source: "Referral" },
    { id: "LEAD-003", name: "Manufacturing Inc", contact: "Alice Johnson", status: "Contacted", value: 80000, source: "Cold Call" },
  ],
  opportunities: [
    { id: "OPP-001", name: "Enterprise Software Deal", customer: "Global Enterprises", value: 150000, stage: "Proposal", probability: 70 },
    { id: "OPP-002", name: "Startup Package", customer: "StartupCo", value: 50000, stage: "Qualification", probability: 30 },
    { id: "OPP-003", name: "Manufacturing Solution", customer: "Manufacturing Inc", value: 80000, stage: "Needs Analysis", probability: 50 },
  ],
  tickets: [
    { id: "TICK-001", title: "System Login Issue", customer: "ABC Corporation", priority: "High", status: "Open", created: "2025-01-18" },
    { id: "TICK-002", title: "Report Generation Error", customer: "XYZ Industries", priority: "Medium", status: "In Progress", created: "2025-01-17" },
    { id: "TICK-003", title: "Feature Request - Export", customer: "Tech Solutions", priority: "Low", status: "Resolved", created: "2025-01-16" },
  ],
  // Optional: Pre-populate customers
  customers: [
    { id: "CUST-001", companyName: "Global Enterprises", firstName: "Jane", lastName: "Wilson", email: "jane@global.com", phone: "+1 555-0101", status: "active" },
    { id: "CUST-002", firstName: "Bob", lastName: "Chen", email: "bob@startup.co", phone: "+1 555-0102", status: "prospect" },
  ],
};

const CRM: React.FC = () => {
  const [activeTab, setActiveTab] = useState(crmModule.defaultTab);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false); // <-- ADD

  const handleAdd = () => {
    if (activeTab === "leads") setShowLeadModal(true);
    else if (activeTab === "tickets") setShowTicketModal(true);
    else if (activeTab === "customer-managment") setShowCustomerModal(true); // <-- ADD
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
          <span>{crmModule.icon}</span> {crmModule.name}
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        {crmModule.tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchTerm(""); // reset search on tab change
            }}
            className={`px-4 py-2 font-medium flex items-center gap-2 transition-colors ${
              activeTab === tab.id
                ? "text-teal-600 border-b-2 border-teal-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span>{tab.icon}</span> {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        {activeTab === "dashboard" && <CRMDashboard />}

        {activeTab === "customer-managment" && (
          <CustomerManagement
            initialCustomers={crmModule.customers}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onAdd={handleAdd}
          />
        )}

        {activeTab === "leads" && (
          <Leads
            leads={crmModule.leads}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onAdd={handleAdd}
          />
        )}

        {activeTab === "tickets" && (
          <SupportTickets
            tickets={crmModule.tickets}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onAdd={handleAdd}
          />
        )}

        {activeTab === "settings" && <CRMSettings />}
        {activeTab === "reports" && <CRMReports />}
      </div>

      {/* Modals */}
      <LeadModal
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        onSubmit={(data) => {
          console.log("New Lead:", data);
          setShowLeadModal(false);
        }}
      />

      <TicketModal
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        onSubmit={(data) => {
          console.log("New Ticket:", data);
          setShowTicketModal(false);
        }}
      />

      <CustomerModal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        onSubmit={(data) => {
          console.log("New/Edit Customer:", data);
          setShowCustomerModal(false);
        }}
      />
    </div>
  );
};

export default CRM;