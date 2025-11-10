import React, { useState } from 'react';
import {
  FaUpload,
  FaTimes,
  FaCheckCircle,
  FaImage,
  FaFileSignature,
  FaEye,
  FaDownload,
  FaTrash,
  FaClock,
} from 'react-icons/fa';

type UploadedFile = {
  id: string;
  file: File;
  preview: string;
  uploadedAt: Date;
  size: string;
};

type UploadProgress = {
  type: 'logo' | 'signature';
  progress: number;
  isUploading: boolean;
};

const theme = {
  bg: "bg-white",
  border: "border border-slate-200",
  shadow: "shadow-sm",
  rounded: "rounded-xl",
  textBase: "text-base font-semibold text-slate-900",
  textSub: "text-xs text-slate-500",
  button: "px-4 py-2 rounded-lg font-medium text-sm transition-all",
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const Upload: React.FC = () => {
  const [logo, setLogo] = useState<UploadedFile | null>(null);
  const [signature, setSignature] = useState<UploadedFile | null>(null);
  const [dragActive, setDragActive] = useState<'logo' | 'signature' | null>(null);
  const [previewModal, setPreviewModal] = useState<{ type: 'logo' | 'signature'; url: string } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);

  const simulateUpload = (file: File, type: 'logo' | 'signature'): Promise<string> => {
    return new Promise((resolve) => {
      setUploadProgress({ type, progress: 0, isUploading: true });
      
      const reader = new FileReader();
      
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress({ type, progress, isUploading: true });
        }
      };
      
      reader.onloadend = () => {
        setTimeout(() => {
          setUploadProgress({ type, progress: 100, isUploading: false });
          setTimeout(() => {
            setUploadProgress(null);
            resolve(reader.result as string);
          }, 500);
        }, 300);
      };
      
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'signature'
  ) => {
    const file = e.target.files?.[0];
    if (file) processFile(file, type);
  };

  const processFile = async (file: File, type: 'logo' | 'signature') => {
    if (!file.type.startsWith('image/')) return alert('Only image files allowed.');
    if (file.size > 5 * 1024 * 1024) return alert('Maximum size is 5MB.');
    
    const preview = await simulateUpload(file, type);
    
    const uploadedFile: UploadedFile = {
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview,
      uploadedAt: new Date(),
      size: formatFileSize(file.size)
    };
    
    if (type === 'logo') {
      setLogo(uploadedFile);
    } else {
      setSignature(uploadedFile);
    }
  };

  const handleDrag = (e: React.DragEvent, type: 'logo' | 'signature') => {
    e.preventDefault();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover' ? type : null);
  };

  const handleDrop = (e: React.DragEvent, type: 'logo' | 'signature') => {
    e.preventDefault();
    setDragActive(null);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file, type);
  };

  const removeFile = (type: 'logo' | 'signature') => type === 'logo' ? setLogo(null) : setSignature(null);

  const downloadFile = (uploadedFile: UploadedFile) => {
    const link = document.createElement('a');
    link.href = uploadedFile.preview;
    link.download = uploadedFile.file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openPreview = (type: 'logo' | 'signature', url: string) => setPreviewModal({ type, url });

  const handleSave = () => {
    console.log('Saving files:', { logo, signature });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const UploadCard = ({
    type, title, icon: Icon, uploadedFile
  }: {
    type: 'logo' | 'signature';
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    uploadedFile: UploadedFile | null;
  }) => {
    const isUploading = uploadProgress?.type === type && uploadProgress.isUploading;
    const progress = uploadProgress?.type === type ? uploadProgress.progress : 0;
    const bgColor = type === 'logo' ? 'bg-teal-100' : 'bg-blue-100';
    const iconColor = type === 'logo' ? 'text-teal-600' : 'text-blue-600';
    const hoverBg = type === 'logo' ? 'hover:bg-teal-700' : 'hover:bg-blue-700';
    const bgPrimary = type === 'logo' ? 'bg-teal-600' : 'bg-blue-600';

    return (
      <div className={`${theme.bg} ${theme.shadow} ${theme.rounded} ${theme.border} p-6`}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div>
            <h2 className={`${theme.textBase} mb-1`}>{title}</h2>
            <p className={theme.textSub}>Upload your {type === 'logo' ? 'company logo' : 'authorized signature'}</p>
          </div>
        </div>

        {/* Upload States */}
        <div>
          {isUploading ? (
            <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200">
              <div className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full ${bgColor} flex items-center justify-center mb-4`}>
                  <FaUpload className={`w-7 h-7 ${iconColor} animate-pulse`} />
                </div>
                <p className="text-sm font-semibold text-slate-800 mb-3">Uploading...</p>
                
                {/* Progress Bar */}
                <div className="w-full space-y-2 mb-3">
                  <div className="bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`${bgPrimary} h-2.5 rounded-full transition-all duration-300`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs font-semibold text-slate-600 text-center">{progress}% Complete</p>
                </div>
              </div>
            </div>
          ) : !uploadedFile ? (
            
            <div
              onDragEnter={(e) => handleDrag(e, type)}
              onDragLeave={(e) => handleDrag(e, type)}
              onDragOver={(e) => handleDrag(e, type)}
              onDrop={(e) => handleDrop(e, type)}
              className={`relative border-2 border-dashed ${theme.rounded} p-8 transition-all ${
                dragActive === type 
                  ? 'border-teal-500 bg-teal-50 scale-105' 
                  : 'border-slate-300 bg-slate-50 hover:border-slate-400'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e, type)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id={`${type}-upload`}
              />
              <div className="flex flex-col items-center text-center">
                <div className={`w-14 h-14 rounded-full ${bgColor} flex items-center justify-center mb-4`}>
                  <FaUpload className={`w-6 h-6 ${iconColor}`} />
                </div>
                <p className="text-sm font-semibold text-slate-800 mb-1">
                  {dragActive === type ? 'Drop file here' : 'Drag & drop your file'}
                </p>
                <p className="text-xs text-slate-500 mb-4">or</p>
                
                <label
                  htmlFor={`${type}-upload`}
                  className={`${theme.button} ${bgPrimary} ${hoverBg} text-white flex items-center gap-2 cursor-pointer mb-4`}
                >
                  <FaUpload className="w-4 h-4" /> Browse Files
                </label>
                
                <div className="pt-4 border-t border-slate-200 w-full">
                  <p className="text-xs text-slate-600 font-medium">Supported: PNG, JPG, SVG • Max 5MB</p>
                </div>
              </div>
            </div>
          ) : (
            // Uploaded State
            <div className="space-y-4">
              
              <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                <div className="flex gap-5 mb-4">
              
                  <div className="relative group flex-shrink-0">
                    <div className="w-28 h-28 bg-white rounded-lg border border-slate-300 overflow-hidden flex items-center justify-center shadow-sm">
                      <img src={uploadedFile.preview} alt={type} className="max-w-full max-h-full object-contain" />
                    </div>
                    
                    <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => openPreview(type, uploadedFile.preview)}
                        className="bg-white text-slate-800 p-2 rounded-lg hover:bg-slate-100 transition"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                
                  <div className="flex-1">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-500 font-semibold mb-1">File Name</p>
                        <p className="text-sm font-semibold text-slate-800 truncate" title={uploadedFile.file.name}>
                          {uploadedFile.file.name}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-slate-500 font-semibold mb-1">Size</p>
                          <p className="text-sm font-semibold text-slate-700">{uploadedFile.size}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-semibold mb-1">Format</p>
                          <p className="text-sm font-semibold text-slate-700 uppercase">
                            {uploadedFile.file.type.split('/')[1]}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 font-semibold mb-1">Uploaded</p>
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                          <FaClock className="w-3.5 h-3.5 text-slate-500" />
                          {formatDate(uploadedFile.uploadedAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => openPreview(type, uploadedFile.preview)}
                    className="flex-1 bg-white border border-slate-300 text-slate-700 px-3 py-2 rounded-lg text-xs font-medium hover:bg-slate-100 transition flex items-center justify-center gap-1.5"
                  >
                    <FaEye className="w-3.5 h-3.5" /> Preview
                  </button>
                  <button
                    onClick={() => downloadFile(uploadedFile)}
                    className="flex-1 bg-white border border-slate-300 text-slate-700 px-3 py-2 rounded-lg text-xs font-medium hover:bg-slate-100 transition flex items-center justify-center gap-1.5"
                  >
                    <FaDownload className="w-3.5 h-3.5" /> Download
                  </button>
                  <button
                    onClick={() => removeFile(type)}
                    className="flex-1 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs font-medium hover:bg-red-100 transition flex items-center justify-center gap-1.5"
                  >
                    <FaTrash className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>

              
              <div className="text-center">
                <label
                  htmlFor={`${type}-replace`}
                  className={`inline-flex items-center gap-1.5 ${type === 'logo' ? 'text-teal-600 hover:text-teal-700' : 'text-blue-600 hover:text-blue-700'} font-medium cursor-pointer text-xs`}
                >
                  <FaUpload className="w-3.5 h-3.5" />
                  Upload a different file
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, type)}
                  className="hidden"
                  id={`${type}-replace`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Company Documentation</h1>
          <p className="text-slate-600 text-sm">Upload your official company logo and authorized signature for document generation and verification purposes.</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-in fade-in">
            <FaCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800 font-medium text-sm">
              All documents saved successfully!
            </p>
          </div>
        )}

        {/* Guidelines Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-8">
          <h3 className="text-sm font-semibold text-blue-900 mb-3">Upload Guidelines</h3>
          <ul className="space-y-2">
            <li className="text-xs text-blue-800 flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Upload high-quality images for better clarity on documents</span>
            </li>
            <li className="text-xs text-blue-800 flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Logos should have transparent background (PNG recommended)</span>
            </li>
            <li className="text-xs text-blue-800 flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Authorized signatures must be clear and legible</span>
            </li>
            <li className="text-xs text-blue-800 flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Maximum file size: 5MB • Supported: PNG, JPG, SVG</span>
            </li>
          </ul>
        </div>

        {/* Upload Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <UploadCard
            type="logo"
            title="Company Logo"
            icon={FaImage}
            uploadedFile={logo}
          />
          <UploadCard
            type="signature"
            title="Authorized Signature"
            icon={FaFileSignature}
            uploadedFile={signature}
          />
        </div>

        {/* Upload Summary */}
        {(logo || signature) && (
          <div className={`${theme.bg} ${theme.rounded} ${theme.shadow} ${theme.border} p-6 mb-8`}>
            <h3 className={`${theme.textBase} mb-4`}>Upload Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Logo Summary */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                      <FaImage className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-600">Company Logo</p>
                      <p className="text-sm font-semibold text-slate-900">{logo ? 'Uploaded' : 'Pending'}</p>
                    </div>
                  </div>
                  {logo && <FaCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />}
                </div>
                {logo && (
                  <div className="text-xs text-slate-600 space-y-1 pl-10">
                    <p>Size: {logo.size}</p>
                    <p>Uploaded: {formatDate(logo.uploadedAt)}</p>
                  </div>
                )}
              </div>

              {/* Signature Summary */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FaFileSignature className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-600">Authorized Signature</p>
                      <p className="text-sm font-semibold text-slate-900">{signature ? 'Uploaded' : 'Pending'}</p>
                    </div>
                  </div>
                  {signature && <FaCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />}
                </div>
                {signature && (
                  <div className="text-xs text-slate-600 space-y-1 pl-10">
                    <p>Size: {signature.size}</p>
                    <p>Uploaded: {formatDate(signature.uploadedAt)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-600">Overall Completion</p>
                <p className="text-xs font-bold text-teal-600">
                  {((logo ? 50 : 0) + (signature ? 50 : 0))}%
                </p>
              </div>
              <div className="bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-600 to-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${(logo ? 50 : 0) + (signature ? 50 : 0)}%`
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => {
              setLogo(null);
              setSignature(null);
            }}
            className="px-6 py-2.5 border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition"
          >
            Reset All
          </button>
          <button
            onClick={handleSave}
            disabled={!logo && !signature}
            className={`px-8 py-2.5 text-white text-sm font-semibold rounded-lg transition-all ${
              logo || signature
                ? 'bg-teal-600 hover:bg-teal-700 cursor-pointer shadow-md hover:shadow-lg'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            Save Documents
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {previewModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50 backdrop-blur-sm"
          onClick={() => setPreviewModal(null)}
        >
          <div
            className={`${theme.bg} ${theme.rounded} max-w-2xl w-full shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className={theme.textBase}>
                {previewModal.type === 'logo' ? 'Company Logo' : 'Authorized Signature'} Preview
              </h3>
              <button
                onClick={() => setPreviewModal(null)}
                className="text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="bg-slate-50 flex items-center justify-center p-8 min-h-96">
              <img
                src={previewModal.url}
                alt="Preview"
                className="max-w-full max-h-96 object-contain rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
