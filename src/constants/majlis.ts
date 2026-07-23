import type { Majlis } from "../types/majlis";

export const categories = [
  "All",
  "Dars",
  "Ladies Majlis",
  "Gents Majlis",
  "Niaz Place",
  "Jaloos",
];

export const filters = [
  "Upcoming soonest first",
  "Oldest first",
  "Nearest distance first",
];

export const distanceOptions = [5, 10, 15, 20];

export const dummyMajlisCard: Majlis[] = [
  {
    id: 1,
    name: "Majlis e Aza Imam Hussain (A.S)",
    category: "Gents Majlis",
    time: "Today at 8:30 P.m",
    date: "16 July 2026",
    location: "Jamia tul Muntazar Lahore",
    distance: "2 km from your current location",
    distanceKm: 2,
    timeOrder: 1,
    latitude: 31.5204,
    longitude: 74.3587,
  },
  {
    id: 2,
    name: "Dars at Markazi Imambargah",
    category: "Dars",
    time: "Tomorrow at 6:00 PM",
    date: "16 July 2026",
    location: "Model Town, Lahore",
    distance: "3 km from your current location",
    distanceKm: 3,
    timeOrder: 2,
    latitude: 31.531,
    longitude: 74.352,
  },
  {
    id: 3,
    name: "Ladies Majlis at Hussainia Hall",
    category: "Ladies Majlis",
    time: "Friday at 5:00 PM",
    date: "18 July 2026",
    location: "Johar Town, Lahore",
    distance: "7 km from your current location",
    distanceKm: 7,
    timeOrder: 3,
    latitude: 31.4697,
    longitude: 74.2728,
  },
];
