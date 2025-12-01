import React, { useRef, useState, forwardRef } from "react";
import { UploadCloud } from "lucide-react";

// --- Types ---
export interface RFQItem {
  service?: string;
  pricePerHour?: string;
  estimatedTime?: string;
  totalPrice: string;
  description?: string;
  quantity?: number;
  pricePerUnit?: string;
  hours?: number;
  material?: string;
  size?: string;
  color?: string;
  paperType?: string;
}

export interface RFQData {
  rfqId?: string;
  vendorName: string;
  vendorAddress?: string;
  date: string;
  requestingCompany?: string;
  requestingAddress?: string;
  subject?: string;
  items: RFQItem[];
  totalCost: string;
  additionalRequirements?: string[];
  deadline?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  websiteUrl?: string;
}

// --- Props Interface ---
export interface RFQTemplate3Props {
  data: RFQData;
  companyLogoUrl?: string;
}

// --- Component ---
const RFQTemplate3 = forwardRef<HTMLDivElement, RFQTemplate3Props>(
  ({ data, companyLogoUrl }, ref) => {
    const [logo, setLogo] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (ev) => setLogo(ev.target?.result as string);
        reader.readAsDataURL(e.target.files[0]);
      }
    };

    return (
      <div
        ref={ref}
        className="max-w-[260mm] bg-white relative overflow-hidden"
        style={{ minHeight: "297mm" }}
      >
        {/* Purple Diagonal Header */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-purple-700 to-purple-600 transform origin-top-left">
          <div className="absolute top-0 right-0 w-0 h-0 border-t-[96px] border-t-transparent border-l-[200px] border-l-white"></div>
        </div>

        {/* Blue Diagonal Footer */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-cyan-400 to-cyan-500 transform origin-bottom-right">
          <div className="absolute bottom-0 right-0">
            <div
              className="w-32 h-32 cursor-pointer flex items-center justify-center"
              onClick={() => fileInputRef.current?.click()}
            >
              {logo || companyLogoUrl ? (
                <img
                  src={logo || companyLogoUrl}
                  alt="Logo"
                  className="w-28 h-28 object-contain"
                />
              ) : (
                <div className="w-28 h-28 border-2 border-dashed border-white bg-cyan-400 bg-opacity-50 flex items-center justify-center rounded">
                  <UploadCloud className="w-12 h-12 text-white" />
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleLogoChange}
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative z-10 px-8 pt-32">
          {/* Header */}
          <div className="text-right mb-8">
            <div className="text-sm text-gray-600 mb-4">[Date]</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              REQUEST FOR QUOTE
            </h1>
            <div className="text-sm text-gray-600 italic">
              [Vendor Name and Address]
            </div>
          </div>

          {/* Letter Content */}
          <div className="mb-6">
            <p className="text-gray-800 mb-4">
              <strong>Dear [Vendor Name],</strong>
            </p>
            <p className="text-gray-700 mb-6">
              We are seeking proposals for <strong>printing services</strong>{" "}
              for the following materials. Please provide your best quote for
              the services listed below:
            </p>
          </div>

          {/* Materials Table */}
          <div className="mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-purple-600 text-white">
                  <th className="px-4 py-3 text-left text-sm font-bold">
                    Material
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-bold">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-bold">
                    Size
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-bold">
                    Color
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-bold">
                    Paper Type
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-bold">
                    Price/Unit
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-bold">
                    Total Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-300">
                    <td className="px-4 py-3 text-sm text-gray-800 font-semibold">
                      {item.material}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 text-center">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 text-center">
                      {item.size}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 text-center">
                      {item.color}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 text-center">
                      {item.paperType}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 text-center">
                      {item.pricePerUnit}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 text-center">
                      {item.totalPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Cost */}
          <div className="mb-6">
            <p className="text-lg font-bold text-gray-800">
              Total Cost:{" "}
              <span className="text-purple-600">{data.totalCost}</span>
            </p>
          </div>

          {/* Additional Requirements */}
          <div className="mb-6">
            <p className="text-gray-700 mb-3">
              <strong>
                In addition to providing the above services, we require the
                following information in your proposal:
              </strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
              <li>
                A description of your company's experience in providing printing
                services
              </li>
              <li>The turnaround time for each of the above materials</li>
              <li>The file formats accepted for printing</li>
              <li>
                Any additional services, such as design and proofreading, that
                your company can provide.
              </li>
              <li>
                Any references or examples of similar projects you have
                completed in the past.
              </li>
            </ul>
          </div>

          {/* Evaluation Criteria */}
          <div className="mb-6">
            <p className="text-gray-700 text-sm">
              We will evaluate proposals based on price, quality, and your
              company's ability to meet our specific needs. Please submit your
              proposal no later than <strong>[Deadline for Submission]</strong>.
              If you have any questions or require additional information,
              please do not hesitate to contact us.
            </p>
          </div>

          {/* Closing */}
          <div className="mb-32">
            <p className="text-gray-700 mb-6">
              Thank you for your time and consideration. We look forward to
              receiving your proposal.
            </p>
            <p className="text-gray-800">Sincerely,</p>
            <p className="text-gray-800 font-semibold mt-2">[Your Name]</p>
            <p className="text-gray-600 text-sm">[Your Company]</p>
          </div>
        </div>
      </div>
    );
  },
);

RFQTemplate3.displayName = "RFQTemplate3";
export default RFQTemplate3;
