export interface Guest {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    country: string;
}

export interface BookingData {
    rooms: Guest[];
}
