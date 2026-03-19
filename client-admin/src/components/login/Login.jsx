import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { CiLock } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import toast from "react-hot-toast";
import { useState } from "react";
import api from "../../api/api";

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleHide = () => {
    setHidden((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      setLoading(true);

      const res = await api.post("/login/admin", formData);
      const { id } = res.data;

      localStorage.setItem("user", id);

      setUser(id);
      navigate("/");
      toast.success("Logged successfully");
    } catch (error) {
      toast.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-component">
      <div className="welcome-Button">
        <p>
          <span className="text-primary">ADMIN </span>
          <span className="text-secondary">DASHBOARD</span>
        </p>
      </div>
      <div className="login-box">
        <h2 className="text-center text-2xl font-bold text-green">Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="label-style">Username</label>
            <div className="login-input">
              <div className="login-input-icon">
                <CiUser className="text-xl" />
              </div>
              <input
                className="mr-2 w-full p-3 outline-none"
                type="name"
                name="username"
                placeholder="Enter your username"
                onChange={handleChange}
                value={formData.username}
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="label-style">Password</label>
            <div className="login-input">
              <div className="login-input-icon">
                <CiLock className="text-xl" />
              </div>
              <input
                className="w-full p-3 outline-none"
                type={hidden ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                required
                onChange={handleChange}
                value={formData.password}
              />
              <div onClick={handleHide} className="login-hide-icon">
                <MdOutlineRemoveRedEye className="text-xl" />
              </div>
            </div>
          </div>
          {loading ? (
            <div className="login-Loader">
              <PulseLoader size={10} color="#ffffff" />
            </div>
          ) : (
            <button className="login-Button" type="submit">
              Login
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
