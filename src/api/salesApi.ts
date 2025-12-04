// src/api/salesApi.ts
import type { AxiosResponse } from 'axios';
import { createAxiosInstance } from './axiosInstance';

const base_url = import.meta.env.VITE_BASE_URL as string;
const api = createAxiosInstance(base_url);

// FULL ENDPOINT STRING FORMAT REQUIRED BY YOU
const ENDPOINTS = {
  getSalesInvoices: `${base_url}.sales.api.get_sales_invoice`,
  getSalesInvoiceById: `${base_url}.sales.api.get_sales_invoice_by_id`,
  deleteSalesInvoice: `${base_url}.sales.api.delete_sales_invoice`,
  createCreditNote: `${base_url}.sales.api.create_credit_note_from_invoice`,
  createDebitNote: `${base_url}.sales.api.create_debit_note_from_invoice`,
};

// export interface SalesInvoice {
//   id?: string;
//   customer?: string;
//   total?: number;
//   status?: string;
//   items?: any[];
//   [key: string]: any;
// }

export async function getAllSalesInvoices(page: number = 1, page_size: number = 10): Promise<any> {
  const resp: AxiosResponse = await api.get(ENDPOINTS.getSalesInvoices, {
    params: { page, page_size },
  });
  return resp.data;
}

export async function getSalesInvoiceById(id: string): Promise<any | null> {
  const url = `${ENDPOINTS.getSalesInvoiceById}?id=${encodeURIComponent(id)}`;
  const resp: AxiosResponse = await api.get(url);
  return resp.data ?? null;
}

export async function deleteSalesInvoiceById(id: string): Promise<any> {
  const url = `${ENDPOINTS.deleteSalesInvoice}?id=${encodeURIComponent(id)}`;
  const resp: AxiosResponse = await api.delete(url);
  return resp.data;
}

export async function createCreditNoteFromInvoice(payload: {
  sales_invoice_no: string;
  items: { item_code: string; qty: number; price: number }[];
}): Promise<any> {
  const resp: AxiosResponse = await api.post(ENDPOINTS.createCreditNote, payload);
  return resp.data;
}

export async function createDebitNoteFromInvoice(payload: {
  sales_invoice_no: string;
  items: { item_code: string; qty: number; price: number }[];
}): Promise<any> {
  const resp: AxiosResponse = await api.post(ENDPOINTS.createDebitNote, payload);
  return resp.data;
}
