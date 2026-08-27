import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { env } from "../config/env";
import { User } from "../models/user";
import { Fund } from "../models/fund";
import { Donor } from "../models/donor";
import { Donation } from "../models/donation";
import { Expense } from "../models/expense";
import { Receipt } from "../models/receipt";

const funds = [
  { name: "Masjid Construction", type: "construction", description: "Fund for mosque construction and renovation", status: "active" },
  { name: "Madrasa Education", type: "madrasa", description: "Madrasa educational expenses", status: "active" },
  { name: "Zakat Fund", type: "zakat", description: "Zakat distribution to eligible recipients", status: "active" },
  { name: "Fitrana Fund", type: "fitrana", description: "Eid Fitrana collection and distribution", status: "active" },
  { name: "Khairat Fund", type: "khairat", description: "Charitable activities and community support", status: "active" },
  { name: "General Fund", type: "general", description: "General mosque operational expenses", status: "active" },
];

const donors = [
  { name: "Ahmed Khan", phone: "+92-300-1234567", address: "Karachi, Pakistan", notes: "Regular donor" },
  { name: "Fatima Ali", phone: "+92-321-9876543", address: "Lahore, Pakistan", notes: "" },
  { name: "Muhammad Hassan", phone: "+92-333-5551234", address: "Islamabad, Pakistan", notes: "Board member" },
  { name: "Ayesha Siddiqui", phone: "+92-300-7778899", address: "Peshawar, Pakistan", notes: "" },
  { name: "Omar Farooq", phone: "+92-311-2223344", address: "Rawalpindi, Pakistan", notes: "Monthly donor" },
  { name: "Zainab Bibi", phone: "+92-345-6667788", address: "Faisalabad, Pakistan", notes: "" },
];

async function seed() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const adminExists = await User.findOne({ email: env.ADMIN_EMAIL });
    if (!adminExists) {
      const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
      await User.create({ name: env.ADMIN_NAME, email: env.ADMIN_EMAIL, passwordHash, role: "admin", status: "active" });
      console.log("Admin user created");
    }

    const existingFunds = await Fund.countDocuments();
    if (existingFunds > 0) {
      console.log("Data already seeded. Skipping.");
      await mongoose.disconnect();
      return;
    }

    const createdFunds = await Fund.insertMany(funds);
    const createdDonors = await Donor.insertMany(donors);

    const fundIds = createdFunds.map((f) => f._id.toString());
    const donorIds = createdDonors.map((d) => d._id.toString());

    const donationDocs = [
      { donorId: donorIds[0], fundId: fundIds[0], amount: 250000, paymentMethod: "bank", date: new Date("2026-01-10"), reference: "BANK-001", notes: "Monthly" },
      { donorId: donorIds[1], fundId: fundIds[0], amount: 200000, paymentMethod: "cash", date: new Date("2026-02-15"), reference: "", notes: "" },
      { donorId: donorIds[2], fundId: fundIds[1], amount: 150000, paymentMethod: "online", date: new Date("2026-03-01"), reference: "ONL-001", notes: "Madrasa support" },
      { donorId: donorIds[3], fundId: fundIds[2], amount: 85000, paymentMethod: "cash", date: new Date("2026-04-10"), reference: "", notes: "Zakat" },
      { donorId: donorIds[4], fundId: fundIds[5], amount: 45000, paymentMethod: "online", date: new Date("2026-05-15"), reference: "ONL-002", notes: "" },
      { donorId: donorIds[5], fundId: fundIds[4], amount: 30000, paymentMethod: "cheque", date: new Date("2026-06-01"), reference: "CHQ-001", notes: "" },
    ];

    const createdDonations = await Donation.insertMany(donationDocs);
    console.log(`${createdDonations.length} donations created`);

    const receiptDocs = createdDonations.map((d, i) => ({
      receiptNumber: `DON-2026-${String(i + 1).padStart(4, "0")}`,
      donationId: d._id,
      donorId: d.donorId,
      fundId: d.fundId,
      amount: d.amount,
      paymentMethod: d.paymentMethod,
      date: d.date,
    }));

    await Receipt.insertMany(receiptDocs);
    console.log(`${receiptDocs.length} receipts created`);

    const expenseDocs = [
      { fundId: fundIds[5], category: "Utilities", description: "Electricity bill", amount: 15000, paymentMethod: "cash", date: new Date("2026-01-20"), vendor: "K-Electric", notes: "" },
      { fundId: fundIds[1], category: "Salary", description: "Teacher salaries", amount: 120000, paymentMethod: "bank", date: new Date("2026-03-30"), vendor: "", notes: "" },
      { fundId: fundIds[2], category: "Distribution", description: "Zakat distribution", amount: 75000, paymentMethod: "cash", date: new Date("2026-04-15"), vendor: "", notes: "" },
      { fundId: fundIds[5], category: "Maintenance", description: "Plumbing repairs", amount: 5000, paymentMethod: "cash", date: new Date("2026-05-10"), vendor: "Local Plumber", notes: "" },
    ];

    await Expense.insertMany(expenseDocs);
    console.log(`${expenseDocs.length} expenses created`);

    console.log("Seed completed successfully");
    await mongoose.disconnect();
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seed();
