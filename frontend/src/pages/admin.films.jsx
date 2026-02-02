import { useModeration } from '../hooks/useModeration';
import StatusBadge from '../components/StatusBadge';
import { Search, Check, X } from 'lucide-react'; // Installe lucide-react si besoin

export default function AdminFilms() {
    const { films, loading, filters, setFilters, updateStatus } = useModeration();

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">FILMS SOUMIS</h1>
                <p className="text-gray-500 mt-2">Gérez l'intégralité des soumissions et gérez les mises en avant.</p>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Rechercher un film ou un réalisateur" 
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setFilters({...filters, search: e.target.value})}
                    />
                </div>
                {/* Tu peux ajouter un select pour le statut ici */}
            </div>

            {/* Liste (Tableau) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-medium">
                        <tr>
                            <th className="p-4">Affiche</th>
                            <th className="p-4">Titre & Auteur</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Statut</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="5" className="p-8 text-center">Chargement...</td></tr>
                        ) : films.map((film) => (
                            <tr key={film.id} className="hover:bg-gray-50 transition">
                                <td className="p-4">
                                    <div className="w-16 h-10 bg-gray-200 rounded overflow-hidden">
                                        {/* Placeholder si pas d'image */}
                                        <img src={film.poster_url || "https://via.placeholder.com/150"} alt="cover" className="w-full h-full object-cover" />
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="font-bold text-gray-900">{film.title}</div>
                                    <div className="text-sm text-gray-500">{film.firstName} {film.lastName}</div>
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    {new Date(film.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <StatusBadge status={film.status} />
                                </td>
                                <td className="p-4 flex justify-end gap-2">
                                    {/* Boutons d'action rapides */}
                                    <button 
                                        onClick={() => updateStatus(film.id, 'approved')}
                                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                                        title="Valider"
                                    >
                                        <Check size={18} />
                                    </button>
                                    <button 
                                        onClick={() => updateStatus(film.id, 'rejected')}
                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                                        title="Refuser"
                                    >
                                        <X size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination (statique pour l'instant) */}
            <div className="mt-6 flex justify-center text-sm text-gray-500">
                PAGE 1 SUR 20 - 120 FILMS TROUVÉS
            </div>
        </div>
    );
}