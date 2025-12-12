export const transformBasicDetailPayload = (payload: any) => ({
  id: payload.id,

  // registration
  registrationNumber: payload.registration.registerNo,
  tpin: payload.registration.tpin,
  companyName: payload.registration.companyName,
  companyStatus: payload.registration.companyStatus,
  companyType: payload.registration.companyType,
  dateOfIncorporation: payload.registration.dateOfIncorporation,
  industryType: payload.registration.industryType,

  // contact
  'contactInfo[companyEmail]': payload.contact.companyEmail,
  'contactInfo[companyPhone]': payload.contact.companyPhone,
  'contactInfo[alternatePhone]': payload.contact.alternatePhone,
  'contactInfo[contactPerson]': payload.contact.contactPerson,
  'contactInfo[contactEmail]': payload.contact.contactEmail,
  'contactInfo[website]': payload.contact.website,
  'contactInfo[contactPhone]': payload.contact.contactPhone,

  // address
  'address[addressLine1]': payload.address.addressLine1,
  'address[addressLine2]': payload.address.addressLine2,
  'address[city]': payload.address.city,
  'address[district]': payload.address.district,
  'address[province]': payload.address.province,
  'address[postalCode]': payload.address.postalCode,
  'address[country]': payload.address.country,
  'address[timeZone]': payload.address.timeZone,
});

export function appendFormData(formData: FormData, data: any, parentKey?: string) {
  if (data === null || data === undefined) return;

  if (data instanceof File || data instanceof Blob) {
    formData.append(parentKey!, data);
    return;
  }

  if (typeof data === 'object' && !Array.isArray(data)) {
    Object.entries(data).forEach(([key, value]) => {
      const newKey = parentKey ? `${parentKey}[${key}]` : key;
      appendFormData(formData, value, newKey);
    });
    return;
  }

  formData.append(parentKey!, String(data));
}