const Button = ({ children, onClick, type = "button", className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full py-2 text-lg font-medium text-white bg-green-500 rounded-full hover:bg-green-600 transition ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
