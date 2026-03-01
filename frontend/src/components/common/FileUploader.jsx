const FileUploader = ({ label, name, onChange, required = false }) => {
  return (
    <div className="flex flex-col w-full md:w-1/2 mb-4">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type="file"
        name={name}
        onChange={onChange}
        required={required}
        className="mt-1 border border-gray-300 rounded-md py-2 px-3"
      />
    </div>
  );
};

export default FileUploader;
