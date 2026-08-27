import { MadrasaStudent, IMadrasaStudent } from "../models/madrasaStudent";
import { MadrasaTeacher, IMadrasaTeacher } from "../models/madrasaTeacher";

// ─── Student CRUD ──────────────────────────────────────────

export async function createStudent(data: Partial<IMadrasaStudent>) {
  return MadrasaStudent.create(data);
}

export async function getStudents(
  filter: Record<string, any> = {},
  pagination: { page: number; limit: number; skip: number }
) {
  const { page, limit, skip } = pagination;
  const query: Record<string, any> = {};

  if (filter.status) query.status = filter.status;
  if (filter.className) query.className = filter.className;
  if (filter.search) {
    query.$or = [
      { name: { $regex: filter.search, $options: "i" } },
      { fatherName: { $regex: filter.search, $options: "i" } },
      { phone: { $regex: filter.search, $options: "i" } },
    ];
  }

  const [data, total] = await Promise.all([
    MadrasaStudent.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
    MadrasaStudent.countDocuments(query),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getStudentById(id: string) {
  return MadrasaStudent.findById(id).lean();
}

export async function updateStudent(id: string, data: Partial<IMadrasaStudent>) {
  return MadrasaStudent.findByIdAndUpdate(id, data, { new: true }).lean();
}

export async function deleteStudent(id: string) {
  return MadrasaStudent.findByIdAndDelete(id);
}

// ─── Teacher CRUD ──────────────────────────────────────────

export async function createTeacher(data: Partial<IMadrasaTeacher>) {
  return MadrasaTeacher.create(data);
}

export async function getTeachers(
  filter: Record<string, any> = {},
  pagination: { page: number; limit: number; skip: number }
) {
  const { page, limit, skip } = pagination;
  const query: Record<string, any> = {};

  if (filter.status) query.status = filter.status;
  if (filter.search) {
    query.$or = [
      { name: { $regex: filter.search, $options: "i" } },
      { subject: { $regex: filter.search, $options: "i" } },
      { phone: { $regex: filter.search, $options: "i" } },
    ];
  }

  const [data, total] = await Promise.all([
    MadrasaTeacher.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
    MadrasaTeacher.countDocuments(query),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getTeacherById(id: string) {
  return MadrasaTeacher.findById(id).lean();
}

export async function updateTeacher(id: string, data: Partial<IMadrasaTeacher>) {
  return MadrasaTeacher.findByIdAndUpdate(id, data, { new: true }).lean();
}

export async function deleteTeacher(id: string) {
  return MadrasaTeacher.findByIdAndDelete(id);
}

// ─── Queries ───────────────────────────────────────────────

export async function getActiveStudents() {
  return MadrasaStudent.find({ status: "active" }).sort({ name: 1 }).lean();
}

export async function getActiveTeachers() {
  return MadrasaTeacher.find({ status: "active" }).sort({ name: 1 }).lean();
}

export async function getTotalTeacherSalary() {
  const result = await MadrasaTeacher.aggregate([
    { $match: { status: "active" } },
    { $group: { _id: null, total: { $sum: "$salary" }, count: { $sum: 1 } } },
  ]);

  return {
    totalSalary: result[0]?.total || 0,
    activeTeachers: result[0]?.count || 0,
  };
}
