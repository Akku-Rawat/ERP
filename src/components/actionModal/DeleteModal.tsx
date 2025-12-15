interface DeleteModalProps<T = unknown> {
  entityName: string;
  entityId: string | number;
  entityDisplayName?: string;
  isLoading?: boolean;
  onClose: () => void;
  onDelete: (entityId: string | number, entity?: T) => void;
  entity?: T;
}

function DeleteModal<T = unknown>({
  entityName,
  entityId,
  entityDisplayName,
  entity,
  isLoading = false,
  onClose,
  onDelete,
}: DeleteModalProps<T>) {
  const handleDelete = () => {
    onDelete(entityId, entity);
  };

  const displayText = entityDisplayName
    ? `"${entityDisplayName}" (${entityId})`
    : entityId;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-red-500 border-l-4 border-red-500 p-4 mb-6 -m-6 rounded-t-lg">
          <h2 className="text-2xl font-bold text-white text-center">
            Delete {entityName}
          </h2>
        </div>

        {/* Confirmation Message */}
        <div className="text-center my-6">
          <p className="text-gray-700 text-lg">
            Are you sure you want to{" "}
            <span className="font-semibold text-red-600">
              permanently delete
            </span>{" "}
            this {entityName.toLowerCase()}?
          </p>
          {/* <p className="mt-3 text-gray-900 font-mono text-sm bg-gray-100 px-3 py-2 rounded">
            {displayText}
          </p> */}
          <p className="mt-4 text-sm text-gray-500">
            This action <strong>cannot be undone</strong>.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-3 mt-8">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition font-medium"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition font-medium flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    opacity="0.3"
                  />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
