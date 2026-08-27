import { Settings } from "../models/settings";

const DEFAULT_SETTINGS = {
  mosqueName: "Madni Masjid",
  address: "",
  phone: "",
  email: "",
  currency: "PKR",
  dateFormat: "dd MMM yyyy",
};

export async function getSettings() {
  let settings = await Settings.findOne().lean();
  if (!settings) {
    const created = await Settings.create(DEFAULT_SETTINGS);
    settings = JSON.parse(JSON.stringify(created));
  }
  return settings;
}

export async function updateSettings(data: Record<string, unknown>) {
  return Settings.findOneAndUpdate({}, { $set: data }, { new: true, upsert: true }).lean();
}
