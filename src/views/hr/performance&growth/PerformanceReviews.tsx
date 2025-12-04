import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  Filter,
  TrendingUp,
  Target,
  Clock,
  Award,
} from "lucide-react";

type ReviewStatus = "Not Started" | "In Progress" | "Completed";

type PerformanceReview = {
  id: string;
  employeeName: string;
  role: string;
  department: string;
  manager: string;
  cycle: string;
  rating: number | null; // 1–5, null if not given
  status: ReviewStatus;
  nextReviewDate: string;
  goalsCompletion: number; // 0–100
};

const demoReviews: PerformanceReview[] = [
  {
    id: "PR-001",
    employeeName: "June Ner",
    role: "Senior Developer",
    department: "Engineering",
    manager: "Alex Cooper",
    cycle: "2024 H1",
    rating: 4.5,
    status: "Completed",
    nextReviewDate: "2024-10-01",
    goalsCompletion: 95,
  },
  {
    id: "PR-002",
    employeeName: "Cesh Spalq",
    role: "Product Manager",
    department: "Product",
    manager: "Sarah Wilson",
    cycle: "2024 H1",
    rating: 4.2,
    status: "In Progress",
    nextReviewDate: "2024-09-20",
    goalsCompletion: 70,
  },
  {
    id: "PR-003",
    employeeName: "Nash Fosh",
    role: "UI Designer",
    department: "Design",
    manager: "Jane Doe",
    cycle: "2024 H1",
    rating: null,
    status: "Not Started",
    nextReviewDate: "2024-09-30",
    goalsCompletion: 20,
  },
  {
    id: "PR-004",
    employeeName: "Atn Knowling",
    role: "Backend Developer",
    department: "Engineering",
    manager: "Alex Cooper",
    cycle: "2024 H1",
    rating: 3.8,
    status: "Completed",
    nextReviewDate: "2024-10-05",
    goalsCompletion: 88,
  },
];

const uniqueDepartments = Array.from(
  new Set(demoReviews.map((r) => r.department)),
);
const uniqueCycles = Array.from(new Set(demoReviews.map((r) => r.cycle)));
const uniqueManagers = Array.from(new Set(demoReviews.map((r) => r.manager)));

const PerformanceReviews: React.FC = () => {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [cycle, setCycle] = useState("");
  const [manager, setManager] = useState("");
  const [status, setStatus] = useState<"" | ReviewStatus>("");

  const filtered = demoReviews.filter((r) => {
    const matchesSearch =
      search.trim() === "" ||
      r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      r.role.toLowerCase().includes(search.toLowerCase());
    const matchesDept = !department || r.department === department;
    const matchesCycle = !cycle || r.cycle === cycle;
    const matchesManager = !manager || r.manager === manager;
    const matchesStatus = !status || r.status === status;

    return (
      matchesSearch &&
      matchesDept &&
      matchesCycle &&
      matchesManager &&
      matchesStatus
    );
  });

  const completedCount = demoReviews.filter(
    (r) => r.status === "Completed",
  ).length;
  const inProgressCount = demoReviews.filter(
    (r) => r.status === "In Progress",
  ).length;
  const notStartedCount = demoReviews.filter(
    (r) => r.status === "Not Started",
  ).length;

  const avgRating =
    demoReviews.filter((r) => r.rating !== null).length === 0
      ? 0
      : demoReviews
          .filter((r) => r.rating !== null)
          .reduce((sum, r) => sum + (r.rating || 0), 0) /
        demoReviews.filter((r) => r.rating !== null).length;

  const avgGoalCompletion =
    demoReviews.reduce((sum, r) => sum + r.goalsCompletion, 0) /
    demoReviews.length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="space-y-6">
        {/* Header + Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Performance Reviews
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Track review cycles, ratings, and goal completion across teams.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative w-64 max-w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search employee/role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* Quick filter button (visual only for now) */}
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">
                Avg Rating
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {avgRating.toFixed(1)}
                <span className="text-sm text-gray-500 ml-1">/ 5</span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">
                Goals Completed
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {avgGoalCompletion.toFixed(0)}%
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">
                In Progress
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {inProgressCount}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
              <Award className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">
                Completed
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {completedCount}
                <span className="text-xs text-gray-500 ml-1">
                  / {demoReviews.length}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="px-4 py-2.5 pr-9 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
            >
              <option value="">All Departments</option>
              {uniqueDepartments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={cycle}
              onChange={(e) => setCycle(e.target.value)}
              className="px-4 py-2.5 pr-9 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
            >
              <option value="">All Cycles</option>
              {uniqueCycles.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              className="px-4 py-2.5 pr-9 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
            >
              <option value="">All Managers</option>
              {uniqueManagers.map((m) => (
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
              onChange={(e) => setStatus(e.target.value as "" | ReviewStatus)}
              className="px-4 py-2.5 pr-9 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50 text-gray-700 text-xs font-semibold uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Review ID</th>
                <th className="px-6 py-3 text-left">Employee</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Department</th>
                <th className="px-6 py-3 text-left">Manager</th>
                <th className="px-6 py-3 text-left">Cycle</th>
                <th className="px-6 py-3 text-left">Goals</th>
                <th className="px-6 py-3 text-left">Rating</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Next Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-indigo-50/40 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 font-mono text-xs text-indigo-600">
                    {r.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {r.employeeName}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{r.role}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {r.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{r.manager}</td>
                  <td className="px-6 py-4 text-gray-700">{r.cycle}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-indigo-500"
                          style={{ width: `${r.goalsCompletion}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">
                        {r.goalsCompletion}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {r.rating ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                        {r.rating.toFixed(1)} / 5
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Not rated</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        r.status === "Completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : r.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {r.nextReviewDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-14 text-center text-sm text-gray-500">
              No reviews match the selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceReviews;
