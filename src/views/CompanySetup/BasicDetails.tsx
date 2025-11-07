import React, { useState } from 'react';
import { Building2, User, Mail, Phone, Globe, Calendar, MapPin, FileText, Upload } from 'lucide-react';

const BasicDetails: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    legalName: '',
    currencySetup: '',
    parentCompany: '',
    timeZone: '',
    email: '',
    contactEmail: '',
    phoneNumber: '',
    website: '',
    status: 'Active',
    crnCin: '',
    tan: '',
    pan: '',
    tpin: '',
    swiftCode: '',
    dateOfIncorporation: '',
    placeOfRegistration: '',
    industryType: '',
    financialYearBegins: '',
    addressLine1: '',
    addressLine2: '',
    state: '',
    country: '',
    logo: null as File | null,
  });

  const [logoPreview, setLogoPreview] = useState<string>('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    if (type === "file" && files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  interface InputFieldProps {
    label: string;
    name: string;
    type?: string;
    icon?: React.ComponentType<{ className?: string }>;
    required?: boolean;
    placeholder?: string;
    accept?: string;
  }

  const InputField = ({ label, name, type = "text", icon: Icon, required = false, placeholder = "", accept = "" }: InputFieldProps) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label} {required && <span className="text-red-500">*</span>}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />}
        <input
          type={type}
          name={name}
          value={formData[name as keyof typeof formData] as string}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          accept={accept}
          className={`w-full border border-gray-300 rounded-lg ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all`}
        />
      </div>
    </div>
  );

  interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
  }

  interface SelectFieldProps {
    label: string;
    name: string;
    options: SelectOption[];
    icon?: React.ComponentType<{ className?: string }> | null;
    required?: boolean;
  }

  const SelectField = ({ label, name, options, icon: Icon, required = false }: SelectFieldProps) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label} {required && <span className="text-red-500">*</span>}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />}
        <select
          name={name}
          value={formData[name as keyof typeof formData] as string}
          onChange={handleChange}
          required={required}
          className={`w-full border border-gray-300 rounded-lg ${Icon ? 'pl-10' : 'pl-3'} pr-10 py-2.5 bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all appearance-none`}
        >
          {options.map((opt: SelectOption) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );

 return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm">
        
        {/* Logo Section */}
        <div className="p-8 pb-6 border-b border-gray-200">
          <div className="flex items-center justify-center">
            {logoPreview ? (
              <div className="relative group">
                <img src={logoPreview} alt="Company Logo" className="h-20 object-contain" />
                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 cursor-pointer rounded transition-all">
                  <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100">Change</span>
                  <input
                    type="file"
                    name="logo"
                    onChange={handleChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center gap-2 px-8 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 transition-all">
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600">Upload Company Logo</span>
                <input
                  type="file"
                  name="logo"
                  onChange={handleChange}
                  accept="image/*"
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
        
        <div className="p-8">
          {/* Company Info & Contact Info - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Company Information */}
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Company Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Company Name" name="companyName" icon={Building2} required placeholder="Enter company name" />
                  <InputField label="Legal Name" name="legalName" icon={FileText} placeholder="Enter legal name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Contact Person" name="contactPerson" icon={User} required placeholder="Enter contact person" />
                  <InputField label="Parent Company" name="parentCompany" icon={Building2} placeholder="Enter parent company" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Industry Type" name="industryType" icon={Building2} placeholder="Enter industry type" />
                  <SelectField 
                    label="Status" 
                    name="status" 
                    icon={null}
                    options={[
                      { value: "Active", label: "Active" },
                      { value: "Inactive", label: "Inactive" }
                    ]} 
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Contact Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Email" name="email" type="email" icon={Mail} placeholder="company@example.com" />
                  <InputField label="Contact Email" name="contactEmail" type="email" icon={Mail} placeholder="contact@example.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Phone Number" name="phoneNumber" type="tel" icon={Phone} placeholder="+1 234 567 8900" />
                  <InputField label="Website" name="website" type="url" icon={Globe} placeholder="https://example.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Time Zone" name="timeZone" icon={Globe} placeholder="Enter time zone" />
                  <InputField label="Currency Setup" name="currencySetup" placeholder="USD, EUR, etc." />
                </div>
              </div>
            </div>
          </div>

          {/* Registration & Compliance and Address - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Registration & Compliance */}
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Registration & Compliance</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="CRN / CIN" name="crnCin" icon={FileText} placeholder="Enter CRN/CIN" />
                  <InputField label="TAN" name="tan" icon={FileText} placeholder="Enter TAN" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="PAN" name="pan" icon={FileText} placeholder="Enter PAN" />
                  <InputField label="TPIN" name="tpin" icon={FileText} placeholder="Enter TPIN" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="SWIFT Code" name="swiftCode" icon={FileText} placeholder="Enter SWIFT code" />
                  <InputField label="Date of Incorporation" name="dateOfIncorporation" type="date" icon={Calendar} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Place of Registration" name="placeOfRegistration" icon={MapPin} placeholder="Enter place" />
                  <SelectField 
                    label="Financial Year Begins" 
                    name="financialYearBegins"
                    icon={Calendar}
                    options={[
                      { value: "", label: "Choose Month", disabled: true },
                      { value: "Jan", label: "January" },
                      { value: "Feb", label: "February" },
                      { value: "Mar", label: "March" },
                      { value: "Apr", label: "April" },
                      { value: "May", label: "May" },
                      { value: "Jun", label: "June" },
                      { value: "Jul", label: "July" },
                      { value: "Aug", label: "August" },
                      { value: "Sep", label: "September" },
                      { value: "Oct", label: "October" },
                      { value: "Nov", label: "November" },
                      { value: "Dec", label: "December" }
                    ]} 
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Address</h2>
              <div className="space-y-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                  <textarea
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Address Line 1"
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  placeholder="Address Line 2"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-all"
            >
              Save Basic Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicDetails;