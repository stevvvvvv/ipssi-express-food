const ETAPES = [
  { cle: "recue", label: "Commande reçue" },
  { cle: "preparation", label: "En préparation" },
  { cle: "assignee", label: "Livreur attribué" },
  { cle: "livraison", label: "Livraison en cours" },
];

function etapeCouranteIndex(statut) {
  if (statut === "en_attente") return 1; // reçue + en préparation, pas encore de livreur
  if (statut === "en_livraison") return 3;
  if (statut === "livree") return 3;
  return 0;
}

export default function TrackingTimeline({ statut }) {
  const indexCourant = etapeCouranteIndex(statut);

  return (
    <div className="flex items-center">
      {ETAPES.map((etape, i) => (
        <div key={etape.cle} className="flex flex-1 flex-col items-center text-center">
          <div className="flex w-full items-center">
            <div
              className={`h-1 flex-1 ${i === 0 ? "invisible" : i <= indexCourant ? "bg-primary" : "bg-gray-200"}`}
            />
            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs text-white ${
                i <= indexCourant ? "bg-primary" : "bg-gray-300"
              }`}
            >
              {i <= indexCourant ? "✓" : ""}
            </div>
            <div
              className={`h-1 flex-1 ${
                i === ETAPES.length - 1 ? "invisible" : i < indexCourant ? "bg-primary" : "bg-gray-200"
              }`}
            />
          </div>
          <p className={`mt-2 text-xs font-medium ${i <= indexCourant ? "text-primary-dark" : "text-gray-400"}`}>
            {etape.label}
          </p>
        </div>
      ))}
    </div>
  );
}
