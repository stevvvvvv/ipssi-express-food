import { Route, Routes } from "react-router-dom";

import Header from "./components/Header.jsx";
import Commande from "./pages/Commande.jsx";
import LivreurDashboard from "./pages/LivreurDashboard.jsx";
import Login from "./pages/Login.jsx";
import Menu from "./pages/Menu.jsx";
import Register from "./pages/Register.jsx";
import Suivi from "./pages/Suivi.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/commande" element={<Commande />} />
        <Route path="/suivi/:id" element={<Suivi />} />
        <Route path="/livreur" element={<LivreurDashboard />} />
      </Routes>
    </div>
  );
}
