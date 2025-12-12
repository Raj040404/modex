import { useState } from 'react';
import { createShow } from '../api/client';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
    const [form, setForm] = useState({
        name: '',
        startTime: '',
        totalSeats: 50
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createShow({
                ...form,
                startTime: new Date(form.startTime).toISOString()
            });
            toast.success('Show created successfully');
            setForm({ name: '', startTime: '', totalSeats: 50 });
        } catch (error: any) {
            toast.error('Failed to create show');
        }
    };

    return (
        <div className="p-8 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-6">Create New Show</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Show Name</label>
                    <input
                        type="text"
                        required
                        className="w-full p-2 border rounded"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block mb-1">Start Time</label>
                    <input
                        type="datetime-local"
                        required
                        className="w-full p-2 border rounded"
                        value={form.startTime}
                        onChange={e => setForm({ ...form, startTime: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block mb-1">Total Seats</label>
                    <input
                        type="number"
                        required
                        min="1"
                        max="1000"
                        className="w-full p-2 border rounded"
                        value={form.totalSeats}
                        onChange={e => setForm({ ...form, totalSeats: Number(e.target.value) })}
                    />
                </div>
                <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">
                    Create Show
                </button>
            </form>
        </div>
    );
}
