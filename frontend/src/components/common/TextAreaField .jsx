const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  rows = 3,
  placeholder = "",
  required = false,
  className = "",
  ...props
}) => {
  return (
    <div className={`grid grid-cols-1 gap-1 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          props.disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
        }`}
        {...props}
      />
    </div>
  );
};

export default TextAreaField;
