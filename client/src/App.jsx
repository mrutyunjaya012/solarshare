import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ProsumerDashboard from "./pages/prosumer/ProsumerDashboard.jsx";
import ConsumerDashboard from "./pages/consumer/ConsumerDashboard.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminListings from "./pages/admin/AdminListings.jsx";
import AdminTransactions from "./pages/admin/AdminTransactions.jsx";
import AdminMeters from "./pages/admin/AdminMeters.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Marketplace from "./pages/shared/Marketplace.jsx";
import WalletPage from "./pages/shared/WalletPage.jsx";
import TransactionsPage from "./pages/shared/TransactionsPage.jsx";
import ListingsPage from "./pages/prosumer/ListingsPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />

      <Route
        path="/prosumer/*"
        element={
          <ProtectedRoute allowedRoles={["prosumer"]}>
            <ProsumerDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/prosumer/listings" element={<ProtectedRoute allowedRoles={["prosumer"]}><ListingsPage /></ProtectedRoute>} />
      <Route path="/prosumer/transactions" element={<ProtectedRoute allowedRoles={["prosumer"]}><TransactionsPage /></ProtectedRoute>} />
      <Route path="/prosumer/wallet" element={<ProtectedRoute allowedRoles={["prosumer"]}><WalletPage /></ProtectedRoute>} />
      <Route
        path="/consumer/*"
        element={
          <ProtectedRoute allowedRoles={["consumer"]}>
            <ConsumerDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/consumer/transactions" element={<ProtectedRoute allowedRoles={["consumer"]}><TransactionsPage /></ProtectedRoute>} />
      <Route path="/consumer/wallet" element={<ProtectedRoute allowedRoles={["consumer"]}><WalletPage /></ProtectedRoute>} />
      <Route path="/admin"              element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users"        element={<ProtectedRoute allowedRoles={["admin"]}><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/listings"     element={<ProtectedRoute allowedRoles={["admin"]}><AdminListings /></ProtectedRoute>} />
      <Route path="/admin/transactions" element={<ProtectedRoute allowedRoles={["admin"]}><AdminTransactions /></ProtectedRoute>} />
      <Route path="/admin/meters"       element={<ProtectedRoute allowedRoles={["admin"]}><AdminMeters /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
