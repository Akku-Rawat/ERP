import React, { useState } from "react";
import { X, Upload } from "lucide-react";

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
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold">Upload Document</h3>
          <button onClick={onClose}>
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="text-xs font-medium text-gray-600">
            Document Description
          </label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="e.g. NRC, Offer Letter"
          />
        </div>

        {/* File */}
        <div className="mb-4">
          <label className="text-xs font-medium text-gray-600">
            Select File
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-xs"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs border rounded-lg"
          >
            Cancel
          </button>
          <button
            disabled={!description || !file || loading}
            onClick={handleSubmit}
            className="px-4 py-1.5 text-xs bg-primary text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadModal;
