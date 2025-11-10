import React from "react";

const BankDetails: React.FC = () => {
  return (
    <div>
      <form className="grid grid-cols-3 gap-x-6 gap-y-4 max-w-4xl">
        <div>
          <label className="block text-sm font-medium text-gray-700">Bank Name</label>
          <input
            type="text"
            placeholder="Enter bank name"
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Account Number</label>
          <input
            type="text"
            placeholder="Enter account number"
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
          <input
            type="text"
            placeholder="Enter IFSC code"
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Currency</label>
          <input
            type="text"
            placeholder="Enter currency (e.g. USD, INR)"
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">SWIFT Code</label>
          <input
            type="text"
            placeholder="Enter SWIFT code"
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </form>
    </div>
  );
};

export default BankDetails;
