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
export interface RFQDefaultTemplateProps {
  data: RFQData;
  companyLogoUrl?: string;
}

// --- Component ---
const RFQDefaultTemplate = forwardRef<HTMLDivElement, RFQDefaultTemplateProps>(
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
        className="max-w-[260mm] bg-white p-8 relative overflow-hidden"
        style={{ minHeight: "297mm" }}
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-cyan-400 to-cyan-500 opacity-20 transform rotate-12 translate-x-20 -translate-y-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-cyan-400 to-cyan-500 opacity-20"></div>

        {/* Header Section */}
        <div className="relative mb-6">
          <div className="flex justify-between items-start mb-4">
            <div
              className="w-20 h-20 cursor-pointer border-2 border-dashed border-cyan-300 flex items-center justify-center bg-cyan-50 rounded"
              onClick={() => fileInputRef.current?.click()}
            >
              {logo || companyLogoUrl ? (
                <img
                  src={logo || companyLogoUrl}
                  alt="Logo"
                  className="w-18 h-18 object-contain"
                />
              ) : (
                <UploadCloud className="w-8 h-8 text-cyan-400" />
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleLogoChange}
              />
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">[Date]</div>
            </div>
          </div>

          <div className="mb-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              REQUEST FOR QUOTE
            </h1>
            <div className="text-sm text-cyan-500 italic">
              [Vendor Name and Address]
            </div>
          </div>

          {/* Diagonal stripe decoration */}
          <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-50"></div>
          <div className="mt-2 mb-4 border-t-2 border-b-2 border-cyan-400 py-1">
            <div className="flex space-x-1">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-3 bg-cyan-300 transform -skew-x-12"
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Letter Content */}
        <div className="mb-6 relative z-10">
          <p className="text-gray-800 mb-4">
            <strong>Dear [Vendor Name],</strong>
          </p>
          <p className="text-gray-700 mb-6">
            We are seeking proposals for <strong>plumbing services</strong> for
            our facility. Please provide your best quote for the services listed
            below:
          </p>
        </div>

        {/* Services Table */}
        <div className="mb-6 relative z-10">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-cyan-500 text-white">
                <th className="px-4 py-3 text-left text-sm font-bold">
                  Service
                </th>
                <th className="px-4 py-3 text-center text-sm font-bold">
                  Price per Hour
                </th>
                <th className="px-4 py-3 text-center text-sm font-bold">
                  Estimated Time
                </th>
                <th className="px-4 py-3 text-center text-sm font-bold">
                  Total Price
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-4 py-3 text-sm text-gray-800 border-b border-gray-200">
                    {item.service}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 text-center border-b border-gray-200">
                    {item.pricePerHour}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 text-center border-b border-gray-200">
                    {item.estimatedTime}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 text-center border-b border-gray-200">
                    {item.totalPrice}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Cost */}
        <div className="mb-6 relative z-10">
          <p className="text-lg font-bold text-gray-800">
            Total Cost Estimate:{" "}
            <span className="text-cyan-600">{data.totalCost}</span>
          </p>
        </div>

        {/* Additional Requirements */}
        <div className="mb-6 relative z-10">
          <p className="text-gray-700 mb-3">
            In addition to providing the above services, we require the
            following information in your proposal:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
            <li>
              A description of your company's experience in providing plumbing
              services
            </li>
            <li>
              The types of materials and equipment you will provide for each
              service.
            </li>
            <li>Your availability to provide emergency plumbing services.</li>
            <li>Any licenses, certifications, or insurance your company has</li>
            <li>
              Any references or examples of similar projects you have completed
              in the past.
            </li>
          </ul>
        </div>

        {/* Evaluation Criteria */}
        <div className="mb-6 relative z-10">
          <p className="text-gray-700 text-sm">
            We will evaluate proposals based on price, quality, and your
            company's ability to meet our specific needs. Please submit your
            proposal no later than <strong>[Deadline for Submission]</strong>.
            If you have any questions or require additional information, please
            do not hesitate to contact us.
          </p>
        </div>

        {/* Closing */}
        <div className="mb-8 relative z-10">
          <p className="text-gray-700 mb-6">
            Thank you for your time and consideration. We look forward to
            receiving your proposal.
          </p>
          <p className="text-gray-800">Sincerely,</p>
          <p className="text-gray-800 font-semibold mt-2">[Your Name]</p>
          <p className="text-gray-600 text-sm">
            [Your Company] [Phone Number] [Email Address]
          </p>
          <p className="text-gray-600 text-sm">[Website URL]</p>
        </div>
      </div>
    );
  },
);

RFQDefaultTemplate.displayName = "RFQDefaultTemplate";
export default RFQDefaultTemplate;
