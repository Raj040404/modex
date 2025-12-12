import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserBookings } from '../api/client';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Ticket } from 'lucide-react';

export default function MyBookings() {
    const { userId } = useAuth();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        getUserBookings(userId)
            .then(res => setBookings(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [userId]);

    if (loading) return <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">Loading Bookings...</div>;

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">My Bookings</h1>
                    <Link to="/" className="text-emerald-400 hover:text-emerald-300">Back to Movies</Link>
                </div>

                {bookings.length === 0 ? (
                    <div className="text-center py-20 bg-gray-800/50 rounded-xl border border-gray-700">
                        <Ticket className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-400 text-lg">No bookings found.</p>
                        <Link to="/" className="inline-block mt-4 px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">
                            Book a Ticket
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking: any) => (
                            <div key={booking.id} className="bg-[#1e293b] rounded-lg border border-gray-700 overflow-hidden flex flex-col md:flex-row shadow-lg">
                                {/* Ticket Stub style left side */}
                                <div className="bg-emerald-600 p-6 flex flex-col justify-center items-center md:w-48 text-center border-r border-dashed border-gray-800 relative">
                                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#0f172a] rounded-full"></div>
                                    <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#0f172a] rounded-full"></div>

                                    <span className="text-emerald-900 font-bold text-xs uppercase tracking-wider mb-2">Status</span>
                                    <span className="bg-white text-emerald-800 px-3 py-1 rounded-full font-bold text-sm">
                                        {booking.status}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1">
                                    <h2 className="text-xl font-bold mb-2">{booking.show.name}</h2>
                                    <div className="flex flex-wrap gap-4 text-gray-400 text-sm mb-4">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            {new Date(booking.show.startTime).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-2" />
                                            {new Date(booking.show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Seats</p>
                                        <div className="flex gap-2 flex-wrap">
                                            {booking.seats.map((seat: any) => (
                                                <span key={seat.id} className="bg-gray-700 text-white px-2 py-1 rounded text-xs font-mono">
                                                    {seat.seatNumber}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-600 mt-4">Booking ID: {booking.id}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
