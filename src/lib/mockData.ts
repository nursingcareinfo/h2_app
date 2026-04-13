export const STAFF_CATEGORIES = ["Nurse", "Attendant", "Caretaker", "Baby Sitter", "Doctor"];
export const PATIENT_STATUSES = ["Active", "Pending", "Completed", "Cancelled"];
export const KARACHI_AREAS = ["Korangi", "Gulshan", "Malir", "Clifton", "DHA", "Nazimabad", "Saddar", "North Karachi"];

export const mockKpis = [
  { title: "Total Active Staff", value: "1,321", change: "+12%", icon: "Users" },
  { title: "Available Now", value: "458", change: "-5%", icon: "CheckCircle" },
  { title: "Active Patients", value: "892", change: "+18%", icon: "HeartPulse" },
  { title: "Pending Cases", value: "124", change: "+2%", icon: "Clock" },
];

export const staffByCategory = [
  { name: "Nurse", value: 450 },
  { name: "Attendant", value: 380 },
  { name: "Caretaker", value: 290 },
  { name: "Baby Sitter", value: 150 },
  { name: "Doctor", value: 51 },
];

export const staffByArea = [
  { area: "Gulshan", count: 210 },
  { area: "Korangi", count: 185 },
  { area: "DHA", count: 160 },
  { area: "Clifton", count: 145 },
  { area: "Malir", count: 130 },
  { area: "Nazimabad", count: 110 },
  { area: "Saddar", count: 95 },
  { area: "North Karachi", count: 86 },
];

export const patientRegistrations = [
  { date: "2026-04-01", count: 12 },
  { date: "2026-04-02", count: 15 },
  { date: "2026-04-03", count: 10 },
  { date: "2026-04-04", count: 18 },
  { date: "2026-04-05", count: 22 },
  { date: "2026-04-06", count: 14 },
  { date: "2026-04-07", count: 19 },
  { date: "2026-04-08", count: 25 },
  { date: "2026-04-09", count: 21 },
  { date: "2026-04-10", count: 28 },
];

export const recentPatients = [
  { id: "1", name: "Ahmed Khan", area: "Gulshan", service: "24hr Nursing", status: "Active", staff: "Sana Malik" },
  { id: "2", name: "Fatima Bibi", area: "Korangi", service: "12hr Attendant", status: "Pending", staff: "Unassigned" },
  { id: "3", name: "Zubair Shah", area: "DHA", service: "8hr Caretaker", status: "Active", staff: "Imran Ali" },
  { id: "4", name: "Maryam Jameel", area: "Clifton", service: "24hr Nursing", status: "Active", staff: "Ayesha Khan" },
  { id: "5", name: "Bilal Qureshi", area: "Malir", service: "12hr Nursing", status: "Pending", staff: "Unassigned" },
];
