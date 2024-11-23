import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserType, supabase } from "../../database/supabase";
import { playmakersLogo } from "../../assets";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Redirect if the admin is already logged in
  useEffect(() => {
    const token = localStorage.getItem("adminAuthToken");
    if (token) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const {
      data: { session, user },
      error,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (error) {
      setError("Invalid login credentials.");
      return;
    }

    // Check if the use is logged-in and the user is an admin
    if (user && session) {
      try {
        // Fetch user_type from the database
        const userType = await fetchUserType(user.id);

        // Check if user_type is admin or superadmin
        if (userType !== "admin" && userType !== "superadmin") {
          setError("Access denied: You do not have admin privileges.");
          return;
        }

        // Save the token based on rememberMe choice
        const tokenStorage = rememberMe ? localStorage : sessionStorage;
        tokenStorage.setItem("adminAuthToken", session.access_token);

        navigate("/admin/dashboard");
      } catch (fetchError) {
        console.error("Error verifying user type:", fetchError);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#5C1B33]">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md flex">
        {/* Left Side Login Form */}
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-bold text-[#5C1B33]">Administrator</h2>
          <p className="mt-2 text-red-400/60 text-xs font-medium">
            If you are not an administrator, please navigate away from this page
            immediately
          </p>
          <form className="mt-8 space-y-4" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side */}
        <div className="w-1/2 bg-gradient-to-r from-[#FBEBF1] to-[#FBEBF1] p-8 rounded-r-lg flex flex-col justify-center items-center">
          <img src={playmakersLogo} alt="Playmakers Logo" width="80" />
          <h3 className="text-xl font-bold text-[#5C1B33] mb-4">Playmakers</h3>
          <p className="text-gray-600 mb-4">Only playmakers officials</p>
          <div className="flex space-x-4">
            <div className="bg-yellow-100 p-2 rounded-full">
              <span role="img" aria-label="guitar">
                🎸
              </span>
            </div>
            <div className="bg-red-100 p-2 rounded-full">
              <span role="img" aria-label="microphone">
                🎤
              </span>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <span role="img" aria-label="musical note">
                🎵
              </span>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <span role="img" aria-label="piano">
                🎹
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
