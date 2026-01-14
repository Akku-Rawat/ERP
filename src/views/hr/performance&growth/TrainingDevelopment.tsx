import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  Users,
  Calendar,
  BookOpen,
  PlayCircle,
  CheckCircle2,
} from "lucide-react";

type TrainingStatus = "Planned" | "Ongoing" | "Completed";

type TrainingProgram = {
  id: string;
  title: string;
  category: string;
  mode: "Online" | "Classroom" | "Hybrid";
  owner: string;
  startDate: string;
  endDate: string;
  participants: number;
  completed: number;
  status: TrainingStatus;
};

const demoPrograms: TrainingProgram[] = [
  {
    id: "TR-001",
    title: "React & Frontend Best Practices",
    category: "Technical",
    mode: "Online",
    owner: "Engineering L&D",
    startDate: "2024-04-01",
    endDate: "2024-04-30",
    participants: 24,
    completed: 18,
    status: "Ongoing",
  },
  {
    id: "TR-002",
    title: "Effective People Management",
    category: "Leadership",
    mode: "Classroom",
    owner: "HR",
    startDate: "2024-05-05",
    endDate: "2024-05-07",
    participants: 15,
    completed: 15,
    status: "Completed",
  },
  {
    id: "TR-003",
    title: "Security & Compliance Basics",
    category: "Compliance",
    mode: "Online",
    owner: "Security",
    startDate: "2024-06-01",
    endDate: "2024-06-15",
    participants: 50,
    completed: 0,
    status: "Planned",
  },
  {
    id: "TR-004",
    title: "Customer-Centric Communication",
    category: "Soft Skills",
    mode: "Hybrid",
    owner: "Sales Academy",
    startDate: "2024-04-10",
    endDate: "2024-04-25",
    participants: 32,
    completed: 20,
    status: "Ongoing",
  },
];

const uniqueCategories = Array.from(
  new Set(demoPrograms.map((p) => p.category)),
);
const uniqueModes = Array.from(new Set(demoPrograms.map((p) => p.mode)));

const TrainingDevelopment: React.FC = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [mode, setMode] = useState("");
  const [status, setStatus] = useState<"" | TrainingStatus>("");

  const filtered = demoPrograms.filter((p) => {
    const matchesSearch =
      search.trim() === "" ||
      p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || p.category === category;
    const matchesMode = !mode || p.mode === mode;
    const matchesStatus = !status || p.status === status;

    return matchesSearch && matchesCategory && matchesMode && matchesStatus;
  });

  const totalPrograms = demoPrograms.length;
  const completedPrograms = demoPrograms.filter(
    (p) => p.status === "Completed",
  ).length;
  const ongoingPrograms = demoPrograms.filter(
    (p) => p.status === "Ongoing",
  ).length;
  const plannedPrograms = demoPrograms.filter(
    (p) => p.status === "Planned",
  ).length;

  const totalParticipants = demoPrograms.reduce(
    (sum, p) => sum + p.participants,
    0,
  );
  const totalCompleted = demoPrograms.reduce((sum, p) => sum + p.completed, 0);
  const overallCompletionRate =
    totalParticipants === 0
      ? 0
      : Math.round((totalCompleted / totalParticipants) * 100);

  return (
    <div className="p-6 bg-app">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Training &amp; Development
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage learning programs, participation, and completion in one
              place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative w-64 max-w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search program..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition shadow-sm">
              <BookOpen className="w-4 h-4" /> New Program
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">
                Total Programs
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {totalPrograms}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">
                Completion Rate
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {overallCompletionRate}%
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
              <PlayCircle className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">
                Ongoing
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {ongoingPrograms}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">
                Planned / Completed
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {plannedPrograms} Planned · {completedPrograms} Completed
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2.5 pr-9 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="px-4 py-2.5 pr-9 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
            >
              <option value="">All Modes</option>
              {uniqueModes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "" | TrainingStatus)}
              className="px-4 py-2.5 pr-9 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="Planned">Planned</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Programs list */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50 text-gray-700 text-xs font-semibold uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Program ID</th>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Mode</th>
                <th className="px-6 py-3 text-left">Owner</th>
                <th className="px-6 py-3 text-left">Schedule</th>
                <th className="px-6 py-3 text-left">Participants</th>
                <th className="px-6 py-3 text-left">Completion</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {filtered.map((p) => {
                const completion =
                  p.participants === 0
                    ? 0
                    : Math.round((p.completed / p.participants) * 100);

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-indigo-50/40 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-indigo-600">
                      {p.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {p.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{p.mode}</td>
                    <td className="px-6 py-4 text-gray-700">{p.owner}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {p.startDate} – {p.endDate}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {p.completed}/{p.participants}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-indigo-500"
                            style={{ width: `${completion}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">
                          {completion}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          p.status === "Completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : p.status === "Ongoing"
                              ? "bg-sky-100 text-sky-700"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-14 text-center text-sm text-gray-500">
              No programs match the selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingDevelopment;
