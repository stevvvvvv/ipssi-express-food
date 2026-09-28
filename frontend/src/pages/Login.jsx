import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur(null);
    try {
      await login(username, password);
      navigate("/");
    } catch {
      setErreur("Identifiants incorrects.");
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 text-2xl font-bold">Connexion</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          className="rounded-lg border border-gray-300 px-3 py-2"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          Se connecter
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-500">
        Pas encore de compte ? <Link to="/register" className="font-medium text-primary-dark">S'inscrire</Link>
      </p>
    </div>
  );
}
