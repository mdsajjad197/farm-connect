import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useTranslation } from "react-i18next";
import AnimatedSection from "../component/AnimatedSection";

import { toast } from "react-toastify";

export default function Signup() {
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const watchRole = useWatch({ control, name: "role" });
  const { t } = useTranslation();

  const onSubmit = async (data) => {
    try {
      const url =
        data.role === "USER"
          ? "/auth/user/signup"
          : "/auth/consumer/signup";

      await api.post(url, data);
      toast.success(t('auth.signupSuccess') || "Signup successful!");

      // After signup, automatically login
      try {
        let res;
        if (data.role === "USER") {
          res = await api.post("/auth/user/login", { email: data.email, password: data.password });
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("role", "USER");
          navigate("/home");
        } else if (data.role === "CONSUMER") {
          res = await api.post("/auth/consumer/login", { email: data.email, password: data.password });
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("role", "CONSUMER");
          navigate("/consumer/dashboard");
        }
      } catch (loginError) {
        console.error(loginError);
        toast.error("Signup successful, but login failed: " + (loginError.response?.data?.message || loginError.response?.data?.error || loginError.message || "Unknown error"));
        // Still navigate to login page or something
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error("Signup failed: " + (error.response?.data?.message || error.response?.data?.error || error.message || "Unknown error"));
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center py-10"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      <AnimatedSection className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md text-white my-8">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-extrabold mb-2 drop-shadow-md">{t('auth.joinFarmConnect')}</h2>
          <p className="text-gray-200 text-lg">{t('auth.signupSubtitle')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <select
              {...register("role", { required: "Role is required" })}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-white transition-all shadow-inner appearance-none cursor-pointer"
              style={{ color: 'white' }}
            >
              <option value="" className="text-gray-800 bg-white">{t('auth.selectRole')}</option>
              <option value="USER" className="text-gray-800 bg-white">{t('auth.userRole')}</option>
              <option value="CONSUMER" className="text-gray-800 bg-white">{t('auth.consumerRole')}</option>
            </select>
            {errors.role && <p className="text-red-300 text-sm mt-1 ml-1">{errors.role.message}</p>}
          </div>

          <div>
            <input
              {...register("name", { required: "Name is required" })}
              placeholder={t('auth.fullNamePlaceholder')}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-200 text-white transition-all shadow-inner"
            />
            {errors.name && <p className="text-red-300 text-sm mt-1 ml-1">{errors.name.message}</p>}
          </div>

          <div>
            <input
              {...register("email", { required: "Email is required", pattern: { value: /.+@.+\..+/, message: "Invalid email format" } })}
              placeholder={t('auth.emailPlaceholder')}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-200 text-white transition-all shadow-inner"
            />
            {errors.email && <p className="text-red-300 text-sm mt-1 ml-1">{errors.email.message}</p>}
          </div>

          <div>
            <input
              {...register("phone", { required: "Phone is required" })}
              placeholder={t('auth.phonePlaceholder')}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-200 text-white transition-all shadow-inner"
            />
            {errors.phone && <p className="text-red-300 text-sm mt-1 ml-1">{errors.phone.message}</p>}
          </div>

          {watchRole === "CONSUMER" && (
            <>
              <div className="animate-fade-in-down">
                <input
                  {...register("address", { required: "Address is required" })}
                  placeholder={t('auth.addressPlaceholder')}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-200 text-white transition-all shadow-inner mb-4"
                />
                {errors.address && <p className="text-red-300 text-sm mt-1 ml-1 -mb-3">{errors.address.message}</p>}
              </div>

              <div className="animate-fade-in-down">
                <input
                  {...register("city", { required: "City is required" })}
                  placeholder={t('auth.cityPlaceholder')}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-200 text-white transition-all shadow-inner"
                />
                {errors.city && <p className="text-red-300 text-sm mt-1 ml-1">{errors.city.message}</p>}
              </div>
            </>
          )}

          <div>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              placeholder={t('auth.passwordPlaceholder')}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-200 text-white transition-all shadow-inner"
            />
            {errors.password && <p className="text-red-300 text-sm mt-1 ml-1">{errors.password.message}</p>}
          </div>

          <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-lg shadow-lg transform transition hover:scale-[1.02] active:scale-95 duration-200 mt-2">
            {t('auth.signupButton')}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-200">
          {t('auth.alreadyAccount')} <Link to="/login" className="text-green-300 hover:text-green-200 font-semibold underline decoration-2 underline-offset-4 transition-colors">{t('auth.loginLink')}</Link>
        </p>

      </AnimatedSection>

    </div>
  );
}
