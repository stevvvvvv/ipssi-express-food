import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [telephone, setTelephone] = useState("");
  const [erreur, setErreur] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur(null);
    try {
      await register(username, password, "client", telephone);
      navigate("/");
    } catch {
      setErreur("Inscription impossible (nom d'utilisateur déjà pris ?).");
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 text-2xl font-bold">Créer un compte client</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          className="rounded-lg border border-gray-300 px-3 py-2"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="rounded-lg border border-gray-300 px-3 py-2"
          placeholder="Téléphone"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
        />
        <input
          className="rounded-lg border border-gray-300 px-3 py-2"
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {erreur && <p className="text-sm text-red-600">{erreur}</p>}
        <button className="rounded-lg bg-primary py-2 font-semibold text-white hover:bg-primary-dark">
          S'inscrire
        </button>
      </form>
    </div>
  );
}
