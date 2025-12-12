import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShow, bookSeats } from '../api/client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function BookingPage() {
    const { id } = useParams();
    const [show, setShow] = useState<any>(null);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const { userId } = useAuth();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();



    useEffect(() => {
        if (id) {
            loadShow();
        }
    }, [id]);

    const loadShow = () => {
        getShow(id!)
            .then(res => setShow(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    const toggleSeat = (seatId: string, status: string) => {
        if (status !== 'AVAILABLE') return;
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(prev => prev.filter(s => s !== seatId));
        } else {
            setSelectedSeats(prev => [...prev, seatId]);
        }
    };

    const handleBooking = async () => {
        try {
            await bookSeats({
                userId,
                showId: id!,
                seatIds: selectedSeats
            });
            toast.success('Booking Confirmed!', {
                style: {
                    background: '#10B981',
                    color: '#fff',
                }
            });
            setTimeout(() => {
                navigate('/my-bookings');
            }, 1000);
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Booking Failed');
            loadShow();
        }
    };

    if (loading) return <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">Loading Layout...</div>;
    if (!show) return <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">Show not found</div>;

    const pricePerSeat = 250;

    return (
        <div className="min-h-screen bg-[#0f172a] text-white pb-20">
            {/* Header */}
            <div className="bg-[#1e293b] p-6 sticky top-0 z-20 shadow-lg border-b border-gray-800">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{show.name}</h1>
                        <p className="text-gray-400 text-sm">
                            {new Date(show.startTime).toLocaleDateString()} • {new Date(show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                    <div className="text-right hidden md:block">
                        <div className="text-emerald-400 font-bold">IMAX 3D HALL 4</div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-4 md:p-8">
                {/* Screen */}
                <div className="mb-12 relative">
                    <div className="w-2/3 mx-auto h-2 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_10px_40px_rgba(16,185,129,0.5)] rounded-full"></div>
                    <p className="text-center text-gray-500 mt-4 text-sm tracking-widest uppercase">Screen this way</p>
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-6 mb-8 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded border border-gray-600 bg-[#0f172a]"></div>
                        <span className="text-gray-400">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]"></div>
                        <span className="text-gray-400">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-gray-700 opacity-50"></div>
                        <span className="text-gray-500">Sold</span>
                    </div>
                </div>

                {/* Grid */}
                <div className="seat-grid gap-y-4 mb-20 justify-items-center">
                    {show.seats.map((seat: any) => {
                        const isSelected = selectedSeats.includes(seat.id);
                        const isBooked = seat.status === 'BOOKED' || seat.status === 'LOCKED';

                        return (
                            <button
                                key={seat.id}
                                disabled={isBooked}
                                onClick={() => toggleSeat(seat.id, seat.status)}
                                className={`
                                    w-8 h-8 md:w-10 md:h-10 rounded-t-lg transition-all duration-200 flex items-center justify-center text-[10px] md:text-xs font-medium
                                    ${isSelected
                                        ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.6)] scale-110 z-10'
                                        : isBooked
                                            ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700'
                                            : 'bg-[#1e293b] text-gray-400 border border-gray-700 hover:bg-gray-700 hover:border-emerald-500/50 hover:text-white'
                                    }
                                `}
                            >
                                {seat.seatNumber}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Bar */}
            {selectedSeats.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-[#1e293b] border-t border-gray-800 p-4 shadow-2xl animate-fade-in z-30">
                    <div className="max-w-4xl mx-auto flex justify-between items-center">
                        <div>
                            <p className="text-gray-400 text-sm">Total Price</p>
                            <p className="text-2xl font-bold text-white">₹ {selectedSeats.length * pricePerSeat}</p>
                            <p className="text-xs text-gray-500">{selectedSeats.length} seats selected</p>
                        </div>
                        <button
                            onClick={handleBooking}
                            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition"
                        >
                            Book Tickets
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
