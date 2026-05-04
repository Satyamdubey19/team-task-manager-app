import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div />
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Hello, <span className="font-medium">{user?.name}</span>
        </span>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
