import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FileText,
  Download,
  Printer,
  Mail,
  Edit,
  MoreVertical,
  X,
  Calendar,
  Package,
  CreditCard,
  Building2,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Share2,
  Eye,
  Truck,
  DollarSign,
  Loader2,
} from "lucide-react";

import { getPurchaseOrderById } from "../../api/procurement/PurchaseOrderApi";

// Types based on your Purchase Order structure
interface POItem {
  itemCode: string;
  itemName: string;
  quantity: number;
  uom: string;
  rate: number;
  amount: number;
}

interface TaxDetail {
  type: string;
  accountHead: string;
  taxRate: number;
  taxableAmount: number;
  taxAmount: number;
}

interface PaymentPhase {
  paymentTerm: string;
  description: string;
  invoicePortion: number;
  paymentAmount: number;
}

interface AddressBlock {
  addressTitle: string;
  addressType: "Billing" | "Shipping";
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone?: string;
  email?: string;
}

interface PurchaseOrderData {
  poNumber: string;
  poDate: string;
  requiredBy: string;
  status: "Draft" | "Submitted" | "Approved" | "Partially Received" | "Completed" | "Cancelled";
  
  supplier: {
    name: string;
    address: AddressBlock;
  };
  
  dispatchAddress?: AddressBlock;
  shippingAddress: AddressBlock;
  
  currency: string;
  items: POItem[];
  taxes: TaxDetail[];
  paymentTerms: PaymentPhase[];
  
  summary: {
    totalQuantity: number;
    subtotal: number;
    taxTotal: number;
    grandTotal: number;
  };
  
  costCenter?: string;
  project?: string;
  taxCategory?: string;
  incoterm?: string;
  placeOfSupply?: string;
  termsAndConditions?: string;
  remarks?: string;
  
  metadata?: {
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

interface PurchaseOrderViewProps {
  poId: string | number;
  onClose?: () => void;
  onEdit?: () => void;
}

const PurchaseOrderView: React.FC<PurchaseOrderViewProps> = ({
  poId,
  onClose,
  onEdit,
}) => {
  const [po, setPO] = useState<PurchaseOrderData | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPO = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getPurchaseOrderById(poId);
        
        if (response.status === "success" && response.data) {
          const data = response.data;
          
          // Calculate payment terms from payment phases
          const paymentPhases = data.terms?.terms?.selling?.payment?.phases || [];
          const paymentTerms: PaymentPhase[] = paymentPhases.map((phase: any) => ({
            paymentTerm: phase.name,
            description: phase.condition,
            invoicePortion: parseFloat(phase.percentage),
            paymentAmount: (data.grandTotal * parseFloat(phase.percentage)) / 100,
          }));
          
          // Calculate totals
          const subtotal = data.items?.reduce((sum: number, item: any) => sum + item.amount, 0) || 0;
          const taxTotal = data.taxes?.reduce((sum: number, tax: any) => sum + tax.taxAmount, 0) || 0;
          const totalQuantity = data.items?.reduce((sum: number, item: any) => sum + item.qty, 0) || 0;
          
          // Map API response to UI format
          const mappedData: PurchaseOrderData = {
            poNumber: data.poId,
            poDate: data.poDate,
            requiredBy: data.requiredBy,
            status: data.status,
            
            supplier: {
              name: data.supplierName,
              address: {
                addressTitle: data.addresses?.supplierAddress?.addressTitle || "Supplier Address",
                addressType: "Billing",
                addressLine1: data.addresses?.supplierAddress?.addressLine1 || "",
                addressLine2: data.addresses?.supplierAddress?.addressLine2 || "",
                city: data.addresses?.supplierAddress?.city || "",
                state: data.addresses?.supplierAddress?.state || "",
                country: data.addresses?.supplierAddress?.country || "",
                postalCode: data.addresses?.supplierAddress?.postalCode || "",
                phone: data.addresses?.supplierAddress?.phone,
                email: data.addresses?.supplierAddress?.email,
              },
            },
            
            dispatchAddress: data.addresses?.dispatchAddress ? {
              addressTitle: data.addresses.dispatchAddress.addressTitle,
              addressType: "Shipping",
              addressLine1: data.addresses.dispatchAddress.addressLine1,
              addressLine2: data.addresses.dispatchAddress.addressLine2 || "",
              city: data.addresses.dispatchAddress.city,
              state: data.addresses.dispatchAddress.state,
              country: data.addresses.dispatchAddress.country,
              postalCode: data.addresses.dispatchAddress.postalCode,
            } : undefined,
            
            shippingAddress: {
              addressTitle: data.addresses?.shippingAddress?.addressTitle || "Shipping Address",
              addressType: "Shipping",
              addressLine1: data.addresses?.shippingAddress?.addressLine1 || "",
              addressLine2: data.addresses?.shippingAddress?.addressLine2 || "",
              city: data.addresses?.shippingAddress?.city || "",
              state: data.addresses?.shippingAddress?.state || "",
              country: data.addresses?.shippingAddress?.country || "",
              postalCode: data.addresses?.shippingAddress?.postalCode || "",
            },
            
            currency: data.currency || "ZMW",
            
            items: data.items?.map((item: any) => ({
              itemCode: item.item_code,
              itemName: item.item_name,
              quantity: item.qty,
              uom: item.uom,
              rate: item.rate,
              amount: item.amount,
            })) || [],
            
            taxes: data.taxes?.map((tax: any) => ({
              type: tax.type,
              accountHead: tax.accountHead,
              taxRate: tax.taxRate,
              taxableAmount: tax.taxableAmount,
              taxAmount: tax.taxAmount,
            })) || [],
            
            paymentTerms: paymentTerms,
            
            summary: {
              totalQuantity: totalQuantity,
              subtotal: subtotal,
              taxTotal: taxTotal,
              grandTotal: data.grandTotal || 0,
            },
            
            costCenter: data.costCenter,
            project: data.project,
            taxCategory: data.taxCategory,
            incoterm: data.incoterm,
            placeOfSupply: data.placeOfSupply,
            termsAndConditions: data.terms?.terms?.selling ? 
              `General: ${data.terms.terms.selling.general}\n` +
              `Delivery: ${data.terms.terms.selling.delivery}\n` +
              `Cancellation: ${data.terms.terms.selling.cancellation}\n` +
              `Warranty: ${data.terms.terms.selling.warranty}\n` +
              `Liability: ${data.terms.terms.selling.liability}\n` +
              `Payment Notes: ${data.terms.terms.selling.payment?.notes || ''}`
              : undefined,
            remarks: data.metadata?.remarks,
            metadata: data.metadata,
          };
          
          setPO(mappedData);
        } else {
          throw new Error(response.message || "Failed to load purchase order");
        }
      } catch (error: any) {
        console.error("Failed to load Purchase Order", error);
        const errorMessage = error?.response?.data?.message || error?.message || "Failed to load Purchase Order details";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    if (poId) {
      fetchPO();
    }
  }, [poId]);

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "ZMW": return "K";
      case "USD": return "$";
      case "EUR": return "€";
      case "GBP": return "£";
      case "INR": return "₹";
      default: return currency;
    }
  };

  const getStatusConfig = (status: PurchaseOrderData["status"]) => {
    switch (status) {
      case "Approved":
        return { color: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle2 };
      case "Submitted":
        return { color: "text-blue-600 bg-blue-50 border-blue-200", icon: Eye };
      case "Completed":
        return { color: "text-emerald-600 bg-emerald-50 border-emerald-200", icon: CheckCircle2 };
      case "Partially Received":
        return { color: "text-amber-600 bg-amber-50 border-amber-200", icon: Clock };
      case "Draft":
        return { color: "text-gray-600 bg-gray-50 border-gray-200", icon: FileText };
      case "Cancelled":
        return { color: "text-red-600 bg-red-50 border-red-200", icon: X };
      default:
        return { color: "text-gray-600 bg-gray-50 border-gray-200", icon: FileText };
    }
  };

  const formatCurrency = (amount: number) => {
    if (!po) return "";
    return `${getCurrencySymbol(po.currency)} ${amount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF download
    console.log("Download PDF");
    toast.success("PDF download feature coming soon!");
  };

  const handleSendEmail = () => {
    // TODO: Implement email functionality
    console.log("Send Email");
    toast.success("Email feature coming soon!");
  };

  // Loading State
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-2xl p-8 shadow-2xl"
        >
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <div className="text-center">
              <p className="text-lg font-semibold text-primary">Loading Purchase Order</p>
              <p className="text-sm text-muted mt-1">Please wait...</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Error State
  if (error || !po) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-2xl p-8 shadow-2xl max-w-md w-full"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Failed to Load</h3>
            <p className="text-muted mb-6">{error || "Purchase Order not found"}</p>
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(po.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full max-w-7xl bg-card rounded-2xl shadow-2xl my-8"
      >
        {/* Header */}
        <div className="sticky top-0 z-20 bg-gradient-to-br from-primary/5 via-card to-card border-b border-border/50 backdrop-blur-xl rounded-t-2xl">
          <div className="p-6 pb-4">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, x: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 hover:bg-muted/50 rounded-xl transition-colors"
                  title="Close"
                >
                  <ArrowLeft className="w-5 h-5 text-muted" />
                </motion.button>
                
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-primary tracking-tight">
                      {po.poNumber}
                    </h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${statusConfig.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {po.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted">Purchase Order Details</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onEdit}
                  className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-medium text-sm transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </motion.button>

                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowActions(!showActions)}
                    className="p-2 hover:bg-muted/50 rounded-xl transition-colors"
                    title="More actions"
                  >
                    <MoreVertical className="w-5 h-5 text-muted" />
                  </motion.button>

                  <AnimatePresence>
                    {showActions && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowActions(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute right-0 mt-2 w-52 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-20"
                        >
                          {[
                            { icon: Download, label: "Download PDF", action: handleDownloadPDF },
                            { icon: Printer, label: "Print", action: handlePrint },
                            { icon: Mail, label: "Send Email", action: handleSendEmail },
                            { icon: Share2, label: "Share", action: () => toast.success("Share feature coming soon!") },
                          ].map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                item.action();
                                setShowActions(false);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-muted/30 transition-colors flex items-center gap-3 text-sm"
                            >
                              <item.icon className="w-4 h-4 text-muted" />
                              <span>{item.label}</span>
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { icon: Calendar, label: "PO Date", value: formatDate(po.poDate) },
                { icon: Calendar, label: "Required By", value: formatDate(po.requiredBy) },
                { icon: Package, label: "Total Items", value: po.summary.totalQuantity.toString() },
                { icon: DollarSign, label: "Total Amount", value: formatCurrency(po.summary.grandTotal) },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <item.icon className="w-3.5 h-3.5 text-muted" />
                    <span className="text-xs text-muted font-medium">{item.label}</span>
                  </div>
                  <p className="text-sm font-semibold text-primary truncate">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
          {/* Parties Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Supplier */}
            <div className="bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20 border border-blue-200/50 dark:border-blue-800/30 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-primary">Supplier</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-lg font-bold text-primary">{po.supplier.name}</p>
                  <p className="text-xs text-muted">{po.supplier.address.addressTitle}</p>
                </div>
                
                <div className="pt-2 border-t border-border/50 space-y-1 text-sm">
                  <p className="text-muted">{po.supplier.address.addressLine1}</p>
                  {po.supplier.address.addressLine2 && (
                    <p className="text-muted">{po.supplier.address.addressLine2}</p>
                  )}
                  <p className="text-muted">
                    {po.supplier.address.city}, {po.supplier.address.state} {po.supplier.address.postalCode}
                  </p>
                  <p className="text-muted">{po.supplier.address.country}</p>
                  
                  {po.supplier.address.phone && (
                    <p className="text-muted pt-2 flex items-center gap-1">
                      <span className="opacity-50">📞</span> {po.supplier.address.phone}
                    </p>
                  )}
                  {po.supplier.address.email && (
                    <p className="text-muted flex items-center gap-1">
                      <span className="opacity-50">✉️</span> {po.supplier.address.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Dispatch Address */}
            {po.dispatchAddress && (
              <div className="bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/20 border border-purple-200/50 dark:border-purple-800/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                    <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-primary">Dispatch From</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-lg font-bold text-primary">{po.dispatchAddress.addressTitle}</p>
                    <p className="text-xs text-muted">{po.dispatchAddress.addressType}</p>
                  </div>
                  
                  <div className="pt-2 border-t border-border/50 space-y-1 text-sm">
                    <p className="text-muted">{po.dispatchAddress.addressLine1}</p>
                    {po.dispatchAddress.addressLine2 && (
                      <p className="text-muted">{po.dispatchAddress.addressLine2}</p>
                    )}
                    <p className="text-muted">
                      {po.dispatchAddress.city}, {po.dispatchAddress.state} {po.dispatchAddress.postalCode}
                    </p>
                    <p className="text-muted">{po.dispatchAddress.country}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Address */}
            <div className="bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                  <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-semibold text-primary">Ship To</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-lg font-bold text-primary">{po.shippingAddress.addressTitle}</p>
                  <p className="text-xs text-muted">{po.shippingAddress.addressType}</p>
                </div>
                
                <div className="pt-2 border-t border-border/50 space-y-1 text-sm">
                  <p className="text-muted">{po.shippingAddress.addressLine1}</p>
                  {po.shippingAddress.addressLine2 && (
                    <p className="text-muted">{po.shippingAddress.addressLine2}</p>
                  )}
                  <p className="text-muted">
                    {po.shippingAddress.city}, {po.shippingAddress.state} {po.shippingAddress.postalCode}
                  </p>
                  <p className="text-muted">{po.shippingAddress.country}</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Additional Info */}
          {(po.costCenter || po.project || po.taxCategory || po.incoterm || po.placeOfSupply) && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card border border-border rounded-xl p-5"
            >
              <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Additional Information
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {po.project && (
                  <div>
                    <p className="text-xs text-muted mb-1">Project</p>
                    <p className="text-sm font-medium text-primary">{po.project}</p>
                  </div>
                )}
                {po.costCenter && (
                  <div>
                    <p className="text-xs text-muted mb-1">Cost Center</p>
                    <p className="text-sm font-medium text-primary">{po.costCenter}</p>
                  </div>
                )}
                {po.taxCategory && (
                  <div>
                    <p className="text-xs text-muted mb-1">Tax Category</p>
                    <p className="text-sm font-medium text-primary">{po.taxCategory}</p>
                  </div>
                )}
                {po.incoterm && (
                  <div>
                    <p className="text-xs text-muted mb-1">Incoterm</p>
                    <p className="text-sm font-medium text-primary">{po.incoterm}</p>
                  </div>
                )}
                {po.placeOfSupply && (
                  <div>
                    <p className="text-xs text-muted mb-1">Place of Supply</p>
                    <p className="text-sm font-medium text-primary">{po.placeOfSupply}</p>
                  </div>
                )}
              </div>
            </motion.section>
          )}

          {/* Items Table */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-primary/5 to-transparent px-5 py-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-primary">Order Items</h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/30 text-xs uppercase tracking-wide">
                    <th className="text-left px-5 py-3 font-semibold text-muted">#</th>
                    <th className="text-left px-5 py-3 font-semibold text-muted">Item Code</th>
                    <th className="text-left px-5 py-3 font-semibold text-muted">Description</th>
                    <th className="text-right px-5 py-3 font-semibold text-muted">Qty</th>
                    <th className="text-center px-5 py-3 font-semibold text-muted">UOM</th>
                    <th className="text-right px-5 py-3 font-semibold text-muted">Rate</th>
                    <th className="text-right px-5 py-3 font-semibold text-muted">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {po.items.map((item, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-5 py-4 text-sm text-muted">{idx + 1}</td>
                      <td className="px-5 py-4 text-sm font-mono text-primary">{item.itemCode}</td>
                      <td className="px-5 py-4 text-sm font-medium text-primary">{item.itemName}</td>
                      <td className="px-5 py-4 text-sm text-right font-semibold">{item.quantity}</td>
                      <td className="px-5 py-4 text-sm text-center text-muted">{item.uom}</td>
                      <td className="px-5 py-4 text-sm text-right font-mono">{formatCurrency(item.rate)}</td>
                      <td className="px-5 py-4 text-sm text-right font-bold text-primary">{formatCurrency(item.amount)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>

          {/* Summary Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Taxes */}
            {po.taxes && po.taxes.length > 0 && (
              <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-amber-50/50 to-transparent dark:from-amber-950/20 px-5 py-3 border-b border-border/50">
                  <h3 className="font-semibold text-primary text-sm">Tax Details</h3>
                </div>
                <div className="p-5 space-y-3">
                  {po.taxes.map((tax, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                      <div>
                        <p className="font-medium text-sm text-primary">{tax.accountHead}</p>
                        <p className="text-xs text-muted">
                          {tax.taxRate}% on {formatCurrency(tax.taxableAmount)}
                        </p>
                      </div>
                      <p className="font-bold text-primary">{formatCurrency(tax.taxAmount)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Totals */}
            <div className="bg-gradient-to-br from-primary/5 via-card to-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-primary text-sm mb-4">Summary</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-mono">{formatCurrency(po.summary.subtotal)}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Tax Total</span>
                  <span className="font-mono">{formatCurrency(po.summary.taxTotal)}</span>
                </div>
                
                <div className="pt-3 border-t-2 border-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">Grand Total</span>
                    <span className="text-xl font-bold text-primary">{formatCurrency(po.summary.grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Payment Terms */}
          {po.paymentTerms && po.paymentTerms.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-indigo-50/50 to-transparent dark:from-indigo-950/20 px-5 py-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-semibold text-primary text-sm">Payment Terms</h3>
                </div>
              </div>
              
              <div className="p-5">
                <div className="space-y-4">
                  {po.paymentTerms.map((term, idx) => (
                    <div key={idx} className="flex items-start justify-between p-4 bg-muted/20 rounded-lg border border-border/30">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded">
                            {term.invoicePortion}%
                          </span>
                          <p className="font-medium text-sm text-primary">{term.paymentTerm}</p>
                        </div>
                        <p className="text-xs text-muted">{term.description}</p>
                      </div>
                      <p className="font-bold text-primary ml-4">{formatCurrency(term.paymentAmount)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {/* Terms and Remarks */}
          {(po.termsAndConditions || po.remarks) && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {po.termsAndConditions && (
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-semibold text-primary text-sm mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Terms & Conditions
                  </h3>
                  <div className="text-sm text-muted leading-relaxed whitespace-pre-line">
                    {po.termsAndConditions}
                  </div>
                </div>
              )}
              
              {po.remarks && (
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-semibold text-primary text-sm mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Remarks
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{po.remarks}</p>
                </div>
              )}
            </motion.section>
          )}

          {/* Metadata */}
          {po.metadata && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-muted/20 border border-border rounded-xl p-5"
            >
              <h3 className="font-semibold text-primary text-sm mb-3">Document Information</h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                {po.metadata.createdBy && (
                  <div>
                    <p className="text-xs text-muted mb-1">Created By</p>
                    <p className="text-primary font-medium">{po.metadata.createdBy}</p>
                  </div>
                )}
                {po.metadata.createdAt && (
                  <div>
                    <p className="text-xs text-muted mb-1">Created At</p>
                    <p className="text-primary font-medium">
                      {new Date(po.metadata.createdAt).toLocaleString('en-GB')}
                    </p>
                  </div>
                )}
                {po.metadata.updatedAt && (
                  <div>
                    <p className="text-xs text-muted mb-1">Last Updated</p>
                    <p className="text-primary font-medium">
                      {new Date(po.metadata.updatedAt).toLocaleString('en-GB')}
                    </p>
                  </div>
                )}
              </div>
            </motion.section>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-t from-card via-card to-transparent border-t border-border/50 px-6 py-4 rounded-b-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted">
              Viewed on {new Date().toLocaleDateString('en-GB', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
              })} at {new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-4 py-2 bg-muted/50 hover:bg-muted text-primary rounded-xl font-medium text-sm transition-colors"
              >
                Close
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PurchaseOrderView;