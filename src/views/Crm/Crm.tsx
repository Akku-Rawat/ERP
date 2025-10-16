import React, { useState } from "react";
import LeadModal from '../../components/crm/LeadModal';
import OpportunityModal from '../../components/crm/OpportunityModal';
import TicketModal from '../../components/crm/TicketModal';

import {
   FaUsers,
    FaUser, 
    FaBriefcase,
     FaTicketAlt 
    } from "react-icons/fa";


const crmModule = {
  name: "CRM",
  icon: <FaUsers />,
  defaultTab: "leads",
  tabs: [
    { id: "leads", name: "Leads", icon: <FaUser /> },
    { id: "opportunities", name: "Opportunities", icon: <FaBriefcase /> },
    { id: "tickets", name: "Support Tickets", icon: <FaTicketAlt /> },
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
};

const CRM: React.FC = () => {
  const [activeTab, setActiveTab] = useState(crmModule.defaultTab);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showOpportunityModal, setShowOpportunityModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);

  const handleAdd = () => {
    if (activeTab === "leads") setShowLeadModal(true);
    else if (activeTab === "opportunities") setShowOpportunityModal(true);
    else if (activeTab === "tickets") setShowTicketModal(true);
  };

  const handleSearch = (items: any[]) => {
    return items.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
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
            onClick={() => setActiveTab(tab.id)}
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
        {/* Search + Actions */}
        <div className="flex items-center justify-between mb-4">
          <input
            type="search"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleAdd}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              + Add
            </button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
              Export
            </button>
          </div>
        </div>

        {/* Leads */}
        {activeTab === "leads" && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  <th className="px-4 py-2 text-left">Lead ID</th>
                  <th className="px-4 py-2 text-left">Company Name</th>
                  <th className="px-4 py-2 text-left">Contact</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Value</th>
                  <th className="px-4 py-2 text-left">Source</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {handleSearch(crmModule.leads).map((lead) => (
                  <tr key={lead.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{lead.id}</td>
                    <td className="px-4 py-2">{lead.name}</td>
                    <td className="px-4 py-2">{lead.contact}</td>
                    <td className="px-4 py-2">{lead.status}</td>
                    <td className="px-4 py-2">${lead.value.toLocaleString()}</td>
                    <td className="px-4 py-2">{lead.source}</td>
                    <td className="px-4 py-2 text-center">
                      <button className="text-blue-600 hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Opportunities */}
        {activeTab === "opportunities" && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  <th className="px-4 py-2 text-left">Opportunity ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Value</th>
                  <th className="px-4 py-2 text-left">Stage</th>
                  <th className="px-4 py-2 text-left">Probability</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {handleSearch(crmModule.opportunities).map((opp) => (
                  <tr key={opp.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{opp.id}</td>
                    <td className="px-4 py-2">{opp.name}</td>
                    <td className="px-4 py-2">{opp.customer}</td>
                    <td className="px-4 py-2">${opp.value.toLocaleString()}</td>
                    <td className="px-4 py-2">{opp.stage}</td>
                    <td className="px-4 py-2">{opp.probability}%</td>
                    <td className="px-4 py-2 text-center">
                      <button className="text-blue-600 hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tickets */}
        {activeTab === "tickets" && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  <th className="px-4 py-2 text-left">Ticket ID</th>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Priority</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Created</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {handleSearch(crmModule.tickets).map((t) => (
                  <tr key={t.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{t.id}</td>
                    <td className="px-4 py-2">{t.title}</td>
                    <td className="px-4 py-2">{t.customer}</td>
                    <td className="px-4 py-2">{t.priority}</td>
                    <td className="px-4 py-2">{t.status}</td>
                    <td className="px-4 py-2">{t.created}</td>
                    <td className="px-4 py-2 text-center">
                      <button className="text-blue-600 hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <LeadModal isOpen={showLeadModal} onClose={() => setShowLeadModal(false)} onSubmit={(data) => console.log("New Lead:", data)} />
      <OpportunityModal isOpen={showOpportunityModal} onClose={() => setShowOpportunityModal(false)} onSubmit={(data) => console.log("New Opportunity:", data)} />
      <TicketModal isOpen={showTicketModal} onClose={() => setShowTicketModal(false)} onSubmit={(data) => console.log("New Ticket:", data)} />
    </div>
  );
};

export default CRM;
