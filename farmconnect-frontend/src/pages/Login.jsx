import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import api from "../api/axios";
import { useTranslation } from "react-i18next";
import AnimatedSection from "../component/AnimatedSection";

import { toast } from "react-toastify";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  const onSubmit = async (data) => {
    try {
      let res;
      if (data.email === "admin" && data.password === "admin123@") {
        // Admin login
        res = await api.post("/auth/admin/login", { username: "admin", password: "admin123@" });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", "ADMIN");
        toast.success(t('auth.loginSuccess') || "Login successful!");
        navigate("/admin/dashboard");
        return;
      }

      // Try user login first
      try {
        res = await api.post("/auth/user/login", data);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", "USER");
        toast.success(t('auth.loginSuccess') || "Login successful!");
        navigate("/home");
        return;
      } catch (userError) {
        // If user login fails with 404 (Not Found) or 401, try consumer login
        // But if it's a 500 or network error, we should probably stop and report it.
        // However, the original logic tried Consumer login on ANY error.
        console.log("User login failed, trying consumer login:", userError.message);
      }

      // Try consumer login
      try {
        res = await api.post("/auth/consumer/login", data);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", "CONSUMER");
        toast.success(t('auth.loginSuccess') || "Login successful!");
        navigate("/consumer/dashboard");
      } catch (consumerError) {
        // This is the final fallback error
        console.error("Login Error:", consumerError);

        let errorMessage = "Unknown error";
        if (consumerError.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          errorMessage = consumerError.response.data?.message || `Server Error (${consumerError.response.status})`;
        } else if (consumerError.request) {
          // The request was made but no response was received
          errorMessage = "No response from server. Check your connection.";
        } else {
          // Something happened in setting up the request that triggered an Error
          errorMessage = consumerError.message;
        }

        toast.error(`${t('auth.loginFailed')}: ${errorMessage}`);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      <AnimatedSection className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md text-white">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold mb-2 drop-shadow-md">{t('auth.welcomeBack')}</h2>
          <p className="text-gray-200 text-lg">{t('auth.loginSubtitle')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <input
              {...register("email", { required: "Email is required" })}
              placeholder={t('auth.emailPlaceholder')}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-200 text-white transition-all shadow-inner"
            />
            {errors.email && <p className="text-red-300 text-sm mt-1 ml-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Password is required" })}
                placeholder={t('auth.passwordPlaceholder')}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-200 text-white transition-all shadow-inner pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-200 hover:text-white transition-colors z-20 cursor-pointer p-1"
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-300 text-sm mt-1 ml-1">{errors.password.message}</p>}
          </div>

          <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-lg shadow-lg transform transition hover:scale-[1.02] active:scale-95 duration-200">
            {t('auth.loginButton')}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-200">
          {t('auth.noAccount')} <Link to="/signup" className="text-green-300 hover:text-green-200 font-semibold underline decoration-2 underline-offset-4 transition-colors">{t('auth.signupLink')}</Link>
        </p>

      </AnimatedSection>
    </div>
  );
}
