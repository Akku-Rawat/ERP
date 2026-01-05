import React, { useState } from "react";
import { X, Upload } from "lucide-react";

type Props = {
  onClose: () => void;
  onSave: (payload: {
    name: string;
    type: string;
    file: File;
  }) => void;
};

const DOCUMENT_TYPES = [
  "Identity",
  "Address Proof",
  "Employment",
  "Financial",
  "Other",
];

export const AddOtherDocumentModal: React.FC<Props> = ({
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-5 space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-semibold text-gray-700">
            Add Other Document
          </h4>
          <button onClick={onClose}>
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div>
          <label className="text-xs text-gray-600 font-medium">
            Document Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-lg"
          />
        </div>

        <div>
          <label className="text-xs text-gray-600 font-medium">
            Document Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-lg"
          >
            <option value="">Select type</option>
            {DOCUMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-600 font-medium">
            Upload File
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-xs"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs border rounded-lg"
          >
            Cancel
          </button>
          <button
            disabled={!name || !type || !file}
            onClick={() =>
              file && onSave({ name, type, file })
            }
            className="px-4 py-1.5 text-xs bg-purple-600 text-white rounded-lg disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
