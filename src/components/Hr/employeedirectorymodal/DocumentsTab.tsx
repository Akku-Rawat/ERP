import { Upload, Trash2, FileText, Plus } from "lucide-react";

type DocumentUpload = {
  uploaded: boolean;
  fileName?: string;
  fileUrl?: string;
  category?: string;
};

type Props = {
  documents: Record<string, DocumentUpload>;
  setUploadingDoc: (doc: string | null) => void;
  removeDocument: (doc: string) => void;
};

export default function DocumentsTab({
  documents,
  setUploadingDoc,
  removeDocument,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">
            Employee Documents
          </h3>
          <p className="text-xs text-gray-500">
            Upload and manage employee documents
          </p>
        </div>

        <button
          onClick={() => setUploadingDoc("CUSTOM")}
          className="flex items-center gap-2 px-3 py-1.5 text-xs bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Plus className="w-3 h-3" />
          Add Document
        </button>
      </div>

      {/* Document List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(documents).map(([key, doc]) => (
          <div
            key={key}
            className="border rounded-lg p-4 bg-white flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-500" />
              </div>

              <div>
                <div className="text-sm font-medium text-gray-800">{key}</div>

                {doc.uploaded ? (
                  <div className="text-xs text-green-600">{doc.fileName}</div>
                ) : (
                  <div className="text-xs text-gray-400">Not uploaded</div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {!doc.uploaded ? (
                <button
                  onClick={() => setUploadingDoc(key)}
                  className="p-2 text-gray-600 hover:text-purple-600"
                >
                  <Upload className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => removeDocument(key)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
