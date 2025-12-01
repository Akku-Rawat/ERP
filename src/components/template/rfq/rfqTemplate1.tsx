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
export interface RFQTemplate1Props {
  data: RFQData;
  companyLogoUrl?: string;
}

// --- Component ---
const RFQTemplate1 = forwardRef<HTMLDivElement, RFQTemplate1Props>(
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
        {/* Decorative Background Elements - Dark blue and yellow */}
        <div className="absolute top-0 left-0 w-0 h-0 border-t-[180px] border-t-gray-800 border-r-[180px] border-r-transparent"></div>
        <div className="absolute top-0 left-32 w-0 h-0 border-t-[150px] border-t-gray-600 border-r-[150px] border-r-transparent opacity-70"></div>

        {/* Yellow Header */}
        <div className="bg-yellow-400 px-8 py-6 mb-8 relative z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">REQUEST FOR QUOTE</h1>
              <div className="text-sm text-gray-700 italic mt-1">[Vendor Name and Address]</div>
            </div>
            <div
              className="w-20 h-20 cursor-pointer border-2 border-dashed border-gray-700 flex items-center justify-center bg-white rounded"
              onClick={() => fileInputRef.current?.click()}
            >
              {logo || companyLogoUrl ? (
                <img src={logo || companyLogoUrl} alt="Logo" className="w-18 h-18 object-contain" />
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
          </div>
        </div>

        {/* Date */}
        <div className="px-8 mb-6 relative z-10 text-right">
          <div className="text-sm text-gray-600">[Date]</div>
        </div>

        {/* Letter Content */}
        <div className="px-8 mb-6 relative z-10">
          <p className="text-gray-800 mb-4">
            <strong>Dear [Vendor Name],</strong>
          </p>
          <p className="text-gray-700 mb-6">
            We are currently seeking proposals for <strong>catering services</strong> for an upcoming event. Please provide your best quote for the following services:
          </p>
        </div>

        {/* Services Table */}
        <div className="px-8 mb-6 relative z-10">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="px-4 py-3 text-left text-sm font-bold">Service</th>
                <th className="px-4 py-3 text-left text-sm font-bold">Description</th>
                <th className="px-4 py-3 text-center text-sm font-bold">Quantity</th>
                <th className="px-4 py-3 text-center text-sm font-bold">Price/Unit</th>
                <th className="px-4 py-3 text-center text-sm font-bold">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-300">
                  <td className="px-4 py-3 text-sm text-gray-800 font-semibold">{item.service}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 text-center">{item.quantity}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 text-center">{item.pricePerUnit}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 text-center">{item.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Cost */}
        <div className="px-8 mb-6 relative z-10">
          <p className="text-lg font-bold text-gray-800">
            Total Cost: <span className="text-gray-800">{data.totalCost}</span>
          </p>
        </div>

        {/* Two Column Layout for Requirements and Evaluation */}
        <div className="px-8 mb-6 relative z-10 grid grid-cols-2 gap-6">
          {/* Left Column - Requirements */}
          <div>
            <p className="text-gray-700 mb-3 text-sm">
              <strong>In addition to providing the above services, we require the following information in your proposal:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
              <li>A description of your company's catering experience and qualifications</li>
              <li>Menu options and customization available for our event</li>
              <li>Serving and setup arrangements for the event</li>
              <li>Staffing requirements and costs for the event</li>
              <li>Any references or examples of similar events you have catered in the past.</li>
            </ul>
          </div>

          {/* Right Column - Evaluation Box */}
          <div className="bg-yellow-400 p-4 rounded">
            <p className="text-gray-800 text-sm font-semibold mb-2">
              We will evaluate proposals based on price, quality, and your company's ability to meet our specific needs.
            </p>
            <p className="text-gray-800 text-sm">
              Please submit your proposal no later than <strong>[Deadline for Submission]</strong>. If you have any questions or require additional information, please do not hesitate to contact us.
            </p>
          </div>
        </div>

        {/* Closing */}
        <div className="px-8 mb-8 relative z-10">
          <p className="text-gray-700 mb-6">
            Thank you for your time and consideration. We look forward to receiving your proposal.
          </p>
          <p className="text-gray-800">Sincerely,</p>
          <p className="text-gray-800 font-semibold mt-2">[Your Name]</p>
          <p className="text-gray-600 text-sm">[Your Company] [Phone] [Email Address]</p>
          <p className="text-gray-600 text-sm">[Website Address]</p>
        </div>

        {/* Bottom Watermark */}
        <div className="absolute bottom-0 left-0 right-0 text-center text-gray-300 text-xs py-2 opacity-50">
          SAMPLE
        </div>
      </div>
    );
  }
);

RFQTemplate1.displayName = "RFQTemplate1";
export default RFQTemplate1;