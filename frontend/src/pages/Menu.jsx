import { useEffect, useState } from "react";

import DishCard from "../components/DishCard.jsx";
import { useCart } from "../context/CartContext.jsx";
import api from "../services/api.js";

export default function Menu() {
  const [plats, setPlats] = useState([]);
  const [erreur, setErreur] = useState(null);
  const { ajouter } = useCart();

  useEffect(() => {
    api
      .get("/plats/")
      .then((res) => setPlats(res.data))
      .catch(() => setErreur("Impossible de charger le menu du jour (l'API est-elle lancée ?)"));
  }, []);

  const platsPrincipaux = plats.filter((p) => p.type === "plat");
  const desserts = plats.filter((p) => p.type === "dessert");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-1 text-3xl font-bold">La sélection du chef de ce jour</h1>
      <p className="mb-6 text-gray-500">2 plats et 2 desserts, préparés le jour même. Livraison en moins de 20 min.</p>

      {erreur && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{erreur}</p>}

      {!erreur && plats.length === 0 && <p className="text-gray-500">Aucun plat disponible aujourd'hui pour l'instant.</p>}

      {platsPrincipaux.length > 0 && (
        <>
          <h2 className="mb-3 mt-2 text-xl font-semibold">Plats</h2>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {platsPrincipaux.map((p) => (
              <DishCard key={p.id} plat={p} onAdd={ajouter} />
            ))}
          </div>
        </>
      )}

      {desserts.length > 0 && (
        <>
          <h2 className="mb-3 text-xl font-semibold">Desserts</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {desserts.map((p) => (
              <DishCard key={p.id} plat={p} onAdd={ajouter} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
