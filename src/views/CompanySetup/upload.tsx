import React, { useState } from "react";
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
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";

type UploadedFile = {
  id: string;
  file: File;
  preview: string;
  uploadedAt: Date;
  size: string;
};

type UploadProgress = {
  type: "logo" | "signature";
  progress: number;
  isUploading: boolean;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Upload: React.FC = () => {
  const [logo, setLogo] = useState<UploadedFile | null>(null);
  const [signature, setSignature] = useState<UploadedFile | null>(null);
  const [dragActive, setDragActive] = useState<"logo" | "signature" | null>(
    null,
  );
  const [previewModal, setPreviewModal] = useState<{
    type: "logo" | "signature";
    url: string;
  } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(
    null,
  );
  const [selectedType, setSelectedType] = useState<"logo" | "signature">(
    "logo",
  );

  const simulateUpload = (
    file: File,
    type: "logo" | "signature",
  ): Promise<string> => {
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
    type: "logo" | "signature",
  ) => {
    const file = e.target.files?.[0];
    if (file) processFile(file, type);
  };

  const processFile = async (file: File, type: "logo" | "signature") => {
    if (!file.type.startsWith("image/"))
      return alert("Only image files allowed.");
    if (file.size > 5 * 1024 * 1024) return alert("Maximum size is 5MB.");

    const preview = await simulateUpload(file, type);

    const uploadedFile: UploadedFile = {
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview,
      uploadedAt: new Date(),
      size: formatFileSize(file.size),
    };

    if (type === "logo") {
      setLogo(uploadedFile);
    } else {
      setSignature(uploadedFile);
    }
  };

  const handleDrag = (e: React.DragEvent, type: "logo" | "signature") => {
    e.preventDefault();
    setDragActive(
      e.type === "dragenter" || e.type === "dragover" ? type : null,
    );
  };

  const handleDrop = (e: React.DragEvent, type: "logo" | "signature") => {
    e.preventDefault();
    setDragActive(null);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file, type);
  };

  const removeFile = (type: "logo" | "signature") =>
    type === "logo" ? setLogo(null) : setSignature(null);

  const downloadFile = (uploadedFile: UploadedFile) => {
    const link = document.createElement("a");
    link.href = uploadedFile.preview;
    link.download = uploadedFile.file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openPreview = (type: "logo" | "signature", url: string) =>
    setPreviewModal({ type, url });

  const handleSave = () => {
    console.log("Saving files:", { logo, signature });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const currentFile = selectedType === "logo" ? logo : signature;
  const isUploading =
    uploadProgress?.type === selectedType && uploadProgress.isUploading;
  const progress =
    uploadProgress?.type === selectedType ? uploadProgress.progress : 0;

  return (
    <div className="">
      <div className="max-w-full">
        {/* Success Alert */}
        {showSuccess && (
          <div className="mb-6 rounded-lg p-4 flex items-center gap-3 shadow-sm badge-success">
            <FaCheckCircle className="w-5 h-5 text-success flex-shrink-0" />
            <p className="text-success font-medium text-sm">
              Documents saved successfully!
            </p>
          </div>
        )}

        {/* Main Grid Layout */}
        <div className="grid grid-cols-5 gap-6">
          {/* Left Sidebar - Document Types */}
          <div className="col-span-2 bg-card rounded-lg shadow-sm border border-theme overflow-hidden">
            <div className="px-4 py-2 bg-primary-600 text-table-head-text">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <FaUpload className="w-5 h-5" />
                Upload Documents
              </h2>
            </div>

            <div className="p-4 space-y-2">
              {/* Upload Type Cards */}
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedType("logo")}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedType === "logo"
                      ? "border-blue-500 bg-blue-50"
                      : "border-theme hover:row-hover bg-card"
                  }`}
                  /* keep classes for layout; override colors via style where needed below */
                  style={{
                    // make selected card use full theme tint if selected
                    background:
                      selectedType === "logo"
                        ? "var(--primary-600)"
                        : undefined,
                    color:
                      selectedType === "logo"
                        ? "var(--table-head-text)"
                        : undefined,
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          background:
                            selectedType === "logo"
                              ? "rgba(255,255,255,0.12)"
                              : "var(--primary-100)",
                        }}
                      >
                        <FaImage
                          className="w-5 h-5"
                          style={{
                            color:
                              selectedType === "logo"
                                ? "white"
                                : "var(--primary-700)",
                          }}
                        />
                      </div>
                      <div>
                        <p
                          className="font-semibold"
                          style={{
                            color:
                              selectedType === "logo" ? "white" : undefined,
                          }}
                        >
                          Company Logo
                        </p>
                        <p
                          className="text-xs"
                          style={{
                            color:
                              selectedType === "logo"
                                ? "rgba(255,255,255,0.85)"
                                : undefined,
                          }}
                        >
                          PNG, JPG, SVG
                        </p>
                      </div>
                    </div>
                    {logo && (
                      <span className="text-xs badge-success px-2 py-1 rounded-full font-medium flex items-center gap-1">
                        <FaCheck className="w-3 h-3" /> Uploaded
                      </span>
                    )}
                  </div>
                  {logo && (
                    <div className="mt-3 pt-3 border-t border-theme">
                      <p
                        className="text-xs"
                        style={{
                          color:
                            selectedType === "logo"
                              ? "rgba(255,255,255,0.95)"
                              : undefined,
                        }}
                      >
                        {logo.file.name}
                      </p>
                      <p
                        className="text-xs"
                        style={{
                          color:
                            selectedType === "logo"
                              ? "rgba(255,255,255,0.85)"
                              : undefined,
                        }}
                      >
                        {logo.size}
                      </p>
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setSelectedType("signature")}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedType === "signature"
                      ? "border-blue-500 bg-blue-50"
                      : "border-theme hover:row-hover bg-card"
                  }`}
                  style={{
                    background:
                      selectedType === "signature"
                        ? "var(--primary-600)"
                        : undefined,
                    color:
                      selectedType === "signature"
                        ? "var(--table-head-text)"
                        : undefined,
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          background:
                            selectedType === "signature"
                              ? "rgba(255,255,255,0.12)"
                              : "var(--primary-100)",
                        }}
                      >
                        <FaFileSignature
                          className="w-5 h-5"
                          style={{
                            color:
                              selectedType === "signature"
                                ? "white"
                                : "var(--primary-700)",
                          }}
                        />
                      </div>
                      <div>
                        <p
                          className="font-semibold"
                          style={{
                            color:
                              selectedType === "signature"
                                ? "white"
                                : undefined,
                          }}
                        >
                          Authorized Signature
                        </p>
                        <p
                          className="text-xs"
                          style={{
                            color:
                              selectedType === "signature"
                                ? "rgba(255,255,255,0.85)"
                                : undefined,
                          }}
                        >
                          PNG, JPG, SVG
                        </p>
                      </div>
                    </div>
                    {signature && (
                      <span className="text-xs badge-success px-2 py-1 rounded-full font-medium flex items-center gap-1">
                        <FaCheck className="w-3 h-3" /> Uploaded
                      </span>
                    )}
                  </div>
                  {signature && (
                    <div className="mt-3 pt-3 border-t border-theme">
                      <p
                        className="text-xs"
                        style={{
                          color:
                            selectedType === "signature"
                              ? "rgba(255,255,255,0.95)"
                              : undefined,
                        }}
                      >
                        {signature.file.name}
                      </p>
                      <p
                        className="text-xs"
                        style={{
                          color:
                            selectedType === "signature"
                              ? "rgba(255,255,255,0.85)"
                              : undefined,
                        }}
                      >
                        {signature.size}
                      </p>
                    </div>
                  )}
                </button>
              </div>

              {/* Upload Guidelines */}
              <div className="mt-6 pt-4 border-t border-theme">
                <h3
                  className="text-sm font-semibold mb-3 flex items-center gap-2"
                  style={{ color: "var(--text)" }}
                >
                  <FaExclamationTriangle
                    className="w-4 h-4"
                    style={{ color: "var(--danger)" }}
                  />
                  Guidelines
                </h3>
                <ul className="space-y-2">
                  <li className="text-xs flex items-start gap-2">
                    <span
                      style={{
                        color: "var(--primary-700)",
                        fontWeight: 700,
                        marginTop: 2,
                      }}
                    >
                      •
                    </span>
                    <span>Maximum file size: 5MB</span>
                  </li>
                  <li className="text-xs flex items-start gap-2">
                    <span
                      style={{
                        color: "var(--primary-700)",
                        fontWeight: 700,
                        marginTop: 2,
                      }}
                    >
                      •
                    </span>
                    <span>Supported formats: PNG, JPG, SVG</span>
                  </li>
                  <li className="text-xs flex items-start gap-2">
                    <span
                      style={{
                        color: "var(--primary-700)",
                        fontWeight: 700,
                        marginTop: 2,
                      }}
                    >
                      •
                    </span>
                    <span>Use transparent background for logos</span>
                  </li>
                  <li className="text-xs flex items-start gap-2">
                    <span
                      style={{
                        color: "var(--primary-700)",
                        fontWeight: 700,
                        marginTop: 2,
                      }}
                    >
                      •
                    </span>
                    <span>Ensure signatures are clear and legible</span>
                  </li>
                </ul>
              </div>

              {/* Progress Summary */}
              {(logo || signature) && (
                <div className="mt-6 pt-4 border-t border-theme">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold uppercase tracking-wide">
                      Overall Progress
                    </p>
                    <p
                      className="text-sm font-bold"
                      style={{ color: "var(--primary-700)" }}
                    >
                      {(logo ? 50 : 0) + (signature ? 50 : 0)}%
                    </p>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(logo ? 50 : 0) + (signature ? 50 : 0)}%`,
                        background: "var(--primary)",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Upload Area & Details */}
          <div className="col-span-3 bg-card rounded-lg shadow-sm border border-theme overflow-hidden">
            <div
              className="px-4 py-2 flex justify-between items-center"
              style={{ background: "var(--primary-600)" }}
            >
              <h2 className="text-lg font-semibold text-white">
                {selectedType === "logo"
                  ? "Company Logo"
                  : "Authorized Signature"}
              </h2>
              {currentFile && (
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      openPreview(selectedType, currentFile.preview)
                    }
                    className="px-3 py-1.5 rounded-md transition-all text-sm font-medium flex items-center gap-1.5 btn-ghost text-table-head-text"
                  >
                    <FaEye className="w-3.5 h-3.5" />
                    Preview
                  </button>
                  <button
                    onClick={() => removeFile(selectedType)}
                    className="px-3 py-1.5 rounded-md transition-all text-sm font-medium flex items-center gap-1.5"
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      color: "white",
                    }}
                  >
                    <FaTrash className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="p-6">
              {isUploading ? (
                // Uploading State
                <div className="p-12 text-center">
                  <div
                    className="inline-block p-6 rounded-full mb-4"
                    style={{ background: "var(--primary-100)" }}
                  >
                    <FaUpload
                      className="w-12 h-12 animate-pulse"
                      style={{ color: "var(--primary-700)" }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-muted mb-2">
                    Uploading...
                  </h3>
                  <p className="text-muted mb-4">
                    Please wait while we process your file
                  </p>

                  <div className="max-w-md mx-auto space-y-2">
                    <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${progress}%`,
                          background: "var(--primary)",
                        }}
                      />
                    </div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "var(--primary-700)" }}
                    >
                      {progress}% Complete
                    </p>
                  </div>
                </div>
              ) : !currentFile ? (
                // Upload Zone
                <div
                  onDragEnter={(e) => handleDrag(e, selectedType)}
                  onDragLeave={(e) => handleDrag(e, selectedType)}
                  onDragOver={(e) => handleDrag(e, selectedType)}
                  onDrop={(e) => handleDrop(e, selectedType)}
                  className={`relative border-2 border-dashed rounded-lg p-12 transition-all`}
                  style={{
                    borderColor:
                      dragActive === selectedType
                        ? "var(--primary-700)"
                        : undefined,
                    background:
                      dragActive === selectedType
                        ? "var(--row-hover)"
                        : undefined,
                    transform:
                      dragActive === selectedType ? "scale(1.02)" : undefined,
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e, selectedType)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id={`${selectedType}-upload`}
                  />
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center mb-4`}
                      style={{
                        background:
                          selectedType === "logo"
                            ? "var(--primary-100)"
                            : "var(--primary-100)",
                      }}
                    >
                      <FaUpload
                        className={`w-10 h-10`}
                        style={{ color: "var(--primary-700)" }}
                      />
                    </div>
                    <p className="text-lg font-semibold text-main mb-2">
                      {dragActive === selectedType
                        ? "Drop your file here"
                        : "Drag & drop your file"}
                    </p>
                    <p className="text-sm text-muted mb-6">or</p>

                    <label
                      htmlFor={`${selectedType}-upload`}
                      className="px-6 py-3 rounded-md font-medium text-sm flex items-center gap-2 cursor-pointer transition-all shadow-sm bg-primary text-white"
                    >
                      <FaUpload className="w-4 h-4" /> Browse Files
                    </label>

                    <div className="mt-8 pt-6 border-t border-theme w-full">
                      <p className="text-xs text-muted">
                        Supported formats: PNG, JPG, SVG • Maximum size: 5MB
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // File Details View
                <div className="space-y-6">
                  {/* Preview Image */}
                  <div className="flex justify-center">
                    <div className="relative group">
                      <div className="w-64 h-64 bg-card border-2 border-theme rounded-lg overflow-hidden flex items-center justify-center shadow-sm">
                        <img
                          src={currentFile.preview}
                          alt={selectedType}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          onClick={() =>
                            openPreview(selectedType, currentFile.preview)
                          }
                          className="bg-card text-main p-3 rounded-lg hover:bg-gray-100 transition"
                        >
                          <FaEye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => downloadFile(currentFile)}
                          className="bg-card text-main p-3 rounded-lg hover:bg-gray-100 transition"
                        >
                          <FaDownload className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* File Information Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-xs font-semibold mb-2 uppercase tracking-wide"
                        style={{ color: "var(--text)" }}
                      >
                        File Name
                      </label>
                      <div className="bg-card border border-theme rounded-lg px-4 py-3">
                        <p
                          className="font-medium text-sm truncate"
                          title={currentFile.file.name}
                          style={{ color: "var(--text)" }}
                        >
                          {currentFile.file.name}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-xs font-semibold mb-2 uppercase tracking-wide"
                        style={{ color: "var(--text)" }}
                      >
                        File Size
                      </label>
                      <div className="bg-card border border-theme rounded-lg px-4 py-3 flex items-center justify-between">
                        <p
                          className="font-medium text-sm"
                          style={{ color: "var(--text)" }}
                        >
                          {currentFile.size}
                        </p>
                        <span className="text-success">✓</span>
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-xs font-semibold mb-2 uppercase tracking-wide"
                        style={{ color: "var(--text)" }}
                      >
                        Format
                      </label>
                      <div className="bg-card border border-theme rounded-lg px-4 py-3">
                        <p
                          className="font-medium text-sm uppercase"
                          style={{ color: "var(--text)" }}
                        >
                          {currentFile.file.type.split("/")[1]}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-xs font-semibold mb-2 uppercase tracking-wide"
                        style={{ color: "var(--text)" }}
                      >
                        Uploaded
                      </label>
                      <div className="bg-card border border-theme rounded-lg px-4 py-3">
                        <p
                          className="font-medium text-sm flex items-center gap-2"
                          style={{ color: "var(--text)" }}
                        >
                          <FaClock
                            className="w-3.5 h-3.5"
                            style={{ color: "var(--muted)" }}
                          />
                          {formatDate(currentFile.uploadedAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Replace File Button */}
                  <div className="pt-4 border-t border-theme text-center">
                    <label
                      htmlFor={`${selectedType}-replace`}
                      className="inline-flex items-center gap-2 font-medium cursor-pointer text-sm"
                      style={{ color: "var(--primary-700)" }}
                    >
                      <FaUpload className="w-4 h-4" />
                      Upload a different file
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e, selectedType)}
                      className="hidden"
                      id={`${selectedType}-replace`}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => {
              setLogo(null);
              setSignature(null);
            }}
            className="px-6 py-2.5 border border-gray-300 text-muted text-sm font-semibold rounded-lg hover:bg-card transition"
          >
            Reset All
          </button>
          <button
            onClick={handleSave}
            disabled={!logo && !signature}
            className={`px-8 py-2.5 text-white text-sm font-semibold rounded-lg transition-all ${
              logo || signature
                ? "cursor-pointer shadow-sm"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            style={
              logo || signature ? { background: "var(--primary)" } : undefined
            }
          >
            Save Documents
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {previewModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50"
          onClick={() => setPreviewModal(null)}
        >
          <div
            className="bg-card rounded-lg max-w-3xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-theme">
              <h3 className="text-lg font-semibold text-main">
                {previewModal.type === "logo"
                  ? "Company Logo"
                  : "Authorized Signature"}{" "}
                Preview
              </h3>
              <button
                onClick={() => setPreviewModal(null)}
                className="text-muted hover:bg-gray-100 p-2 rounded-lg transition"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-card flex items-center justify-center p-12 min-h-96">
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
