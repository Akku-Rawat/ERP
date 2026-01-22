// src/api/salesApi.ts
import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

const base_url = import.meta.env.VITE_INVOICE_API_URL as string;
const api = createAxiosInstance(base_url);
const creditapi=import.meta.env.VITE_CREDIT_NOTE_API_URL as string;
const debitapi=import.meta.env.VITE_DEBIT_NOTE_API_URL as string;

const ENDPOINTS = {
  createSalesInvoice: `${base_url}.create_sales_invoice`,
  getSalesInvoices: `${base_url}.get_sales_invoice`,
  getSalesInvoiceById: `${base_url}.get_sales_invoice_by_id`,
  updateInvoiceStatus: `${base_url}.get_sales_invoice_by_id`,
  deleteSalesInvoice: `${base_url}.delete_sales_invoice`,
  createCreditNote: `${creditapi}.create_credit_note_from_sales_invoice`,
  createDebitNote: `${debitapi}.create_debit_note_from_invoice`,
  getAllDebitNotes:`${debitapi}.get_debit_notes`,
  getAllCreditNotes:`${creditapi}.get_credit_notes`,
};

export async function createSalesInvoice(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.post(
    ENDPOINTS.createSalesInvoice,
    payload,
  );
  return resp.data;
}

export async function updateInvoiceStatus(
  invoiceNumber: string,
  status: string,
) {
  const url = `${ENDPOINTS.updateInvoiceStatus}?id=${encodeURIComponent(invoiceNumber)}`;
  const resp: AxiosResponse = await api.patch(url, {
    invoiceStatus: status,
  });

  return resp.data;
}

export async function getAllSalesInvoices(
  page: number = 1,
  page_size: number = 10,
): Promise<any> {
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
  originalSalesInvoiceNumber: string;
  CreditNoteReasonCode: string;
  invcAdjustReason?: string;
  transactionProgress: string;
  items: {
    itemCode: string;
    quantity: number;
    price: number;
  }[];
}): Promise<any> {
  const resp: AxiosResponse = await api.post(
    ENDPOINTS.createCreditNote,
    payload
  );
  return resp.data;
}

export async function createDebitNoteFromInvoice(payload: {
  originalSalesInvoiceNumber: string;
  DebitNoteReasonCode: string;
  invcAdjustReason: string;
  transactionProgress: string;
  items: {
    itemCode: string;
    quantity: number;
    price: number;
  }[];
}): Promise<any> {
  const resp = await api.post(
    ENDPOINTS.createDebitNote,
    payload
  );
  return resp.data;
}

export async function getAllDebitNotes(
  page: number = 1,
  page_size: number = 10,
): Promise<any> {
  const resp: AxiosResponse = await api.get(
    ENDPOINTS.getAllDebitNotes,
    {
      params: { page, page_size },
    }
  );
  return resp.data;
}
export async function getAllCreditNotes(
  page: number = 1,
  page_size: number = 10,
): Promise<any> {
  const resp: AxiosResponse = await api.get(
    ENDPOINTS.getAllCreditNotes,
    {
      params: { page, page_size },
    }
  );
  return resp.data;
}
