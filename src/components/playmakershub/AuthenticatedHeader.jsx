import { useNavigate } from "react-router-dom";
import { playmakersLogo } from "../../assets"; // Adjust the path as needed
import { supabase } from "../../database/supabase";

const AuthenticatedHeader = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("authToken");
    navigate("/member/login");
  };

  return (
    <header className="flex items-center justify-between p-4 shadow-md py-1">
      <img
        src={playmakersLogo}
        alt="Playmakers Logo"
        className="w-16 h-14 object-contain"
      />

      <nav className="flex justify-center space-x-20 w-full">
        <button
          onClick={() => navigate("/events")}
          className="text-[#FFFFFF] text-2xl font-medium hover:text-[#a83c70]"
        >
          Events
        </button>
        <button
          onClick={() => navigate("/playmakershub")}
          className="text-[#FFFFFF] text-4xl font-medium hover:text-[#a83c70]"
        >
          Playmakers Hub
        </button>
        <button
          onClick={() => navigate("")}
          className="text-[#FFFFFF] text-2xl font-medium hover:text-[#a83c70]"
        >
          Home
        </button>
      </nav>

      <div>
        <button
          onClick={handleLogout}
          className="font-poppins px-6 py-2 bg-[#992d5e] text-[#ffffff] text-md font-bold hover:bg-[#a83c70] rounded-full"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AuthenticatedHeader;
