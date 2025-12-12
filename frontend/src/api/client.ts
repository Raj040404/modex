import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
    baseURL: API_URL,
});

export const getShows = () => api.get('/public/shows');
export const getShow = (id: string) => api.get(`/public/shows/${id}`);
export const createShow = (data: any) => api.post('/admin/shows', data);
export const bookSeats = (data: { userId: string; showId: string; seatIds: string[] }) => api.post('/public/bookings', data);
export const getUserBookings = (userId: string) => api.get(`/public/bookings/user/${userId}`);
