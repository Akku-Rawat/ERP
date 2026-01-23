import React, { useState, useRef } from "react";
import { Plus, Trash2, Building2 } from "lucide-react";
import Modal from "../ui/modal/modal";
import { Input, Select, Card, Button } from "../ui/modal/formComponent";
import { motion } from "framer-motion";

interface RfqTabsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SupplierRow {
  supplier: string;
  contact: string;
  email: string;
  sendEmail: boolean;
}

interface ItemRow {
  itemCode: string;
  requiredDate: string;
  quantity: number;
  uom: string;
  warehouse: string;
}

const emptySupplier: SupplierRow = {
  supplier: "",
  contact: "",
  email: "",
  sendEmail: true,
};

const emptyItem: ItemRow = {
  itemCode: "",
  requiredDate: new Date().toISOString().split("T")[0],
  quantity: 0,
  uom: "",
  warehouse: "",
};

const RfqTabsModal: React.FC<RfqTabsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<
    "details" | "emailTemplates" | "terms"
  >("details");

  // RFQ states
  const [rfqNumber, setRfqNumber] = useState("PUR-RFQ-");
  const [requestDate, setRequestDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [quoteDeadline, setQuoteDeadline] = useState("");
  const [status, setStatus] = useState("Draft");
  const [suppliers, setSuppliers] = useState<SupplierRow[]>([
    { ...emptySupplier },
  ]);
  const [items, setItems] = useState<ItemRow[]>([{ ...emptyItem }]);

  // Email template states
  const [templateName, setTemplateName] = useState("");
  const [templateType, setTemplateType] = useState("Quote Email");
  const [subject, setSubject] = useState("");
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [sendAttachedFiles, setSendAttachedFiles] = useState(true);
  const [sendPrint, setSendPrint] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [termsAndConditions, setTermsAndConditions] = useState("");

  interface PaymentRow {
    paymentTerm: string;
    description: string;
    dueDate: string;
    invoicePortion: number;
    paymentAmount: number;
  }

  const suppliersPerPage = 3;
  const [suppliersPage, setSuppliersPage] = useState(0);
  const paginatedSuppliers = suppliers.slice(
    suppliersPage * suppliersPerPage,
    (suppliersPage + 1) * suppliersPerPage,
  );

  const itemsPerPage = 3;
  const [itemsPage, setItemsPage] = useState(0);
  const paginatedItems = items.slice(
    itemsPage * itemsPerPage,
    (itemsPage + 1) * itemsPerPage,
  );

  // Payment rows
  const [paymentRows, setPaymentRows] = useState<PaymentRow[]>([
    {
      paymentTerm: "",
      description: "",
      dueDate: "",
      invoicePortion: 0,
      paymentAmount: 0,
    },
  ]);
  const paymentItemsPerPage = 4;
  const [paymentPage, setPaymentPage] = useState(0);
  const paginatedPaymentRows = paymentRows.slice(
    paymentPage * paymentItemsPerPage,
    (paymentPage + 1) * paymentItemsPerPage,
  );

  const addPaymentRow = () => {
    setPaymentRows((prev) => {
      const newRows = [
        ...prev,
        {
          paymentTerm: "",
          description: "",
          dueDate: "",
          invoicePortion: 0,
          paymentAmount: 0,
        },
      ];
      setPaymentPage(Math.floor((newRows.length - 1) / paymentItemsPerPage));
      return newRows;
    });
  };

  const removePaymentRow = (idx: number) =>
    setPaymentRows((rows) =>
      rows.length === 1 ? rows : rows.filter((_, i) => i !== idx),
    );

  const handlePaymentRowChange = (
    idx: number,
    key: keyof PaymentRow,
    value: any,
  ) => {
    setPaymentRows((rows) => {
      const updated = [...rows];
      updated[idx] = { ...updated[idx], [key]: value };
      return updated;
    });
  };

  // Helper styles for tab buttons (matches invoice modal)
  const tabClass = (active: boolean) =>
    `px-6 py-3 font-medium text-sm capitalize transition-colors ${
      active
        ? "text-indigo-600 border-b-2 border-indigo-600 bg-white"
        : "text-gray-600 hover:text-gray-900"
    }`;

  // Suppliers/items handlers
  const handleSupplier = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
    field: keyof SupplierRow,
  ) => {
    const copy = [...suppliers];
    if (field === "sendEmail") {
      copy[idx] = {
        ...copy[idx],
        [field]: (e.target as HTMLInputElement).checked,
      };
    } else {
      copy[idx] = { ...copy[idx], [field]: e.target.value };
    }
    setSuppliers(copy);
  };

  const addSupplier = () => {
    setSuppliers((prev) => {
      const newSuppliers = [...prev, { ...emptySupplier }];
      setSuppliersPage(
        Math.floor((newSuppliers.length - 1) / suppliersPerPage),
      );
      return newSuppliers;
    });
  };

  // Item handlers
  const handleItem = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
    field: keyof ItemRow,
  ) => {
    const copy = [...items];
    const isNum = field === "quantity";
    copy[idx] = {
      ...copy[idx],
      [field]: isNum ? Number(e.target.value) : e.target.value,
    };
    setItems(copy);
  };
  const addItem = () => {
    setItems([...items, { ...emptyItem }]);
    setItemsPage(Math.floor(items.length / itemsPerPage));
  };
  const removeItem = (idx: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  // Editor toolbar actions
  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertToken = (token: string) => {
    exec("insertHTML", token);
  };

  const getEditorHtml = () => editorRef.current?.innerHTML || "";

  const handleSaveTemplate = () => {
    console.log({
      name: templateName,
      type: templateType,
      subject,
      messageHtml: getEditorHtml(),
      sendAttachedFiles,
      sendPrint,
    });
    setPreviewOpen(false);
    alert("Template saved (console).");
  };

  const resetTemplate = () => {
    setTemplateName("");
    setTemplateType("Quote Email");
    setSubject("");
    if (editorRef.current) editorRef.current.innerHTML = "";
    setSendAttachedFiles(true);
    setSendPrint(false);
  };

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <div className="flex gap-2">
        <Button variant="secondary">Reset</Button>
        <Button variant="primary">Save RFQ</Button>
      </div>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Request For Quotation"
      subtitle="Create and send RFQ to suppliers"
      icon={Building2}
      footer={footer}
      maxWidth="6xl"
      height="90vh"
    >
      <div className="h-full flex flex-col">
        {/*  TABS  */}
        <div className="flex gap-1 -mx-6 -mt-6 px-6 pt-4 bg-app sticky top-0 z-10 shrink-0">
          {(["details", "emailTemplates", "terms"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-3 font-semibold text-sm capitalize rounded-t-lg ${
                activeTab === tab
                  ? "text-primary bg-card shadow-sm"
                  : "text-muted hover:bg-card/50"
              }`}
            >
              {tab === "details" && "Details"}
              {tab === "emailTemplates" && "Email Templates"}
              {tab === "terms" && "Terms"}

              {activeTab === tab && (
                <motion.div
                  layoutId="activeRfqTab"
                  className="absolute inset-0 bg-card rounded-t-lg shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  style={{ zIndex: -1 }}
                />
              )}
            </button>
          ))}
        </div>

        {/*  CONTENT  */}
        <section className="flex-1 overflow-y-auto p-4 space-y-6">
          {/*  DETAILS TAB  */}
          {activeTab === "details" && (
            <div className="grid grid-cols-3 gap-6 p-4">
              {/* LEFT SIDE */}
              <div className="col-span-2 space-y-6">
                {/* BASIC INFO */}
                <Card title="RFQ Details">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <Input
                      label="RFQ Number"
                      value={rfqNumber}
                      onChange={(e) => setRfqNumber(e.target.value)}
                    />
                    <Input
                      type="date"
                      label="Request Date"
                      value={requestDate}
                      onChange={(e) => setRequestDate(e.target.value)}
                    />
                    <Input
                      type="date"
                      label="Quote Deadline"
                      value={quoteDeadline}
                      onChange={(e) => setQuoteDeadline(e.target.value)}
                    />
                    <Select
                      label="Status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option>Draft</option>
                      <option>Sent</option>
                      <option>Received</option>
                    </Select>
                  </div>
                </Card>

                {/* SUPPLIERS */}
                <Card title="Suppliers">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-row-hover">
                        <tr>
                          <th>#</th>
                          <th>Supplier</th>
                          <th>Contact</th>
                          <th>Email</th>
                          <th>Send</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {suppliers.map((sup, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>
                              <Input
                                label=""
                                value={sup.supplier}
                                onChange={(e) =>
                                  handleSupplier(e, i, "supplier")
                                }
                              />
                            </td>
                            <td>
                              <Input
                                label=""
                                value={sup.contact}
                                onChange={(e) =>
                                  handleSupplier(e, i, "contact")
                                }
                              />
                            </td>
                            <td>
                              <Input
                                label=""
                                value={sup.email}
                                onChange={(e) => handleSupplier(e, i, "email")}
                              />
                            </td>
                            <td className="text-center">
                              <input
                                type="checkbox"
                                checked={sup.sendEmail}
                                onChange={(e) =>
                                  handleSupplier(e, i, "sendEmail")
                                }
                              />
                            </td>
                            <td>
                              <Button
                                variant="ghost"
                                onClick={() => removeSupplier(i)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <Button
                    variant="secondary"
                    className="mt-3"
                    onClick={addSupplier}
                  >
                    <Plus className="w-4 h-4" /> Add Supplier
                  </Button>
                </Card>

                {/* ITEMS */}
                <Card title="Items">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-row-hover">
                        <tr>
                          <th>No</th>
                          <th>Item Code</th>
                          <th>Date</th>
                          <th>Qty</th>
                          <th>UOM</th>
                          <th>Warehouse</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((it, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>
                              <Input
                                label=""
                                value={it.itemCode}
                                onChange={(e) => handleItem(e, i, "itemCode")}
                              />
                            </td>
                            <td>
                              <Input
                                type="date"
                                label=""
                                value={it.requiredDate}
                                onChange={(e) =>
                                  handleItem(e, i, "requiredDate")
                                }
                              />
                            </td>
                            <td>
                              <Input
                                type="number"
                                label=""
                                value={it.quantity}
                                onChange={(e) => handleItem(e, i, "quantity")}
                              />
                            </td>
                            <td>
                              <Input
                                label=""
                                value={it.uom}
                                onChange={(e) => handleItem(e, i, "uom")}
                              />
                            </td>
                            <td>
                              <Input
                                label=""
                                value={it.warehouse}
                                onChange={(e) => handleItem(e, i, "warehouse")}
                              />
                            </td>
                            <td>
                              <Button
                                variant="ghost"
                                onClick={() => removeItem(i)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <Button
                    variant="secondary"
                    className="mt-3"
                    onClick={addItem}
                  >
                    <Plus className="w-4 h-4" /> Add Item
                  </Button>
                </Card>
              </div>

              {/* RIGHT SUMMARY */}
              <div className="col-span-1 space-y-6">
                <Card title="Supplier Summary">
                  <p>Total Suppliers: {suppliers.length}</p>
                  <p>
                    Emails to Send:{" "}
                    {suppliers.filter((s) => s.sendEmail).length}
                  </p>
                </Card>

                <Card title="Items Summary">
                  <p>Total Items: {items.length}</p>
                  <p>
                    Total Qty: {items.reduce((s, it) => s + it.quantity, 0)}
                  </p>
                </Card>
              </div>
            </div>
          )}

          {/*  EMAIL TAB  */}
          {activeTab === "emailTemplates" && (
            <Card title="Email Template">
              <div className=" mx-auto bg-white rounded-lg p-6 shadow border border-gray-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Email Template
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="font-medium text-gray-600">Name</span>
                    <input
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="Template name"
                      className="px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="font-medium text-gray-600">Type</span>
                    <select
                      value={templateType}
                      onChange={(e) => setTemplateType(e.target.value)}
                      className="px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      <option>Quote Email</option>
                      <option>Order Confirmation</option>
                      <option>Reminder</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="font-medium text-gray-600">Subject</span>
                    <input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Subject line"
                      className="px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </label>
                </div>
                {/* Toolbar */}
                <div className="border border-gray-200 rounded-t-md bg-gray-50 p-2 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => exec("bold")}
                      title="Bold"
                      className="px-2 py-1 rounded hover:bg-gray-100 border border-transparent"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => exec("italic")}
                      title="Italic"
                      className="px-2 py-1 rounded hover:bg-gray-100 border border-transparent"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => exec("underline")}
                      title="Underline"
                      className="px-2 py-1 rounded hover:bg-gray-100 border border-transparent"
                    >
                      U
                    </button>
                  </div>
                  <div className="w-px h-6 bg-gray-200 mx-2" />
                  {/* Token insert */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600">
                      Insert token
                    </label>
                    <select
                      onChange={(e) => {
                        if (!e.target.value) return;
                        insertToken(`{{${e.target.value}}}`);
                        e.target.selectedIndex = 0;
                      }}
                      defaultValue=""
                      className="px-2 py-1 border border-gray-200 rounded bg-white text-sm"
                    >
                      <option value="">-- select token --</option>
                      <option value="contact.first_name">
                        contact.first_name
                      </option>
                      <option value="supplier_name">supplier_name</option>
                      <option value="rfq_number">rfq_number</option>
                      <option value="portal_link">portal_link</option>
                    </select>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <select
                      onChange={(e) => {
                        if (!e.target.value) return;
                        insertToken(`<br/>${e.target.value}<br/>`);
                        e.target.selectedIndex = 0;
                      }}
                      defaultValue=""
                      className="px-2 py-1 border border-gray-200 rounded bg-white text-sm"
                    >
                      <option value="">Insert signature</option>
                      <option value="Regards,<br/>[Company Name]">
                        Standard
                      </option>
                      <option value="Best regards,<br/>[Procurement Team]">
                        Procurement
                      </option>
                      <option value="Sincerely,<br/>[Your Name]">
                        Sincerely
                      </option>
                    </select>
                    <button
                      type="button"
                      onClick={() => setPreviewOpen(true)}
                      className="px-3 py-1 text-sm rounded border border-gray-200 hover:bg-gray-100"
                    >
                      Preview
                    </button>
                  </div>
                </div>
                <div className="border border-t-0 border-gray-200 rounded-b-md bg-white">
                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    className="min-h-[240px] p-4 prose max-w-none text-sm text-gray-800 outline-none"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    <p style={{ color: "#6b7280" }}>
                      Start typing your message here. Use tokens to personalize
                      (e.g., {"{{contact.first_name}}"}).
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-start gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={sendAttachedFiles}
                      onChange={(e) => setSendAttachedFiles(e.target.checked)}
                    />
                    <span>Attach files</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={sendPrint}
                      onChange={(e) => setSendPrint(e.target.checked)}
                    />
                    <span>Attach PDF print</span>
                  </label>
                  <div className="ml-auto flex gap-2">
                    <button
                      onClick={resetTemplate}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 text-sm"
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleSaveTemplate}
                      className="px-4 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 text-sm"
                    >
                      Save Template
                    </button>
                  </div>
                </div>
                {/* Preview modal */}
                {previewOpen && (
                  <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-3xl bg-white rounded shadow-lg overflow-auto">
                      <div className="flex items-center justify-between p-4 border-b">
                        <h4 className="font-semibold text-gray-800">
                          Email Preview
                        </h4>
                        <button
                          onClick={() => setPreviewOpen(false)}
                          className="px-2 py-1 rounded hover:bg-gray-100"
                        >
                          Close
                        </button>
                      </div>
                      <div className="p-6">
                        <div className="text-sm text-gray-600 mb-3">
                          {subject || (
                            <span className="text-gray-400">[No subject]</span>
                          )}
                        </div>
                        <div
                          className="prose max-w-none text-sm text-gray-800"
                          dangerouslySetInnerHTML={{ __html: getEditorHtml() }}
                        />
                        <div className="mt-6 text-xs text-gray-500">
                          Tokens shown as inserted values will be replaced when
                          sending.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/*  TERMS TAB  */}
          {activeTab === "terms" && (
            <Card title="Terms & Conditions">
              <div className="space-y-8 mx-auto bg-white rounded-lg p-6  ">
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-800">
                    Payment Terms
                  </h3>
                  <div className="mt-4">
                    <span className="font-medium text-gray-700">
                      Payment Schedule
                    </span>
                    <div className="overflow-x-auto rounded-lg border mt-2">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-700">
                          <tr>
                            <th className="px-2 py-2">No.</th>
                            <th className="px-2 py-2">Payment Term</th>
                            <th className="px-2 py-2">Description</th>
                            <th className="px-2 py-2">Due Date *</th>
                            <th className="px-2 py-2">Invoice Portion</th>
                            <th className="px-2 py-2">Payment Amount *</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {paginatedPaymentRows.length === 0 ? (
                            <tr>
                              <td
                                colSpan={7}
                                className="text-center p-6 text-gray-400"
                              >
                                No Data
                              </td>
                            </tr>
                          ) : (
                            paginatedPaymentRows.map((row, idx) => {
                              const i = paymentPage * paymentItemsPerPage + idx;
                              return (
                                <tr key={i} className="hover:bg-gray-50">
                                  <td className="px-3 py-2 text-center">
                                    {i + 1}
                                  </td>
                                  <td className="px-1 py-1">
                                    <input
                                      className="w-full rounded border p-1 text-sm"
                                      name="paymentTerm"
                                      value={row.paymentTerm}
                                      onChange={(e) =>
                                        handlePaymentRowChange(
                                          i,
                                          "paymentTerm",
                                          e.target.value,
                                        )
                                      }
                                    />
                                  </td>
                                  <td className="px-1 py-1">
                                    <input
                                      className="w-full rounded border p-1 text-sm"
                                      name="description"
                                      value={row.description}
                                      onChange={(e) =>
                                        handlePaymentRowChange(
                                          i,
                                          "description",
                                          e.target.value,
                                        )
                                      }
                                    />
                                  </td>
                                  <td className="px-1 py-1">
                                    <input
                                      type="date"
                                      className="w-full rounded border p-1 text-sm"
                                      name="dueDate"
                                      value={row.dueDate}
                                      onChange={(e) =>
                                        handlePaymentRowChange(
                                          i,
                                          "dueDate",
                                          e.target.value,
                                        )
                                      }
                                    />
                                  </td>
                                  <td className="px-1 py-1">
                                    <input
                                      type="number"
                                      className="w-full rounded border p-1 text-sm"
                                      name="invoicePortion"
                                      value={row.invoicePortion}
                                      onChange={(e) =>
                                        handlePaymentRowChange(
                                          i,
                                          "invoicePortion",
                                          Number(e.target.value),
                                        )
                                      }
                                    />
                                  </td>
                                  <td className="px-1 py-1">
                                    <input
                                      type="number"
                                      className="w-full rounded border p-1 text-sm"
                                      name="paymentAmount"
                                      value={row.paymentAmount}
                                      onChange={(e) =>
                                        handlePaymentRowChange(
                                          i,
                                          "paymentAmount",
                                          Number(e.target.value),
                                        )
                                      }
                                    />
                                  </td>
                                  <td className="px-1 py-1 text-center">
                                    <button
                                      type="button"
                                      onClick={() => removePaymentRow(i)}
                                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                                      disabled={paymentRows.length === 1}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm text-gray-600">
                        Showing{" "}
                        {paymentRows.length === 0
                          ? 0
                          : paymentPage * paymentItemsPerPage + 1}
                        –
                        {Math.min(
                          (paymentPage + 1) * paymentItemsPerPage,
                          paymentRows.length,
                        )}{" "}
                        of {paymentRows.length}
                      </span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setPaymentPage(Math.max(0, paymentPage - 1))
                          }
                          disabled={paymentPage === 0}
                          className="px-2 py-1 text-xs rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          ← Prev
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentPage(paymentPage + 1)}
                          disabled={
                            (paymentPage + 1) * paymentItemsPerPage >=
                            paymentRows.length
                          }
                          className="px-2 py-1 text-xs rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next →
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={addPaymentRow}
                      className="flex items-center gap-1 rounded bg-indigo-100 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-200 mt-2"
                    >
                      <Plus className="w-4 h-4" /> Add Row
                    </button>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">
                      Terms and Conditions
                    </h3>
                  </div>
                  <div className="p-6">
                    {/* Rich Text Editor Toolbar */}
                    <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex items-center gap-1 flex-wrap">
                      <select className="px-2 py-1 text-sm border border-gray-300 rounded bg-white">
                        <option>Normal</option>
                        <option>Heading 1</option>
                        <option>Heading 2</option>
                      </select>

                      <div className="w-px h-6 bg-gray-300 mx-1"></div>

                      <select className="px-2 py-1 text-sm border border-gray-300 rounded bg-white">
                        <option>---</option>
                        <option>Arial</option>
                        <option>Times New Roman</option>
                      </select>

                      <div className="w-px h-6 bg-gray-300 mx-1"></div>

                      <button
                        className="p-1.5 hover:bg-gray-200 rounded"
                        title="Bold"
                      >
                        <strong className="text-sm">B</strong>
                      </button>
                      <button
                        className="p-1.5 hover:bg-gray-200 rounded"
                        title="Italic"
                      >
                        <em className="text-sm">I</em>
                      </button>
                      <button
                        className="p-1.5 hover:bg-gray-200 rounded"
                        title="Underline"
                      >
                        <u className="text-sm">U</u>
                      </button>
                      <button
                        className="p-1.5 hover:bg-gray-200 rounded"
                        title="Strikethrough"
                      >
                        <s className="text-sm">S</s>
                      </button>
                      <button
                        className="p-1.5 hover:bg-gray-200 rounded text-sm"
                        title="Subscript"
                      >
                        T<sub>x</sub>
                      </button>

                      <div className="w-px h-6 bg-gray-300 mx-1"></div>

                      <button
                        className="p-1.5 hover:bg-gray-200 rounded text-sm"
                        title="Font Color"
                      >
                        A
                      </button>
                      <button
                        className="p-1.5 hover:bg-gray-200 rounded text-sm"
                        title="Background Color"
                      >
                        A̲
                      </button>

                      <div className="w-px h-6 bg-gray-300 mx-1"></div>

                      <button
                        className="p-1.5 hover:bg-gray-200 rounded text-sm"
                        title="Quote"
                      >
                        "
                      </button>
                      <button
                        className="p-1.5 hover:bg-gray-200 rounded text-sm"
                        title="Code"
                      >
                        {"</>"}
                      </button>
                      <button
                        className="p-1.5 hover:bg-gray-200 rounded text-sm"
                        title="Bullet Point"
                      >
                        •¶
                      </button>

                      <div className="w-px h-6 bg-gray-300 mx-1"></div>

                      <button
                        className="p-1.5 hover:bg-gray-200 rounded text-sm"
                        title="Link"
                      >
                        🔗
                      </button>
                      <button
                        className="p-1.5 hover:bg-gray-200 rounded text-sm"
                        title="Image"
                      >
                        🖼
                      </button>

                      <div className="w-px h-6 bg-gray-300 mx-1"></div>

                      <button
                        className="p-1.5 hover:bg-gray-200 rounded text-sm"
                        title="Bullet List"
                      >
                        ≡
                      </button>
                      <button
                        className="p-1.5 hover:bg-gray-200 rounded text-sm"
                        title="Numbered List"
                      >
                        ☰
                      </button>
                      <button
                        className="p-1.5 hover:bg-gray-200 rounded text-sm"
                        title="Checklist"
                      >
                        ☑
                      </button>

                      <div className="w-px h-6 bg-gray-300 mx-1"></div>

                      <button
                        className="p-1.5 hover:bg-gray-200 rounded text-sm"
                        title="Align Left"
                      >
                        ≡
                      </button>
                      <button
                        className="p-1.5 hover:bg-gray-200 rounded text-sm"
                        title="Align Center"
                      >
                        ≡
                      </button>
                      <button
                        className="p-1.5 hover:bg-gray-200 rounded text-sm"
                        title="Align Right"
                      >
                        ≡
                      </button>

                      <div className="w-px h-6 bg-gray-300 mx-1"></div>

                      <select className="px-2 py-1 text-sm border border-gray-300 rounded bg-white">
                        <option>Table</option>
                      </select>
                    </div>

                    {/* Text Area */}
                    <textarea
                      value={termsAndConditions}
                      onChange={(e) => setTermsAndConditions(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 border-t-0 rounded-b-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows={12}
                      placeholder="Enter terms and conditions..."
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}
        </section>
      </div>
    </Modal>
  );
};

export default RfqTabsModal;
