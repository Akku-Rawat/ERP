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
export interface RFQTemplate2Props {
  data: RFQData;
  companyLogoUrl?: string;
}

// --- Component ---
const RFQTemplate2 = forwardRef<HTMLDivElement, RFQTemplate2Props>(
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
        {/* Decorative Elements - Orange and Blue blocks */}
        <div className="absolute top-0 right-0 w-16 h-24 bg-orange-500"></div>
        <div className="absolute top-0 right-0 mt-28 mr-0">
          <div className="w-12 h-32 bg-blue-900"></div>
          <div className="w-12 h-24 bg-blue-700 mt-2"></div>
          <div className="w-12 h-16 bg-orange-500 mt-2"></div>
        </div>

        <div className="absolute bottom-0 right-0 mb-0 mr-0">
          <div className="w-24 h-32 bg-blue-900"></div>
          <div className="w-32 h-24 bg-blue-700 -mt-24 ml-24"></div>
          <div className="w-20 h-20 bg-orange-500 -mt-20 ml-56"></div>
        </div>

        {/* Header Section */}
        <div className="px-8 pt-8 mb-6 relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div
              className="w-20 h-20 cursor-pointer border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 rounded"
              onClick={() => fileInputRef.current?.click()}
            >
              {logo || companyLogoUrl ? (
                <img
                  src={logo || companyLogoUrl}
                  alt="Logo"
                  className="w-18 h-18 object-contain"
                />
              ) : (
                <UploadCloud className="w-8 h-8 text-gray-400" />
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
              <div className="text-sm text-gray-600 mb-2">[Date]</div>
              <div className="text-sm text-gray-600 italic">
                [Vendor Name and Address]
              </div>
            </div>
          </div>

          {/* Orange Header Bar */}
          <div className="flex items-center mb-6">
            <div className="w-1 h-12 bg-orange-500 mr-4"></div>
            <h1 className="text-3xl font-bold text-gray-800">
              REQUEST FOR QUOTE
            </h1>
            <div className="flex-1 h-1 bg-orange-500 ml-4"></div>
          </div>
        </div>

        {/* Letter Content */}
        <div className="px-8 mb-6 relative z-10">
          <p className="text-gray-800 mb-4">
            <strong>Dear [Vendor Name],</strong>
          </p>
          <p className="text-gray-700 mb-6">
            We are seeking proposals for the following{" "}
            <strong>IT services</strong> to support our organization. Please
            provide your best quote for the services listed below:
          </p>
        </div>

        {/* Services Table */}
        <div className="px-8 mb-6 relative z-10">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="px-4 py-3 text-left text-sm font-bold">
                  Service
                </th>
                <th className="px-4 py-3 text-left text-sm font-bold">
                  Description
                </th>
                <th className="px-4 py-3 text-center text-sm font-bold">
                  Hours
                </th>
                <th className="px-4 py-3 text-center text-sm font-bold">
                  Price/Hour
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
                    {item.service}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {item.description}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 text-center">
                    {item.hours}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 text-center">
                    {item.pricePerHour}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 text-center">
                    {item.totalPrice}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Additional Requirements */}
        <div className="px-8 mb-6 relative z-10">
          <p className="text-gray-700 mb-3">
            <strong>
              In addition to providing the above services, we require the
              following information in your proposal:
            </strong>
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
            <li>Your company's experience in providing IT services.</li>
            <li>Relevant qualifications and certifications</li>
            <li>A timeline for providing the services</li>
            <li>
              Any references or examples of similar projects you have completed
              in the past.
            </li>
          </ul>
        </div>

        {/* Additional Services */}
        <div className="px-8 mb-6 relative z-10">
          <p className="text-gray-700 text-sm italic">
            Any additional services or solutions you may recommend enhancing our
            IT capabilities.
          </p>
        </div>

        {/* Evaluation Criteria */}
        <div className="px-8 mb-6 relative z-10">
          <p className="text-gray-700 text-sm">
            We will evaluate proposals based on price, quality, and your
            company's ability to meet our specific needs. Please submit your
            proposal no later than <strong>[Deadline for Submission]</strong>.
            If you have any questions or require additional information, please
            do not hesitate to contact us.
          </p>
        </div>

        {/* Closing */}
        <div className="px-8 mb-8 relative z-10">
          <p className="text-gray-700 mb-6">
            Thank you for your time and consideration. We look forward to
            receiving your proposal.
          </p>
          <p className="text-gray-800">Sincerely,</p>
          <p className="text-gray-800 font-semibold mt-2">[Your Name]</p>
          <p className="text-gray-600 text-sm">
            [Your Company] [Phone] [Email Address] [Website URL]
          </p>
        </div>
      </div>
    );
  },
);

RFQTemplate2.displayName = "RFQTemplate2";
export default RFQTemplate2;
