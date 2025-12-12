import { useEffect, useState } from 'react';
import { getShows } from '../api/client';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, MapPin } from 'lucide-react';

const IMAGES: Record<string, string> = {
    "Avengers: Secret Wars": "https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg",
    "Dune: Part Two": "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    "Oppenheimer": "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    "Spider-Man: Beyond the Spider-Verse": "https://image.tmdb.org/t/p/w500/qnqGbB22YJ7dSs4o6M7exBmRpLz.jpg"
};

export default function ShowList() {
    const [shows, setShows] = useState<any[]>([]);
    const { isAdmin } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getShows()
            .then(res => setShows(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">Loading Shows...</div>;

    return (
        <div className="min-h-screen bg-[#0f172a] text-white">
            {/* Hero Section */}
            <div className="relative h-[400px] w-full bg-gradient-to-r from-purple-900 to-indigo-900 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative z-10 text-center space-y-4 p-4">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                        BLOCKBUSTER
                    </h1>
                    <p className="text-xl text-gray-200">Experience Cinema Like Never Before</p>
                    {isAdmin && <Link to="/admin" className="inline-block mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur rounded border border-white/30 transition">Admin Dashboard</Link>}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold mb-8 border-l-4 border-emerald-500 pl-4">Now Showing</h2>

                {shows.length === 0 ? (
                    <div className="text-center py-20 bg-gray-800/50 rounded-xl border border-gray-700">
                        <p className="text-gray-400 text-lg">No shows scheduled right now.</p>
                        <p className="text-sm text-gray-500 mt-2">Check back later or check your DB connection.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {shows.map((show: any) => (
                            <div key={show.id} className="group relative bg-[#1e293b] rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition duration-300 border border-gray-800">
                                <div className="aspect-[2/3] w-full relative overflow-hidden">
                                    <img
                                        src={IMAGES[show.name] || `https://placehold.co/400x600?text=${show.name.charAt(0)}`}
                                        alt={show.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                        <Link to={`/booking/${show.id}`} className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition duration-300">
                                            Book Tickets
                                        </Link>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <h3 className="text-xl font-bold truncate mb-2 text-white group-hover:text-emerald-400 transition">{show.name}</h3>
                                    <div className="flex items-center text-gray-400 text-sm mb-2">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {new Date(show.startTime).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center text-gray-400 text-sm mb-4">
                                        <Clock className="w-4 h-4 mr-2" />
                                        {new Date(show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="flex items-center text-emerald-400 text-sm font-semibold">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        IMAX 3D
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
