export default function DishCard({ plat, onAdd }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div>
        <p className="font-heading text-lg font-semibold text-gray-900">{plat.nom}</p>
        {plat.description && <p className="mt-1 text-sm text-gray-500">{plat.description}</p>}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-bold text-primary-dark">{plat.prix.toFixed(2)} €</span>
        <button
          onClick={() => onAdd(plat)}
          className="rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold text-white hover:bg-secondary-dark"
        >
          Ajouter +
        </button>
      </div>
    </div>
  );
}
