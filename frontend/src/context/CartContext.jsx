import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export const SEUIL_LIVRAISON_GRATUITE = 19.99;
export const FRAIS_LIVRAISON = 2.5;

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // { plat_id, nom, prix, quantite }

  function ajouter(plat) {
    setItems((prev) => {
      const existant = prev.find((it) => it.plat_id === plat.id);
      if (existant) {
        return prev.map((it) =>
          it.plat_id === plat.id ? { ...it, quantite: it.quantite + 1 } : it
        );
      }
      return [...prev, { plat_id: plat.id, nom: plat.nom, prix: plat.prix, quantite: 1 }];
    });
  }

  function retirer(platId) {
    setItems((prev) => prev.filter((it) => it.plat_id !== platId));
  }

  function viderPanier() {
    setItems([]);
  }

  const totalArticles = useMemo(
    () => items.reduce((sum, it) => sum + it.prix * it.quantite, 0),
    [items]
  );
  const fraisLivraison = totalArticles >= SEUIL_LIVRAISON_GRATUITE || totalArticles === 0 ? 0 : FRAIS_LIVRAISON;
  const total = totalArticles + fraisLivraison;
  const restantPourGratuit = Math.max(0, SEUIL_LIVRAISON_GRATUITE - totalArticles);

  return (
    <CartContext.Provider
      value={{ items, ajouter, retirer, viderPanier, totalArticles, fraisLivraison, total, restantPourGratuit }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
