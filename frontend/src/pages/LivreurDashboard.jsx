import { useEffect, useState } from "react";

import api from "../services/api.js";

export default function LivreurDashboard() {
  const [commandes, setCommandes] = useState([]);
  const [statut, setStatut] = useState(null);

  async function charger() {
    const [cmdRes, statutRes] = await Promise.all([
      api.get("/livreur/mes-livraisons/"),
      api.get("/livreurs/mon-statut/").catch(() => null),
    ]);
    setCommandes(cmdRes.data);
    if (statutRes) setStatut(statutRes.data);
  }

  useEffect(() => {
    charger();
    const intervalId = setInterval(charger, 10000);
    return () => clearInterval(intervalId);
  }, []);

  async function changerStatut(nouveauStatut) {
    const res = await api.patch("/livreurs/mon-statut/", { statut: nouveauStatut });
    setStatut(res.data);
  }

  async function marquerLivree(commandeId) {
    await api.patch(`/commandes/${commandeId}/livrer/`);
    charger();
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">Mes livraisons</h1>

      {statut && (
        <div className="mb-6 flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          <span>
            Statut :{" "}
            <span className={statut.statut === "libre" ? "text-primary-dark" : "text-secondary-dark"}>
              {statut.statut === "libre" ? "Libre" : "En livraison"}
            </span>
          </span>
          {statut.statut === "libre" && (
            <button
              onClick={charger}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
            >
              Rafraîchir
            </button>
          )}
        </div>
      )}

      {commandes.length === 0 && <p className="text-gray-500">Aucune livraison assignée pour le moment.</p>}

      <div className="space-y-3">
        {commandes.map((c) => (
          <div key={c.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <p className="mb-1 text-sm text-gray-400">Commande {c.id.slice(-6).toUpperCase()}</p>
            <p className="mb-2 text-sm">{c.adresse_livraison || "Adresse non renseignée"}</p>
            <ul className="mb-3 text-sm text-gray-600">
              {c.items.map((it) => (
                <li key={it.plat_id}>
                  {it.quantite} × {it.nom}
                </li>
              ))}
            </ul>
            <button
              onClick={() => marquerLivree(c.id)}
              className="w-full rounded-full bg-primary py-2 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Marquer comme livrée
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
