const UploadPreview = ({ files, onRemove }) => {
  if (!files.length) return null;

  return (
    <div className="px-4 py-2 flex gap-2 flex-wrap border-t bg-white">
      {files.map((file, index) => (
        <div
          key={index}
          className="flex items-center gap-2 px-3 py-1 text-xs bg-gray-100 rounded-full"
        >
          <span>{file.name}</span>
          <button
            onClick={() => onRemove(index)}
            className="text-gray-500 hover:text-red-500"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default UploadPreview;