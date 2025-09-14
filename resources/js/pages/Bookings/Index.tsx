import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit } from "lucide-react";
import BookingController from "@/actions/App/Http/Controllers/BookingController";
import AppLayout from "@/layouts/app-layout";
import PaginationLinks from "@/components/pagination";
import { Pagination } from "@/types/hotel";
import { Badge } from "@/components/ui/badge";

interface Booking {
    id: number;
    check_in: string;
    check_out: string;
    status: string;
    total_price: string;
    hotel: {
        name: string;
    };
}

interface Props {
    bookings: {
        data: Booking[];
    } & Pagination;
}

export default function Index({ bookings }: Props) {
    const handlePageChange = (page: number) => {
        router.get(BookingController.index().url + `?page=${page}`, { preserveState: true, replace: true });
    }

    return (
        <AppLayout breadcrumbs={[{ title: "Bookings", href: BookingController.index().url }]}>
            <Head title="Bookings" />
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Bookings</h1>
                    <Link href={BookingController.create().url}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> New Booking
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4">
                    {bookings.data.map((booking) => (
                        <Card key={booking.id}>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>{booking.hotel.name}</CardTitle>
                                <div className="flex space-x-2">
                                    <Link href={BookingController.show(booking.id).url}>
                                        <Button variant="outline" size="sm">
                                            <Eye className="h-4 w-4" /> View
                                        </Button>
                                    </Link>
                                    <Link href={BookingController.edit(booking.id).url}>
                                        <Button variant="outline" size="sm">
                                            <Edit className="h-4 w-4" /> Edit
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                {/* format check in date */}
                                <p>Check-in: {new Date(booking.check_in).toLocaleString()}</p>
                                <p>Check-out: {new Date(booking.check_out).toLocaleString()}</p>
                                <p>Status: <Badge className="capitalize">{booking.status}</Badge></p>
                                <p>Total: ${Number(booking.total_price).toLocaleString('en-US')}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="my-4">
                    <PaginationLinks pagination={bookings as Pagination} onPageChange={handlePageChange} />
                </div>
            </div>
        </AppLayout>
    );
}
