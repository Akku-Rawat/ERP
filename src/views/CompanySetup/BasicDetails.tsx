import React, { useEffect, useRef, useState } from 'react';
import {
  FaCalendarAlt,
  FaCheckCircle
} from 'react-icons/fa';

const STORAGE_KEY = 'company_setup_basicdetails_v2_uncontrolled'; 

const defaultData = {
  companyName: '',
  district:'',
  city:'',
  postalCode:'',
  province:'',
  companyEmail:'',
  companyPhoneNo:'',
  alternateNo:'',
  companyStatus:'',
  contactPerson: '',
  companyType:'',
  legalName: '',
  parentCompany: '',
  timeZone: '',
  email: '',
  contactEmail: '',
  phoneNumber: '',
  website: '',
  status: 'Active',
  crnCin: '',
  tax: '',
  registerNo: '',
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
  homeBranch: '',
  branchOffice: '',
  onboardingBalance: '',
} as const;

type FormKeys = keyof typeof defaultData;

const BasicDetails: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const refs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null>>({});
  const restoring = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      restoring.current = true;
      requestAnimationFrame(() => {
        Object.keys(parsed).forEach((k) => {
          const el = refs.current[k];
          if (el) {
            try {
              el.value = parsed[k] ?? '';
            } catch {
              // ignore if not settable
            }
          }
        });
        console.debug('[BasicDetails] restored values to inputs from storage');
        setTimeout(() => { restoring.current = false; }, 0);
      });
    } catch (err) {
      console.warn('[BasicDetails] restore failed', err);
      restoring.current = false;
    }
  }, []);

  const saveKey = (name: string, value: string) => {
    if (restoring.current) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const obj = raw ? JSON.parse(raw) : { ...defaultData };
      obj[name] = value;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
      console.debug('[BasicDetails] saved', { name, value });
    } catch (err) {
      console.warn('[BasicDetails] save failed', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.currentTarget;
    const name = target.getAttribute('name') ?? '';
    if (!name) return;
    saveKey(name, target.value ?? '');
  };

  const buildFormDataFromRefs = () => {
    const out: Record<string, string> = {};
    (Object.keys(defaultData) as FormKeys[]).forEach((k) => {
      const el = refs.current[k];
      out[k] = el ? (el.value ?? '') : '';
    });
    return out as Record<FormKeys, string>;
  };

  const handleSubmit = () => {
    const data = buildFormDataFromRefs();
    console.log('[BasicDetails] submit', data);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleReset = () => {
    (Object.keys(defaultData) as FormKeys[]).forEach((k) => {
      const el = refs.current[k];
      if (el) el.value = defaultData[k];
    });
    try { localStorage.removeItem(STORAGE_KEY); } catch {
      console.warn('[BasicDetails] clear storage failed');
    }
    console.debug('[BasicDetails] reset and cleared storage');
  };

  const attachRef = (name: string) => (el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null) => {
    refs.current[name] = el;
  };

  interface InputFieldProps {
    label: string;
    name: FormKeys;
    type?: string;
    icon?: React.ComponentType<{ className?: string }>;
    required?: boolean;
    placeholder?: string;
  }

  const InputField = ({ label, name, type = 'text', icon: Icon, required = false, placeholder = '' }: InputFieldProps) => (
    <div className="relative">
      <label className="block text-xs font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />}
        <input
          type={type}
          name={name}
          defaultValue={defaultData[name]}
          ref={attachRef(name)}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className={`w-full border border-gray-300 rounded-md ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
        />
      </div>
    </div>
  );

  interface SelectOption { value: string; label: string; disabled?: boolean; }
  interface SelectFieldProps { label: string; name: FormKeys; options: SelectOption[]; icon?: React.ComponentType<{ className?: string }> | null; required?: boolean; }

  const SelectField = ({ label, name, options, icon: Icon, required = false }: SelectFieldProps) => (
    <div className="relative">
      <label className="block text-xs font-medium text-gray-700 mb-1.5">{label} {required && <span className="text-red-500">*</span>}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />}
        <select
          name={name}
          defaultValue={defaultData[name]}
          ref={attachRef(name)}
          onChange={handleChange}
          required={required}
          className={`w-full border border-gray-300 rounded-md ${Icon ? 'pl-10' : 'pl-3'} pr-10 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none`}
        >
          {options.map(opt => <option key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.label}</option>)}
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
    <div className="p-6 bg-white">
      <div className="">
        <div className="space-y-2">
          <div className="bg-white overflow-hidden">
            <div className="  px-4">
              <h2 className=" text-base font-semibold text-gray-700 underline">Registration Details</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <InputField label="Registration No" name="registerNo" placeholder="Enter Registration No" />
                  <InputField label="Tax Id/ TPIN" name="tax" placeholder="Enter Tax Id" />
                  <InputField label="Company Name" name="companyName" placeholder="Enter Company Name" />
                  <InputField label="Date of Incorporation" name="dateOfIncorporation" type="date"/>
                  <InputField label="Company Type" name="companyType" placeholder="Enter Company Type" />
                  <InputField label="Company Status" name="companyStatus" placeholder="Enter Company Status" />
                  <InputField label="Industry Type" name="industryType" placeholder="Enter Industry Type" />
                  <SelectField
                    label="Financial Year Begins"
                    name="financialYearBegins"
                    icon={FaCalendarAlt}
                    options={[
                      { value: "", label: "Choose Month", disabled: true },
                      { value: "Jan", label: "January" }, { value: "Feb", label: "February" }, { value: "Mar", label: "March" },
                      { value: "Apr", label: "April" }, { value: "May", label: "May" }, { value: "Jun", label: "June" },
                      { value: "Jul", label: "July" }, { value: "Aug", label: "August" }, { value: "Sep", label: "September" },
                      { value: "Oct", label: "October" }, { value: "Nov", label: "November" }, { value: "Dec", label: "December" }
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden">
            <div className="px-4 ">
              <h2 className=" text-base font-semibold text-gray-700 underline">Contact Information</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <InputField label="Company Email Id" name="companyEmail" required placeholder="Enter Company Email Id" />
                  <InputField label="Company Phone No" name="companyPhoneNo"  placeholder="Enter Company Phone No" />
                  <InputField label="Alternate No" name="contactPerson" required placeholder="Alternate No" />
                  <InputField label="Website" name="parentCompany" placeholder="Enter Website" />
                  <InputField label="Contact Person" name="industryType" placeholder="Enter Contact Person" />
                  <InputField label="E-mail" name="email" placeholder="Enter E-mail"/>
                  <InputField label="Phone No" name="phoneNumber" placeholder="Enter Phone No" />
                </div>
              </div>
            </div>
          </div>

           <div className="bg-white overflow-hidden">
            <div className=" px-4">
              <h2 className=" text-base font-semibold text-gray-700 underline">Company Address</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <InputField label="Address Line 1" name="addressLine1"  placeholder="Enter Address Line 1" />
                  <InputField label="Address Line 2" name="addressLine2" placeholder="Enter Address Line 2" />
                  <InputField label="City" name="city" placeholder="Enter City" />
                  <InputField label="District" name="district" placeholder="Enter District" />
                  <InputField label="Province" name="province" placeholder="Enter Province" />
                  <InputField label="Country" name="country" placeholder="Enter Country" />
                  <InputField label="Postal Code" name="postalCode" placeholder="Enter District" />
                  <InputField label="Time Zone" name="timeZone" placeholder="Enter time zone" />
                </div>
              </div>
            </div>
          </div>

          {/* <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-blue-500 px-4 py-3">
              <h2 className="text-sm font-semibold text-white"></h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Address Line 1</label>
                    <FaMapMarkerAlt className="absolute left-3 top-[38px] text-gray-400 w-4 h-4 pointer-events-none" />
                    <textarea
                      name="addressLine1"
                      defaultValue={defaultData.addressLine1}
                      ref={attachRef('addressLine1')}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Street address, P.O. box, company name"
                      className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Address Line 2</label>
                    <textarea
                      name="addressLine2"
                      defaultValue={defaultData.addressLine2}
                      ref={attachRef('addressLine2')}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Apartment, suite, unit, building, floor, etc."
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">State</label>
                    <input
                      type="text"
                      name="state"
                      defaultValue={defaultData.state}
                      ref={attachRef('state')}
                      onChange={handleChange}
                      placeholder="State / Province"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Country</label>
                    <input
                      type="text"
                      name="country"
                      defaultValue={defaultData.country}
                      ref={attachRef('country')}
                      onChange={handleChange}
                      placeholder="Country"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          <div className="flex justify-end gap-3">
            <button
              onClick={handleReset}
              className="px-5 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 shadow-sm hover:shadow transition-all"
            >
              Save Details
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BasicDetails;