import React, { useState } from "react";
import {
  FaUsers,
  FaPlus,
  FaFilter,
  FaChevronDown,
  FaUserTie,
  FaDoorOpen,
} from "react-icons/fa";

// ===== DATA TYPES =====
type JobOpening = {
  id: string;
  jobTitle: string;
  department: string;
  type: "Full-Time" | "Part-Time" | "Contract";
  postingDate: string;
  candidates: number;
  status: "Open" | "Closed";
};

type Candidate = {
  id: string;
  name: string;
  position: string;
  appliedDate: string;
  stage: "Applied" | "Shortlisted" | "Interview" | "Offer" | "Hired";
  email: string;
};

type NewHire = {
  id: string;
  name: string;
  position: string;
  department: string;
  startDate: string;
  status: "Pending" | "In Progress" | "Completed";
  tasksCompleted: number;
  totalTasks: number;
};

type ExitEmployee = {
  id: string;
  name: string;
  position: string;
  department: string;
  exitDate: string;
  reason: string;
  status: "Pending" | "In Progress" | "Completed";
  tasksCompleted: number;
  totalTasks: number;
};

// ===== DEMO DATA =====
const demoJobOpenings: JobOpening[] = [
  {
    id: "J001",
    jobTitle: "Software Engineer",
    department: "Engineering",
    type: "Full-Time",
    postingDate: "03/15/2024",
    candidates: 23,
    status: "Open",
  },
  {
    id: "J002",
    jobTitle: "Marketing Coordinator",
    department: "Marketing",
    type: "Part-Time",
    postingDate: "03/10/2024",
    candidates: 14,
    status: "Open",
  },
  {
    id: "J003",
    jobTitle: "Sales Associate",
    department: "Sales",
    type: "Full-Time",
    postingDate: "03/05/2024",
    candidates: 7,
    status: "Closed",
  },
  {
    id: "J004",
    jobTitle: "HR Manager",
    department: "HR",
    type: "Full-Time",
    postingDate: "02/28/2024",
    candidates: 12,
    status: "Open",
  },
];

const demoCandidates: Candidate[] = [
  {
    id: "C001",
    name: "Alice Johnson",
    position: "Software Engineer",
    appliedDate: "03/20/2024",
    stage: "Interview",
    email: "alice@email.com",
  },
  {
    id: "C002",
    name: "Bob Smith",
    position: "Marketing Coordinator",
    appliedDate: "03/18/2024",
    stage: "Shortlisted",
    email: "bob@email.com",
  },
  {
    id: "C003",
    name: "Carol Davis",
    position: "Software Engineer",
    appliedDate: "03/17/2024",
    stage: "Offer",
    email: "carol@email.com",
  },
  {
    id: "C004",
    name: "David Wilson",
    position: "Sales Associate",
    appliedDate: "03/16/2024",
    stage: "Hired",
    email: "david@email.com",
  },
  {
    id: "C005",
    name: "Emma Brown",
    position: "Software Engineer",
    appliedDate: "03/15/2024",
    stage: "Applied",
    email: "emma@email.com",
  },
  {
    id: "C006",
    name: "Frank Miller",
    position: "HR Manager",
    appliedDate: "03/14/2024",
    stage: "Interview",
    email: "frank@email.com",
  },
];

const demoNewHires: NewHire[] = [
  {
    id: "H001",
    name: "David Wilson",
    position: "Sales Associate",
    department: "Sales",
    startDate: "04/01/2024",
    status: "In Progress",
    tasksCompleted: 6,
    totalTasks: 10,
  },
  {
    id: "H002",
    name: "Carol Davis",
    position: "Software Engineer",
    department: "Engineering",
    startDate: "03/25/2024",
    status: "Completed",
    tasksCompleted: 10,
    totalTasks: 10,
  },
  {
    id: "H003",
    name: "Frank Miller",
    position: "HR Manager",
    department: "HR",
    startDate: "04/05/2024",
    status: "Pending",
    tasksCompleted: 0,
    totalTasks: 10,
  },
];

const demoExitEmployees: ExitEmployee[] = [
  {
    id: "E001",
    name: "John Doe",
    position: "Senior Developer",
    department: "Engineering",
    exitDate: "04/15/2024",
    reason: "Resignation",
    status: "In Progress",
    tasksCompleted: 5,
    totalTasks: 8,
  },
  {
    id: "E002",
    name: "Sarah Johnson",
    position: "Marketing Manager",
    department: "Marketing",
    exitDate: "04/20/2024",
    reason: "Relocation",
    status: "Pending",
    tasksCompleted: 0,
    totalTasks: 8,
  },
  {
    id: "E003",
    name: "Mike Chen",
    position: "Finance Analyst",
    department: "Finance",
    exitDate: "03/31/2024",
    reason: "Resignation",
    status: "Completed",
    tasksCompleted: 8,
    totalTasks: 8,
  },
];

const onboardingTasks = [
  "Create employee account",
  "Setup IT equipment",
  "Assign desk/workspace",
  "Create email account",
  "Add to team groups",
  "Security training",
  "Company orientation",
  "Department briefing",
  "System access setup",
  "Documentation review",
];

const offboardingTasks = [
  "Equipment return (Laptop)",
  "Equipment return (Badge/Access Card)",
  "Knowledge transfer sessions",
  "Exit interview completion",
  "Final payroll processing",
  "Benefits settlement",
  "Document archival",
  "System access removal",
  "Email forwarding setup",
  "References & certificate",
];

// ===== MAIN COMPONENT =====
const Recruitment: React.FC = () => {
  const [mainTab, setMainTab] = useState<
    "recruitment" | "onboarding" | "offboarding"
  >("recruitment");
  const [recruitmentSubTab, setRecruitmentSubTab] = useState<
    "openings" | "candidates"
  >("openings");
  const [onboardingSubTab, setOnboardingSubTab] = useState<"hires" | "tasks">(
    "hires",
  );
  const [offboardingSubTab, setOffboardingSubTab] = useState<"exits" | "tasks">(
    "exits",
  );

  return (
    <div className="space-y-6">
      {/* ===== MAIN TABS: Recruitment (Active by default) vs Onboarding vs Offboarding ===== */}
      <div className="flex gap-8 border-b border-gray-300 pb-4 overflow-x-auto">
        <button
          onClick={() => setMainTab("recruitment")}
          className={`flex items-center gap-2 text-lg font-semibold transition pb-2 border-b-4 whitespace-nowrap ${
            mainTab === "recruitment"
              ? "text-teal-600 border-teal-500"
              : "text-gray-500 border-transparent hover:text-teal-600"
          }`}
        >
          <FaUsers /> Recruitment
        </button>
        <button
          onClick={() => setMainTab("onboarding")}
          className={`flex items-center gap-2 text-lg font-semibold transition pb-2 border-b-4 whitespace-nowrap ${
            mainTab === "onboarding"
              ? "text-teal-600 border-teal-500"
              : "text-gray-500 border-transparent hover:text-teal-600"
          }`}
        >
          <FaUserTie /> Onboarding
        </button>
        <button
          onClick={() => setMainTab("offboarding")}
          className={`flex items-center gap-2 text-lg font-semibold transition pb-2 border-b-4 whitespace-nowrap ${
            mainTab === "offboarding"
              ? "text-teal-600 border-teal-500"
              : "text-gray-500 border-transparent hover:text-teal-600"
          }`}
        >
          <FaDoorOpen /> Offboarding
        </button>
      </div>

      {/* ===== RECRUITMENT MODULE (LOADS FIRST) ===== */}
      {mainTab === "recruitment" && (
        <div className="space-y-6">
          {/* Sub-tabs: Job Openings vs Candidates */}
          <div className="flex gap-6 border-b border-gray-200 pb-3">
            <button
              onClick={() => setRecruitmentSubTab("openings")}
              className={`font-semibold transition pb-2 border-b-2 ${
                recruitmentSubTab === "openings"
                  ? "text-teal-600 border-teal-500"
                  : "text-gray-500 border-transparent hover:text-teal-600"
              }`}
            >
              Job Openings
            </button>
            <button
              onClick={() => setRecruitmentSubTab("candidates")}
              className={`font-semibold transition pb-2 border-b-2 ${
                recruitmentSubTab === "candidates"
                  ? "text-teal-600 border-teal-500"
                  : "text-gray-500 border-transparent hover:text-teal-600"
              }`}
            >
              Candidates Pipeline
            </button>
          </div>

          {/* JOB OPENINGS SUB-TAB */}
          {recruitmentSubTab === "openings" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Job Openings</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition">
                  <FaPlus /> New Job
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-teal-500">
                  <p className="text-gray-600 text-sm">Total Openings</p>
                  <p className="text-4xl font-bold text-teal-600">
                    {demoJobOpenings.filter((j) => j.status === "Open").length}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                  <p className="text-gray-600 text-sm">Total Applications</p>
                  <p className="text-4xl font-bold text-blue-600">58</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                  <p className="text-gray-600 text-sm">Offers Extended</p>
                  <p className="text-4xl font-bold text-green-600">5</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex gap-4 mb-6">
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                    <FaFilter /> Filter
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                    Department <FaChevronDown />
                  </button>
                </div>

                <table className="w-full text-left text-sm">
                  <thead className="border-b-2 border-gray-200">
                    <tr className="text-gray-700 font-semibold">
                      <th className="py-3 px-4">Job Title</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Posting Date</th>
                      <th className="py-3 px-4">Candidates</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoJobOpenings.map((job) => (
                      <tr
                        key={job.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 font-medium">
                          {job.jobTitle}
                        </td>
                        <td className="py-3 px-4">{job.department}</td>
                        <td className="py-3 px-4">{job.type}</td>
                        <td className="py-3 px-4">{job.postingDate}</td>
                        <td className="py-3 px-4 font-semibold">
                          {job.candidates}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-4 py-1 rounded-full text-xs font-semibold ${job.status === "Open" ? "bg-teal-100 text-teal-700" : "bg-gray-200 text-gray-700"}`}
                          >
                            {job.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CANDIDATES PIPELINE SUB-TAB */}
          {recruitmentSubTab === "candidates" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Candidates Pipeline</h2>

              <div className="grid grid-cols-5 gap-4">
                {["Applied", "Shortlisted", "Interview", "Offer", "Hired"].map(
                  (stage) => {
                    const count = demoCandidates.filter(
                      (c) => c.stage === stage,
                    ).length;
                    return (
                      <div
                        key={stage}
                        className="bg-white rounded-lg shadow p-4 text-center border-t-4 border-teal-500"
                      >
                        <p className="text-gray-600 text-sm font-semibold">
                          {stage}
                        </p>
                        <p className="text-3xl font-bold text-teal-600 mt-2">
                          {count}
                        </p>
                      </div>
                    );
                  },
                )}
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <table className="w-full text-left text-sm">
                  <thead className="border-b-2 border-gray-200">
                    <tr className="text-gray-700 font-semibold">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Position</th>
                      <th className="py-3 px-4">Applied Date</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Stage</th>
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoCandidates.map((candidate) => (
                      <tr
                        key={candidate.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 font-medium">
                          {candidate.name}
                        </td>
                        <td className="py-3 px-4">{candidate.position}</td>
                        <td className="py-3 px-4">{candidate.appliedDate}</td>
                        <td className="py-3 px-4 text-blue-600">
                          {candidate.email}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              candidate.stage === "Applied"
                                ? "bg-blue-100 text-blue-700"
                                : candidate.stage === "Shortlisted"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : candidate.stage === "Interview"
                                    ? "bg-purple-100 text-purple-700"
                                    : candidate.stage === "Offer"
                                      ? "bg-orange-100 text-orange-700"
                                      : "bg-green-100 text-green-700"
                            }`}
                          >
                            {candidate.stage}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-teal-600 hover:text-teal-800 font-semibold">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== ONBOARDING MODULE ===== */}
      {mainTab === "onboarding" && (
        <div className="space-y-6">
          <div className="flex gap-6 border-b border-gray-200 pb-3">
            <button
              onClick={() => setOnboardingSubTab("hires")}
              className={`font-semibold transition pb-2 border-b-2 ${
                onboardingSubTab === "hires"
                  ? "text-teal-600 border-teal-500"
                  : "text-gray-500 border-transparent hover:text-teal-600"
              }`}
            >
              New Hires
            </button>
            <button
              onClick={() => setOnboardingSubTab("tasks")}
              className={`font-semibold transition pb-2 border-b-2 ${
                onboardingSubTab === "tasks"
                  ? "text-teal-600 border-teal-500"
                  : "text-gray-500 border-transparent hover:text-teal-600"
              }`}
            >
              Onboarding Tasks
            </button>
          </div>

          {onboardingSubTab === "hires" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">New Hires Onboarding</h2>

              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                  <p className="text-gray-600 text-sm">Pending</p>
                  <p className="text-4xl font-bold text-blue-600">
                    {demoNewHires.filter((h) => h.status === "Pending").length}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                  <p className="text-gray-600 text-sm">In Progress</p>
                  <p className="text-4xl font-bold text-yellow-600">
                    {
                      demoNewHires.filter((h) => h.status === "In Progress")
                        .length
                    }
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                  <p className="text-gray-600 text-sm">Completed</p>
                  <p className="text-4xl font-bold text-green-600">
                    {
                      demoNewHires.filter((h) => h.status === "Completed")
                        .length
                    }
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <table className="w-full text-left text-sm">
                  <thead className="border-b-2 border-gray-200">
                    <tr className="text-gray-700 font-semibold">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Position</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Start Date</th>
                      <th className="py-3 px-4">Progress</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoNewHires.map((hire) => (
                      <tr
                        key={hire.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 font-medium">{hire.name}</td>
                        <td className="py-3 px-4">{hire.position}</td>
                        <td className="py-3 px-4">{hire.department}</td>
                        <td className="py-3 px-4">{hire.startDate}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-teal-500 h-2 rounded-full"
                                style={{
                                  width: `${(hire.tasksCompleted / hire.totalTasks) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-xs font-semibold">
                              {hire.tasksCompleted}/{hire.totalTasks}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              hire.status === "Pending"
                                ? "bg-blue-100 text-blue-700"
                                : hire.status === "In Progress"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"
                            }`}
                          >
                            {hire.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {onboardingSubTab === "tasks" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">
                Onboarding Tasks & Checklist
              </h2>

              {demoNewHires.map((hire) => (
                <div key={hire.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{hire.name}</h3>
                      <p className="text-sm text-gray-600">
                        {hire.position} - {hire.department}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        hire.status === "Pending"
                          ? "bg-blue-100 text-blue-700"
                          : hire.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {hire.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {onboardingTasks.map((task, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2 border border-gray-200 rounded hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          defaultChecked={idx < hire.tasksCompleted}
                          className="w-4 h-4"
                        />
                        <span
                          className={
                            idx < hire.tasksCompleted
                              ? "line-through text-gray-400"
                              : "text-gray-700"
                          }
                        >
                          {task}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== OFFBOARDING MODULE ===== */}
      {mainTab === "offboarding" && (
        <div className="space-y-6">
          <div className="flex gap-6 border-b border-gray-200 pb-3">
            <button
              onClick={() => setOffboardingSubTab("exits")}
              className={`font-semibold transition pb-2 border-b-2 ${
                offboardingSubTab === "exits"
                  ? "text-teal-600 border-teal-500"
                  : "text-gray-500 border-transparent hover:text-teal-600"
              }`}
            >
              Exit Employees
            </button>
            <button
              onClick={() => setOffboardingSubTab("tasks")}
              className={`font-semibold transition pb-2 border-b-2 ${
                offboardingSubTab === "tasks"
                  ? "text-teal-600 border-teal-500"
                  : "text-gray-500 border-transparent hover:text-teal-600"
              }`}
            >
              Exit Tasks & Clearance
            </button>
          </div>

          {offboardingSubTab === "exits" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Exit Employees</h2>

              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
                  <p className="text-gray-600 text-sm">Pending</p>
                  <p className="text-4xl font-bold text-red-600">
                    {
                      demoExitEmployees.filter((e) => e.status === "Pending")
                        .length
                    }
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
                  <p className="text-gray-600 text-sm">In Progress</p>
                  <p className="text-4xl font-bold text-orange-600">
                    {
                      demoExitEmployees.filter(
                        (e) => e.status === "In Progress",
                      ).length
                    }
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                  <p className="text-gray-600 text-sm">Completed</p>
                  <p className="text-4xl font-bold text-green-600">
                    {
                      demoExitEmployees.filter((e) => e.status === "Completed")
                        .length
                    }
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <table className="w-full text-left text-sm">
                  <thead className="border-b-2 border-gray-200">
                    <tr className="text-gray-700 font-semibold">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Position</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Exit Date</th>
                      <th className="py-3 px-4">Reason</th>
                      <th className="py-3 px-4">Clearance</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoExitEmployees.map((emp) => (
                      <tr
                        key={emp.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 font-medium">{emp.name}</td>
                        <td className="py-3 px-4">{emp.position}</td>
                        <td className="py-3 px-4">{emp.department}</td>
                        <td className="py-3 px-4">{emp.exitDate}</td>
                        <td className="py-3 px-4">{emp.reason}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-orange-500 h-2 rounded-full"
                                style={{
                                  width: `${(emp.tasksCompleted / emp.totalTasks) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-xs">
                              {emp.tasksCompleted}/{emp.totalTasks}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              emp.status === "Pending"
                                ? "bg-red-100 text-red-700"
                                : emp.status === "In Progress"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-green-100 text-green-700"
                            }`}
                          >
                            {emp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {offboardingSubTab === "tasks" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">
                Exit Tasks & Clearance Checklist
              </h2>

              {demoExitEmployees.map((emp) => (
                <div key={emp.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{emp.name}</h3>
                      <p className="text-sm text-gray-600">
                        {emp.position} - {emp.department} | Exit Date:{" "}
                        {emp.exitDate}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        emp.status === "Pending"
                          ? "bg-red-100 text-red-700"
                          : emp.status === "In Progress"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-700 mb-3">
                        Equipment & Access
                      </h4>
                      {offboardingTasks.slice(0, 5).map((task, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-2 border border-gray-200 rounded hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            defaultChecked={idx < emp.tasksCompleted}
                            className="w-4 h-4"
                          />
                          <span
                            className={
                              idx < emp.tasksCompleted
                                ? "line-through text-gray-400"
                                : "text-gray-700"
                            }
                          >
                            {task}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-700 mb-3">
                        Documentation & Settlement
                      </h4>
                      {offboardingTasks.slice(5).map((task, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-2 border border-gray-200 rounded hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            defaultChecked={idx + 5 < emp.tasksCompleted}
                            className="w-4 h-4"
                          />
                          <span
                            className={
                              idx + 5 < emp.tasksCompleted
                                ? "line-through text-gray-400"
                                : "text-gray-700"
                            }
                          >
                            {task}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Recruitment;
