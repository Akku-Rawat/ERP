import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

const base_url = import.meta.env.VITE_BASE_URL as string;
const vite_company_api_url = import.meta.env.VITE_COMPANY_API_URL as string;
const api = createAxiosInstance(base_url);

const ENDPOINTS = {
  createCompany: `${base_url}.company_setup.setup.create_company_api`,
  getAllCompanies: `${base_url}.company_setup.setup.get_companies_api`,
  getCompanyById: `${vite_company_api_url}.get_company_api`,
  updateCompany: `${base_url}.company_setup.setup.update_company_info`,
  updateCompanyById: `${vite_company_api_url}.update_company_api`,
  deleteCompany: `${base_url}.company_setup.setup.delete_company_api`,
  updateAccountsCompanyInfo: `${base_url}.company_setup.setup.update_accounts_company_info`,
   updateCompanyFiles: `${vite_company_api_url}.update_company_files`,
};

export async function createCompany(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.post(ENDPOINTS.createCompany, payload);
  return resp.data;
}

export async function getAllCompanies(): Promise<any> {
  const resp: AxiosResponse = await api.get(ENDPOINTS.getAllCompanies);
  return resp.data || [];
}

export async function getCompanyById(id: string): Promise<any> {
  const url = `${ENDPOINTS.getCompanyById}?custom_company_id=${encodeURIComponent(id)}`;
  const resp: AxiosResponse = await api.get(url);
  return resp.data ?? null;
}

export async function updateCompanyById(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.post(
    ENDPOINTS.updateCompanyById,
    payload,
  );

  return resp.data;
}

export async function deleteCompanyById(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.delete(ENDPOINTS.deleteCompany, {
    data: payload,
  });
  return resp.data;
}

export async function updateAccountsCompany(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.put(
    ENDPOINTS.updateAccountsCompanyInfo,
    payload,
  );
  return resp.data;
}
/**
 * Update company files (logo and signature)
 */
export async function updateCompanyFiles(
  companyId: string,
  logoFile?: File | null,
  signatureFile?: File | null
): Promise<any> {
  const formData = new FormData();
  
  
  formData.append("id", companyId);
  
 
  if (logoFile) {
    formData.append("documents[companyLogoUrl]", logoFile);
  }
  

  if (signatureFile) {
    formData.append("documents[authorizedSignatureUrl]", signatureFile);
  }
  
  
  const resp: AxiosResponse = await api.patch(
    ENDPOINTS.updateCompanyFiles,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  
  return resp.data;
}