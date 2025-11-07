import React, { useState } from 'react';
import { 
  FaBuilding, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaGlobe, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaFileAlt, 
  FaUpload, 
  FaCheckCircle, 
  FaTimes 
} from 'react-icons/fa';

const BasicDetails: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
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

  const steps = [
    { id: 0, title: 'Company Info', icon: FaBuilding },
    { id: 1, title: 'Contact Info', icon: FaPhone },
    { id: 2, title: 'Registration', icon: FaFileAlt },
    { id: 3, title: 'Address', icon: FaMapMarkerAlt }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, logo: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        console.log('Image loaded, length:', result.length);
        setLogoPreview(result);
      };
      reader.onerror = () => {
        console.error('Error reading file');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoPreview('');
    setFormData((prev) => ({ ...prev, logo: null }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
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
          className={`w-full border border-gray-300 rounded-lg ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all`}
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
          className={`w-full border border-gray-300 rounded-lg ${Icon ? 'pl-10' : 'pl-3'} pr-10 py-2 text-sm bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all appearance-none`}
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
    <div className="min-h-screen bg-gray-50 py-4 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm">
        
        {/* Logo Upload Section - Fixed at Top */}
        <div className="px-6 py-6 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-blue-50">
          <div className="flex items-center justify-center">
            {logoPreview ? (
              <div className="relative">
                <div className="w-40 h-40 bg-white rounded-2xl shadow-lg flex items-center justify-center p-4 border-2 border-teal-200">
                  <img 
                    src={logoPreview} 
                    alt="Company Logo" 
                    className="max-w-full max-h-full object-contain"
                    style={{ display: 'block' }}
                  />
                </div>
                <button
                  onClick={removeLogo}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all shadow-md"
                  type="button"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
                <label className="absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer">
                  <div className="bg-teal-600 text-white px-4 py-1.5 rounded-full text-xs font-medium hover:bg-teal-700 transition-all shadow-md flex items-center gap-1">
                    <FaUpload className="w-3 h-3" />
                    Change
                  </div>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label className="cursor-pointer">
                <div className="flex flex-col items-center gap-4 px-12 py-8 border-2 border-dashed border-gray-300 rounded-2xl hover:border-teal-500 hover:bg-white transition-all duration-200 bg-white shadow-sm">
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                    <FaUpload className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-center">
                    <span className="text-base text-gray-800 font-bold block">Upload Logo</span>
                    <span className="text-xs text-gray-500 mt-2 block">PNG, JPG, or SVG • Max 5MB</span>
                    <span className="text-xs text-teal-600 font-medium mt-1 block">Click to browse</span>
                  </div>
                </div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
        
        {/* Step Navigation */}
        <div className="border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between px-8 py-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === index;
              const isCompleted = currentStep > index;
              
              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => setCurrentStep(index)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-teal-50' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isActive 
                        ? 'bg-teal-600 text-white' 
                        : isCompleted 
                        ? 'bg-teal-100 text-teal-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isCompleted ? <FaCheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span className={`text-sm font-medium ${
                      isActive 
                        ? 'text-teal-600' 
                        : isCompleted 
                        ? 'text-gray-700' 
                        : 'text-gray-400'
                    }`}>
                      {step.title}
                    </span>
                  </button>
                  
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-3 ${
                      isCompleted ? 'bg-teal-600' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="px-8 py-6">
          {/* Step 0: Company Information */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
                <p className="text-sm text-gray-500 mt-1">Tell us about your company</p>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Company Name" name="companyName" icon={FaBuilding} required placeholder="Enter company name" />
                  <InputField label="Legal Name" name="legalName" icon={FaFileAlt} placeholder="Enter legal name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Contact Person" name="contactPerson" icon={FaUser} required placeholder="Enter contact person" />
                  <InputField label="Parent Company" name="parentCompany" icon={FaBuilding} placeholder="Enter parent company" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Industry Type" name="industryType" icon={FaBuilding} placeholder="Enter industry type" />
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
          )}

          {/* Step 1: Contact Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
                <p className="text-sm text-gray-500 mt-1">How can we reach you?</p>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Email" name="email" type="email" icon={FaEnvelope} placeholder="company@example.com" />
                  <InputField label="Contact Email" name="contactEmail" type="email" icon={FaEnvelope} placeholder="contact@example.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Phone Number" name="phoneNumber" type="tel" icon={FaPhone} placeholder="+1 234 567 8900" />
                  <InputField label="Website" name="website" type="url" icon={FaGlobe} placeholder="https://example.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Time Zone" name="timeZone" icon={FaGlobe} placeholder="Enter time zone" />
                  <InputField label="Currency Setup" name="currencySetup" placeholder="USD, EUR, etc." />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Registration & Compliance */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Registration & Compliance</h2>
                <p className="text-sm text-gray-500 mt-1">Legal and tax information</p>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="CRN / CIN" name="crnCin" icon={FaFileAlt} placeholder="Enter CRN/CIN" />
                  <InputField label="TAN" name="tan" icon={FaFileAlt} placeholder="Enter TAN" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="PAN" name="pan" icon={FaFileAlt} placeholder="Enter PAN" />
                  <InputField label="TPIN" name="tpin" icon={FaFileAlt} placeholder="Enter TPIN" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="SWIFT Code" name="swiftCode" icon={FaFileAlt} placeholder="Enter SWIFT code" />
                  <InputField label="Date of Incorporation" name="dateOfIncorporation" type="date" icon={FaCalendarAlt} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Place of Registration" name="placeOfRegistration" icon={FaMapMarkerAlt} placeholder="Enter place" />
                  <SelectField 
                    label="Financial Year Begins" 
                    name="financialYearBegins"
                    icon={FaCalendarAlt}
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
          )}

          {/* Step 3: Address */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Company Address</h2>
                <p className="text-sm text-gray-500 mt-1">Where is your company located?</p>
              </div>
              
              <div className="space-y-3">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Address Line 1</label>
                  <FaMapMarkerAlt className="absolute left-3 top-10 text-gray-400 w-4 h-4" />
                  <textarea
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Street address, P.O. box, company name"
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Address Line 2</label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    placeholder="Apartment, suite, unit, building, floor, etc."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State / Province"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Country"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-5 mt-5 border-t border-gray-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-5 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-all ${
                currentStep === 0 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            
            <div className="text-sm text-gray-500 font-medium">
              Step {currentStep + 1} of {steps.length}
            </div>
            
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-5 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-all"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-all"
              >
                Save Details
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicDetails;
