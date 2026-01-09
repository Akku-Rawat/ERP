import React, { useState } from "react";
import { X, Upload, FileText } from "lucide-react";

type Props = {
  onClose: () => void;
  onUpload: (payload: {
    description: string;
    file: File;
  }) => Promise<void>;
};

const DocumentUploadModal: React.FC<Props> = ({ onClose, onUpload }) => {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!description || !file) return;
    setLoading(true);
    await onUpload({ description, file });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <h3 className="text-sm font-semibold text-gray-800">
            Upload Document
          </h3>
          <button onClick={onClose}>
            <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Description */}
          <div>
            <label className="text-xs font-medium text-gray-600">
              Document Description
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g. NRC, Offer Letter"
            />
          </div>

          {/* Upload Box */}
          <label className="block">
            <div className="border-2 border-dashed rounded-lg p-5 text-center cursor-pointer hover:border-primary transition">
              <Upload className="w-6 h-6 mx-auto text-primary mb-2" />
              <p className="text-xs text-gray-600">
                Click to upload or drag & drop
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                PDF, JPG, PNG (max 5MB)
              </p>
            </div>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>

          {/* Selected File Preview */}
          {file && (
            <div className="flex items-center gap-2 text-xs bg-gray-50 border rounded-lg px-3 py-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="truncate flex-1">{file.name}</span>
              <span className="text-gray-400">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 px-5 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            disabled={!description || !file || loading}
            onClick={handleSubmit}
            className="px-5 py-1.5 text-xs bg-primary text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadModal;
