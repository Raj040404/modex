import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ShowList from './pages/ShowList';
import BookingPage from './pages/BookingPage';
import AdminDashboard from './pages/AdminDashboard';

import MyBookings from './pages/MyBookings';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Toaster position="top-right" />
                <div className="min-h-screen bg-white">
                    <header className="border-b p-4 flex justify-between items-center bg-[#0f172a] text-white border-none">
                        <a href="/" className="text-xl font-bold">Modex Booking</a>
                        <a href="/my-bookings" className="text-sm bg-emerald-600 px-3 py-1 rounded hover:bg-emerald-700">My Bookings</a>
                    </header>
                    <main>
                        <Routes>
                            <Route path="/" element={<ShowList />} />
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/booking/:id" element={<BookingPage />} />
                            <Route path="/my-bookings" element={<MyBookings />} />
                        </Routes>
                    </main>
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
