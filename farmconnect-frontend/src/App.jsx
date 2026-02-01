import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ConsumerDashboard from "./pages/ConsumerDashboard";


import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminUserDetails from "./pages/AdminUserDetails";
import AdminOrders from "./pages/AdminOrders";
import AdminOrderDetails from "./pages/AdminOrderDetails";
import AdminConsumers from "./pages/AdminConsumers";
import ProtectedRoute from "./component/ProtectedRoute";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import SellerProfile from "./pages/SellerProfile";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import MyOrders from "./pages/MyOrders";


import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRole="USER">
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/consumer/dashboard"
          element={
            <ProtectedRoute allowedRole="CONSUMER">
              <ConsumerDashboard />
            </ProtectedRoute>
          }
        />



        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/user/:id"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminUserDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/order/:id"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminOrderDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/consumers"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminConsumers />
            </ProtectedRoute>
          }
        />



        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/seller/:id" element={<SellerProfile />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
        <Route
          path="/order/my-orders"
          element={
            <ProtectedRoute allowedRole="USER">
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
      </Routes>
    </>
  );
}
