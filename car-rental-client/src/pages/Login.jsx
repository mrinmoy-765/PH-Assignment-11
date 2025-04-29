import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
// import { auth, googleProvider } from "../firebase.config";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (err) {
      setError("Google login failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#222831] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#393E46] p-8 rounded-xl shadow-lg text-[#EEEEEE]">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text text-[#EEEEEE]">Email</span>
            </label>
            <input
              type="email"
              name="email"
              className="input input-bordered w-full"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text text-[#EEEEEE]">Password</span>
            </label>
            <input
              type="password"
              name="password"
              className="input input-bordered w-full"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button type="submit" className="btn w-full bg-[#FD7014] text-white border-none hover:bg-[#e76100]">
            Login
          </button>

          <div className="divider text-[#EEEEEE]">OR</div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="btn w-full bg-white text-black hover:bg-gray-100"
          >
            Continue with Google
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <span
            className="text-[#FD7014] cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
