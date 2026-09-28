import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import api from "../services/api.js";

export default function Commande() {
  const { items, retirer, totalArticles, fraisLivraison, total, restantPourGratuit, viderPanier } = useCart();
  const { user } = useAuth();
  const [adresse, setAdresse] = useState("");
  const [erreur, setErreur] = useState(null);
  const [envoi, setEnvoi] = useState(false);
  const navigate = useNavigate();

  async function valider() {
    if (!user) {
      navigate("/login");
      return;
    }
    setEnvoi(true);
    setErreur(null);
    try {
      const res = await api.post("/commandes/", {
        items: items.map((it) => ({ plat_id: it.plat_id, quantite: it.quantite })),
        adresse_livraison: adresse,
      });
      viderPanier();
      navigate(`/suivi/${res.data.id}`);
    } catch {
      setErreur("Impossible de valider la commande. Vérifie ton panier et réessaie.");
    } finally {
      setEnvoi(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-gray-500">Ton panier est vide.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Mon panier</h1>

      <div className="mb-4 divide-y rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        {items.map((it) => (
          <div key={it.plat_id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-medium">{it.nom}</p>
              <p className="text-sm text-gray-500">
                {it.quantite} × {it.prix.toFixed(2)} €
              </p>
            </div>
            <button onClick={() => retirer(it.plat_id)} className="text-sm text-red-500 hover:underline">
              Retirer
            </button>
          </div>
        ))}
      </div>

      {restantPourGratuit > 0 ? (
        <p className="mb-4 text-sm text-primary-dark">
          Plus que {restantPourGratuit.toFixed(2)} € pour la livraison gratuite !
        </p>
      ) : (
        <p className="mb-4 text-sm text-primary-dark">Livraison gratuite 🎉</p>
      )}

      <div className="mb-4 space-y-1 rounded-2xl bg-white p-4 text-sm shadow-sm ring-1 ring-black/5">
        <div className="flex justify-between">
          <span>Sous-total</span>
          <span>{totalArticles.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between">
          <span>Frais de livraison</span>
          <span>{fraisLivraison.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between border-t pt-1 font-semibold">
          <span>Total</span>
          <span>{total.toFixed(2)} €</span>
        </div>
      </div>

      <textarea
        className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        placeholder="Adresse de livraison (rue, digicode, étage...)"
        value={adresse}
        onChange={(e) => setAdresse(e.target.value)}
        rows={3}
      />

      {erreur && <p className="mb-3 text-sm text-red-600">{erreur}</p>}
      {!user && <p className="mb-3 text-sm text-gray-500">Connecte-toi pour valider ta commande.</p>}

      <button
        onClick={valider}
        disabled={envoi}
        className="w-full rounded-full bg-secondary py-3 font-semibold text-white hover:bg-secondary-dark disabled:opacity-50"
      >
        {envoi ? "Validation..." : "Valider la commande"}
      </button>
    </div>
  );
}
