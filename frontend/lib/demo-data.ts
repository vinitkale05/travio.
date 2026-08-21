export const GOA_DATA = {
    title: "Goa March 2026",
    destination: "Goa, India",
    startDate: new Date("2026-03-10"),
    endDate: new Date("2026-03-14"),
    coverImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2000&auto=format&fit=crop",
    inviteCode: "GOA2026",
    isDemo: true,
    days: [
        {
            label: "Day 1 — Mar 10", date: new Date("2026-03-10"), activities: [
                { title: "Baga Beach Arrival", time: "10:00 AM", location: "Calangute", category: "Leisure", cost: 0 },
                { title: "Lunch at Curlies", time: "1:30 PM", location: "Anjuna", category: "Food", cost: 1200 },
                { title: "Fort Aguada Sunset", time: "5:30 PM", location: "Candolim", category: "Sightseeing", cost: 0 },
                { title: "Dinner at Thalassa", time: "8:30 PM", location: "Siolim", category: "Food", cost: 4500 },
            ]
        },
        {
            label: "Day 2 — Mar 11", date: new Date("2026-03-11"), activities: [
                { title: "Scuba Diving", time: "08:30 AM", location: "Grand Island", category: "Adventure", cost: 3500 },
                { title: "Island Tour", time: "1:00 PM", location: "Bat Island", category: "Sightseeing", cost: 500 },
                { title: "Old Goa Church Visit", time: "4:00 PM", location: "Velha Goa", category: "Sightseeing", cost: 0 },
                { title: "Panjim Casino Night", time: "9:00 PM", location: "Panjim Mandovi River", category: "Nightlife", cost: 5000 },
            ]
        },
        {
            label: "Day 3 — Mar 12", date: new Date("2026-03-12"), activities: [
                { title: "Dudhsagar Falls", time: "08:00 AM", location: "Mollem", category: "Sightseeing", cost: 2500 },
                { title: "Spice Plantation Lunch", time: "2:00 PM", location: "Ponda", category: "Food", cost: 800 },
                { title: "Beach Volleyball", time: "5:00 PM", location: "Majorda", category: "Leisure", cost: 0 },
            ]
        },
        {
            label: "Day 4 — Mar 13", date: new Date("2026-03-13"), activities: [
                { title: "Shopping at Mapusa", time: "11:00 AM", location: "Mapusa Market", category: "Activity", cost: 2000 },
                { title: "Sunset Cruise", time: "5:30 PM", location: "Mandovi River", category: "Sightseeing", cost: 1500 },
            ]
        },
        {
            label: "Day 5 — Mar 14", date: new Date("2026-03-14"), activities: [
                { title: "Checkout and Breakfast", time: "09:30 AM", location: "Resort", category: "Stay", cost: 0 },
                { title: "Drive to Airport", time: "11:00 AM", location: "Dabolim", category: "Transport", cost: 1200 },
            ]
        },
    ],
    checklist: [
        { text: "Swimwear", done: true, category: "Clothing" },
        { text: "Sunscreen", done: true, category: "Toiletries" },
        { text: "Powerbank", done: false, category: "Electronics" },
        { text: "Camera", done: false, category: "Electronics" },
    ],
    files: [
        { name: "Flight_BOM_GOI.pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", bytes: 1450000, documentCategory: "flight", createdAt: new Date("2026-02-10") },
        { name: "W_Goa_Confirmation.pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", bytes: 2300000, documentCategory: "hotel", createdAt: new Date("2026-02-12") },
    ],
};

export const MANALI_DATA = {
    title: "Manali Adventure",
    destination: "Manali, Himachal Pradesh",
    startDate: new Date("2026-05-15"),
    endDate: new Date("2026-05-20"),
    coverImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2000&auto=format&fit=crop",
    inviteCode: "MANALI26",
    isDemo: true,
    days: [
        {
            label: "Day 1 — Arrival", date: new Date("2026-05-15"), activities: [
                { title: "Check-in at Cottage", time: "2:00 PM", location: "Nasogi", category: "Stay", cost: 0 },
                { title: "Mall Road Stroll", time: "4:00 PM", location: "Manali Center", category: "Shopping", cost: 0 },
                { title: "Hadimba Temple", time: "6:00 PM", location: "Dhungri", category: "Sightseeing", cost: 0 },
                { title: "Dinner at Johnson Lodge", time: "8:30 PM", location: "Manali", category: "Food", cost: 2500 },
            ]
        },
        {
            label: "Day 2 — Solang Valley", date: new Date("2026-05-16"), activities: [
                { title: "Paragliding", time: "10:00 AM", location: "Solang", category: "Adventure", cost: 3200 },
                { title: "Ziplining", time: "1:00 PM", location: "Solang", category: "Adventure", cost: 800 },
                { title: "Cafe Hopping in Old Manali", time: "7:00 PM", location: "Old Manali", category: "Food", cost: 2000 },
            ]
        },
        {
            label: "Day 3 — Rohtang Pass", date: new Date("2026-05-17"), activities: [
                { title: "Morning Drive to Rohtang", time: "06:00 AM", location: "Rohtang", category: "Transport", cost: 4000 },
                { title: "Snow Activities", time: "10:00 AM", location: "Rohtang Pass", category: "Adventure", cost: 1500 },
                { title: "River Rafting", time: "4:00 PM", location: "Beas River", category: "Adventure", cost: 1200 },
            ]
        },
        {
            label: "Day 4 — Kasol Trip", date: new Date("2026-05-18"), activities: [
                { title: "Drive to Kasol", time: "09:00 AM", location: "Parvati Valley", category: "Transport", cost: 2000 },
                { title: "Manikaran Sahib", time: "12:00 PM", location: "Manikaran", category: "Sightseeing", cost: 0 },
                { title: "Cafe Relaxing", time: "2:30 PM", location: "Kasol", category: "Food", cost: 1200 },
            ]
        },
        {
            label: "Day 5 — Vashisht Village", date: new Date("2026-05-19"), activities: [
                { title: "Hot Springs", time: "10:00 AM", location: "Vashisht", category: "Leisure", cost: 0 },
                { title: "Jogini Waterfall Trek", time: "12:00 PM", location: "Vashisht", category: "Adventure", cost: 0 },
                { title: "Souvenir Shopping", time: "6:00 PM", location: "Mall Road", category: "Shopping", cost: 3000 },
            ]
        },
        {
            label: "Day 6 — Departure", date: new Date("2026-05-20"), activities: [
                { title: "Breakfast at Cafe 1947", time: "09:00 AM", location: "Old Manali", category: "Food", cost: 800 },
                { title: "Bus to Delhi", time: "12:00 PM", location: "Volvo Stand", category: "Transport", cost: 3000 },
            ]
        },
    ],
    checklist: [
        { text: "Thermal wear", done: true, category: "Clothing" },
        { text: "Boots", done: true, category: "Clothing" },
        { text: "Gloves", done: false, category: "Clothing" },
        { text: "Raincoat", done: false, category: "Clothing" },
        { text: "Painkillers", done: true, category: "Medical" },
        { text: "Bandages", done: false, category: "Medical" },
    ],
    files: [
        { name: "Volvo_Bus_Tickets.pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", bytes: 850000, documentCategory: "car", createdAt: new Date("2026-03-01") },
        { name: "Himalayan_Insurance.pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", bytes: 420000, documentCategory: "insurance", createdAt: new Date("2026-03-05") }
    ],
};
