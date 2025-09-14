import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import BookingController from "@/actions/App/Http/Controllers/BookingController";
import AppLayout from "@/layouts/app-layout";

interface Hotel {
    id: number;
    name: string;
}

interface Room {
    id: number;
    name: string;
}

interface Booking {
    id: number;
    status: string;
    hotel: Hotel;
    rooms: Room[];
}

interface Props {
    booking: Booking;
    hotels: Hotel[];
}

export default function Edit({ booking, hotels }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        status: booking.status,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(BookingController.update(booking.id).url);
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Bookings", href: BookingController.index().url }, { title: `Edit #${booking.id}`, href: "#" }]}>
            <Head title={`Edit Booking #${booking.id}`} />
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Edit Booking #{booking.id}</h1>
                    <Link href={BookingController.index().url}>
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Edit Booking</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <Label htmlFor="status">Status</Label>
                                <select
                                    id="status"
                                    className="w-full border rounded p-2"
                                    value={data.status}
                                    onChange={(e) => setData("status", e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="completed">Completed</option>
                                </select>
                                {errors.status && (
                                    <p className="text-red-500 text-sm">{errors.status}</p>
                                )}
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing ? "Saving..." : "Save Changes"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
