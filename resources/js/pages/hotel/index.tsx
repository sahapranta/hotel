import React, { useState } from 'react';
import { router, Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import PaginationLinks from '@/components/pagination';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import HotelController from '@/actions/App/Http/Controllers/HotelController';
import { type BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes/admin';
import { Pagination } from '@/types/hotel';

// --- Types ---
interface Hotel {
    id: number;
    name: string;
    address: string;
    city: string;
    country: string;
    stars: number;
    description: string;
    location: string;
    available_rooms_count: number;
    price_range?: { min: number; max: number; currency: string };
}

interface Props {
    hotels: { data: Hotel[], meta: Pagination }
}

interface FormData {
    name: string;
    address: string;
    city: string;
    country: string;
    stars: number;
    description: string;
}

// --- Breadcrumbs ---
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Hotels', href: '#' },
];

// --- Reusable Hotel Form ---
interface HotelFormProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const HotelForm: React.FC<HotelFormProps> = ({ formData, setFormData }) => (
    <div className="space-y-4">
        <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
        </div>
        <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
            </div>
            <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} />
            </div>
        </div>
        <div>
            <Label htmlFor="stars">Stars</Label>
            <Select value={formData.stars.toString()} onValueChange={value => setFormData({ ...formData, stars: parseInt(value) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                    {[1, 2, 3, 4, 5].map(star => (
                        <SelectItem key={star} value={star.toString()}>{star} Star{star > 1 && 's'}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} />
        </div>
    </div>
);

// --- Main Component ---
const HotelIndex: React.FC<Props> = ({ hotels }) => {    
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
    const [formData, setFormData] = useState<FormData>({
        name: '', address: '', city: '', country: '', stars: 1, description: ''
    });

    const resetForm = () => setFormData({ name: '', address: '', city: '', country: '', stars: 1, description: '' });

    // --- CRUD Handlers ---
    const handleCreate = () => router.post(HotelController.store.url(), { ...formData }, {
        onSuccess: () => { setCreateOpen(false); resetForm(); toast.success('Hotel created'); },
        onError: (errors) => toast.error(errors.error || 'Failed to create hotel')
    });

    const handleEdit = (hotel: Hotel) => { setSelectedHotel(hotel); setFormData({ ...hotel }); setEditOpen(true); };
    const handleUpdate = () => selectedHotel && router.put(HotelController.update.url(selectedHotel.id), { ...formData }, {
        onSuccess: () => { setEditOpen(false); resetForm(); setSelectedHotel(null); toast.success('Hotel updated'); },
        onError: (errors) => toast.error(errors.error || 'Failed to update hotel')
    });

    const handleDelete = (hotel: Hotel) => { setSelectedHotel(hotel); setDeleteOpen(true); };
    const confirmDelete = () => selectedHotel && router.delete(HotelController.destroy.url(selectedHotel.id), {
        onSuccess: () => { setDeleteOpen(false); setSelectedHotel(null); toast.success('Hotel deleted'); },
        onError: (errors) => toast.error(errors.error || 'Failed to delete hotel')
    });

    const handlePageChange = (page: number) => router.get(HotelController.index.url(), { page }, { preserveState: true, replace: true });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Hotels</h1>
                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <Button><Plus className="w-4 h-4 mr-2" />Add Hotel</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Create Hotel</DialogTitle></DialogHeader>
                            <HotelForm formData={formData} setFormData={setFormData} />
                            <div className="flex justify-end gap-2 mt-4">
                                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                                <Button onClick={handleCreate}>Create</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Table */}
                <div className="border rounded-lg overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stars</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available Rooms</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Range</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {hotels.data.map(hotel => (
                                <tr key={hotel.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{hotel.name}</td>
                                    <td className="px-6 py-4 text-gray-500">{hotel.location}</td>
                                    <td className="px-6 py-4 text-gray-500">{'⭐'.repeat(hotel.stars)}</td>
                                    <td className="px-6 py-4 text-gray-500">{hotel.available_rooms_count || 0}</td>
                                    <td className="px-6 py-4 text-gray-500">{hotel.price_range ? `$${hotel.price_range.min} - $${hotel.price_range.max}` : 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEdit(hotel)}><Edit className="w-4 h-4" /></Button>
                                            <Button variant="outline" size="sm" onClick={() => handleDelete(hotel)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Showing {hotels.meta?.from} to {hotels.meta?.to} of {hotels.meta?.total} results</span>
                    <PaginationLinks pagination={hotels.meta} onPageChange={handlePageChange} />
                </div>

                {/* Edit Modal */}
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Edit Hotel</DialogTitle></DialogHeader>
                        <HotelForm formData={formData} setFormData={setFormData} />
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                            <Button onClick={handleUpdate}>Update</Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Delete Modal */}
                <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Delete Hotel</DialogTitle></DialogHeader>
                        <p>Are you sure you want to delete "{selectedHotel?.name}"? This action cannot be undone.</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
                            <Button variant="destructive" className='text-white' onClick={confirmDelete}>Delete</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
};

export default HotelIndex;