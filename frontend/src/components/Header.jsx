import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Header() {
  const { user, logout } = useAuth();
  const { items, restantPourGratuit } = useCart();
  const nbArticles = items.reduce((n, it) => n + it.quantite, 0);

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🚴</span>
          <div>
            <p className="font-heading text-lg font-bold leading-none text-primary-dark">IPSSI</p>
            <p className="text-xs font-medium tracking-wide text-gray-500">Express Food</p>
          </div>
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link to="/" className="hover:text-primary-dark">
            Notre carte
          </Link>
          {user?.role === "livreur" && (
            <Link to="/livreur" className="hover:text-primary-dark">
              Mes livraisons
            </Link>
          )}
          {user ? (
            <button onClick={logout} className="text-gray-500 hover:text-gray-800">
              Déconnexion ({user.username})
            </button>
          ) : (
            <Link to="/login" className="hover:text-primary-dark">
              Mon compte
            </Link>
          )}
          <Link
            to="/commande"
            className="relative rounded-full bg-secondary px-4 py-2 font-semibold text-white shadow hover:bg-secondary-dark"
          >
            🛒 Panier {nbArticles > 0 && `(${nbArticles})`}
          </Link>
        </nav>
      </div>
      {items.length > 0 && restantPourGratuit > 0 && (
        <div className="bg-primary/10 py-1 text-center text-xs font-medium text-primary-dark">
          Plus que {restantPourGratuit.toFixed(2)} € pour la livraison gratuite !
        </div>
      )}
    </header>
  );
}
