import React, { useState } from "react";
import { Search, UserPlus, Loader2 } from "lucide-react";

type SSNSearchStepProps = {
  onSSNFound: (employeeData: any) => void;
  onCreateManually: () => void;
};

const SSNSearchStep: React.FC<SSNSearchStepProps> = ({
  onSSNFound,
  onCreateManually,
}) => {
  const [ssn, setSSN] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!ssn.trim()) {
      setError("Please enter SSN");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/employees/ssn/${ssn}`);
      // const data = await response.json();

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock data - Replace with actual API response
      const mockEmployeeData = {
        ssn: ssn,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1-555-0123",
        mobile: "+1-555-0124",
        department: "Engineering",
        jobPosition: "Senior Developer",
        jobTitle: "Tech Lead",
        workAddress: "New York, USA",
      };

      // Check if employee found
      const found = Math.random() > 0.5; // Mock condition

      if (found) {
        onSSNFound(mockEmployeeData);
      } else {
        setError("No employee found with this SSN");
      }
    } catch (err) {
      setError("Failed to search employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 animate-scale-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Search Employee
          </h2>
          <p className="text-sm text-gray-500">
            Enter SSN to fetch existing employee details
          </p>
        </div>

        {/* SSN Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Social Security Number (SSN)
            </label>
            <div className="relative">
              <input
                type="text"
                value={ssn}
                onChange={(e) => {
                  setSSN(e.target.value);
                  setError("");
                }}
                onKeyPress={handleKeyPress}
                placeholder="XXX-XX-XXXX"
                maxLength={11}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                disabled={loading}
              />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span className="text-red-500">⚠</span> {error}
              </p>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Search Employee
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">
                OR
              </span>
            </div>
          </div>

          {/* Create Manually Button */}
          <button
            onClick={onCreateManually}
            disabled={loading}
            className="w-full bg-white text-indigo-600 py-3 px-4 rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus className="w-5 h-5" />
            Create New Employee Manually
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            If the employee doesn't have an SSN or you can't find them, you can
            create a new employee record manually.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SSNSearchStep;