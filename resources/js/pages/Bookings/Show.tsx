import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import BookingController from "@/actions/App/Http/Controllers/BookingController";
import AppLayout from "@/layouts/app-layout";
import { toast } from "sonner";

interface Room {
    id: number;
    name: string;
    pivot: {
        price: string;
        guests: number;
    };
}

interface Hotel {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Booking {
    id: number;
    check_in: string;
    check_out: string;
    status: string;
    total_price: string;
    guests: number;
    hotel: Hotel;
    user: User;
    rooms: Room[];
}

interface Props {
    booking: Booking;
}

export default function Show({ booking }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this booking?")) {
            destroy(BookingController.destroy(booking.id).url, {
                onError: (errors) => {
                    toast.error(errors.error || "Failed to delete the booking. Please try again.");
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Bookings", href: BookingController.index().url }, { title: `Booking #${booking.id}`, href: "#" }]}>
            <Head title={`Booking #${booking.id}`} />
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Booking #{booking.id}</h1>
                    <Link href={BookingController.index().url}>
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Booking Details</CardTitle>
                        {/* delete button */}
                        <div className="ml-auto">
                            <Button variant="destructive" className="text-white" onClick={handleDelete}>Delete Booking</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p>
                            <strong>Hotel:</strong> {booking.hotel.name}
                        </p>
                        <p>
                            <strong>Guest:</strong> {booking.user.name} ({booking.user.email})
                        </p>
                        <p>
                            <strong>Check-in:</strong> {booking.check_in}
                        </p>
                        <p>
                            <strong>Check-out:</strong> {booking.check_out}
                        </p>
                        <p>
                            <strong>Guests:</strong> {booking.guests}
                        </p>
                        <p>
                            <strong>Status:</strong> {booking.status}
                        </p>
                        <p>
                            <strong>Total Price:</strong> ${Number(booking.total_price).toLocaleString('en-US')}
                        </p>

                        <div>
                            <strong>Rooms:</strong>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                {booking.rooms.map((room) => (
                                    <li key={room.id}>
                                        {room.name} - ${room.pivot.price} ({room.pivot.guests} guests)
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
