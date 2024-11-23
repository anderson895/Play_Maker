import { useEffect, useState } from "react";
import { supabase } from "../../database/supabase";
import { playmakersLogo } from "../../assets";
import { useNavigate } from "react-router-dom";

const MembersLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/playmakershub");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }
    // console.log(data.session.access_token);
    if (data.session.access_token) {
      localStorage.setItem("authToken", data.session.access_token);
      navigate("/playmakershub");
    }
  };

  return (
    <main className="flex flex-col justify-center items-center h-screen bg-black bg-[radial-gradient(circle_at_25%_center,#5C1B33,transparent_85%),radial-gradient(circle_at_75%_center,#2618A7,transparent_80%)]">
      <div
        className="flex justify-center items-center mb-8"
        onClick={() => {
          navigate("/");
        }}
      >
        <img
          src={playmakersLogo}
          alt="Playmakers Logo"
          className="w-32 h-auto"
        />
      </div>

      <div className="flex justify-center items-center w-full">
        <form
          onSubmit={handleLogin}
          className="bg-white bg-opacity-20 p-8 rounded-2xl w-96 flex flex-col items-center"
        >
          <p className="text-2xl font-bold text-white mb-8">
            Playmakers - USTP
          </p>

          <fieldset className="w-full mb-4">
            <label htmlFor="email" className="block w-full">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 mb-4 px-4 py-2 text-black rounded-full placeholder-black text-lg"
              />
            </label>
            <label htmlFor="password" className="block w-full">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-12 mb-4 px-4 py-2 text-black rounded-full placeholder-black text-lg"
              />
            </label>
          </fieldset>

          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

          <button
            type="submit"
            className="w-40 h-12 bg-white text-black font-bold text-lg rounded-full mt-4"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default MembersLogin;
