import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import BookingController from "@/actions/App/Http/Controllers/BookingController";
import AppLayout from "@/layouts/app-layout";

interface Room {
    id: number;
    name: string;
    price: string;
}

interface Hotel {
    id: number;
    name: string;
    rooms: Room[];
}

interface Props {
    hotels: Hotel[];
}

export default function Create({ hotels }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        hotel_id: "",
        room_ids: [] as number[],
        check_in: "",
        check_out: "",
        guests: 1,
    });

    const toggleRoom = (roomId: number) => {
        setData(
            "room_ids",
            data.room_ids.includes(roomId)
                ? data.room_ids.filter((id) => id !== roomId)
                : [...data.room_ids, roomId]
        );
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(BookingController.store().url);
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Bookings", href: BookingController.index().url }, { title: "New Booking", href: "#" }]}>
            <Head title="New Booking" />
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">New Booking</h1>
                    <Link href={BookingController.index().url}>
                        <Button variant="outline">Back</Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Create Booking</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <Label htmlFor="hotel">Hotel</Label>
                                <select
                                    id="hotel"
                                    className="w-full border rounded p-2"
                                    value={data.hotel_id}
                                    onChange={(e) => setData("hotel_id", e.target.value)}
                                >
                                    <option value="">Select a hotel</option>
                                    {hotels.map((hotel) => (
                                        <option key={hotel.id} value={hotel.id}>
                                            {hotel.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.hotel_id && (
                                    <p className="text-red-500 text-sm">{errors.hotel_id}</p>
                                )}
                            </div>

                            {data.hotel_id && (
                                <div>
                                    <Label>Rooms</Label>
                                    <div className="grid gap-2 mt-2">
                                        {hotels
                                            .find((h) => h.id === Number(data.hotel_id))
                                            ?.rooms.map((room) => (
                                                <label
                                                    key={room.id}
                                                    className="flex items-center gap-2 border rounded p-2"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={data.room_ids.includes(room.id)}
                                                        onChange={() => toggleRoom(room.id)}
                                                    />
                                                    <span>
                                                        {room.name} (${room.price})
                                                    </span>
                                                </label>
                                            ))}
                                    </div>
                                    {errors.room_ids && (
                                        <p className="text-red-500 text-sm">{errors.room_ids}</p>
                                    )}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="check_in">Check-in</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="date"
                                            id="check_in"
                                            value={data.check_in}
                                            onChange={(e) => setData("check_in", e.target.value)}
                                        />
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                    </div>
                                    {errors.check_in && (
                                        <p className="text-red-500 text-sm">{errors.check_in}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="check_out">Check-out</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="date"
                                            id="check_out"
                                            value={data.check_out}
                                            onChange={(e) => setData("check_out", e.target.value)}
                                        />
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                    </div>
                                    {errors.check_out && (
                                        <p className="text-red-500 text-sm">{errors.check_out}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="guests">Guests</Label>
                                <Input
                                    type="number"
                                    id="guests"
                                    min={1}
                                    value={data.guests}
                                    onChange={(e) => setData("guests", Number(e.target.value))}
                                />
                                {errors.guests && (
                                    <p className="text-red-500 text-sm">{errors.guests}</p>
                                )}
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing ? "Saving..." : "Save"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
