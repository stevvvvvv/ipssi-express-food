import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import TrackingTimeline from "../components/TrackingTimeline.jsx";
import api from "../services/api.js";

const LIBELLES_STATUT = {
  en_attente: "En attente d'un livreur disponible",
  en_livraison: "Livraison en cours !",
  livree: "Livrée ✅",
};

export default function Suivi() {
  const { id } = useParams();
  const [commande, setCommande] = useState(null);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    let annule = false;

    async function charger() {
      try {
        const res = await api.get(`/commandes/${id}/`);
        if (!annule) {
          setCommande(res.data);
          setErreur(null);
        }
      } catch {
        if (!annule) setErreur("Commande introuvable.");
      }
    }

    charger();
    const intervalId = setInterval(charger, 8000); // rafraîchissement toutes les 8s
    return () => {
      annule = true;
      clearInterval(intervalId);
    };
  }, [id]);

  if (erreur && !commande) return <p className="mx-auto max-w-lg px-4 py-16 text-center text-red-600">{erreur}</p>;
  if (!commande) return <p className="mx-auto max-w-lg px-4 py-16 text-center text-gray-500">Chargement...</p>;
  
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <p className="text-sm text-gray-400">Suivi de commande · {commande.id.slice(-6).toUpperCase()}</p>
      <h1 className="mb-6 text-2xl font-bold text-primary-dark">{LIBELLES_STATUT[commande.statut]}</h1>

      {commande.temps_restant_minutes !== null && (
        <div className="mb-6 flex flex-col items-center rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <p className="text-xs uppercase tracking-wide text-gray-400">Arrivée estimée dans</p>
          <p className="text-4xl font-bold text-primary">{commande.temps_restant_minutes} min</p>
        </div>
      )}

      <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
        <TrackingTimeline statut={commande.statut} />
      </div>

      {commande.livreur_nom && (
        <div className="mb-6 flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">Ton livreur</p>
            <p className="font-semibold">{commande.livreur_nom}</p>
          </div>
          <span className="text-2xl">🚴</span>
        </div>
      )}

      <div className="rounded-2xl bg-white p-4 text-sm shadow-sm ring-1 ring-black/5">
        {commande.items.map((it) => (
          <div key={it.plat_id} className="flex justify-between py-1">
            <span>
              {it.quantite} × {it.nom}
            </span>
            <span>{(it.prix_unitaire * it.quantite).toFixed(2)} €</span>
          </div>
        ))}
        <div className="mt-2 flex justify-between border-t pt-2 font-semibold">
          <span>Total</span>
          <span>{commande.total.toFixed(2)} €</span>
        </div>
      </div>
    </div>
  );
}
