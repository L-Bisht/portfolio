type TProps = {
  children: React.ReactNode;
};

const Button = ({ children }: TProps) => {
  return (
    <button className="bg-orange-500 text-white py-2 px-4 rounded-sm cursor-pointer hover:bg-orange-600 transition duration-300 active:scale-95">
      {children}
    </button>
  );
};

export default Button;
