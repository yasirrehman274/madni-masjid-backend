import { Request, Response } from "express";
import { parsePagination, apiResponse, paginate } from "../utils/helpers";
import * as madrasaService from "../services/madrasa.service";

export async function createStudent(req: Request, res: Response) {
  try {
    const student = await madrasaService.createStudent(req.body);
    res.status(201).json(apiResponse(true, "Student added", { student }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    res.status(400).json(apiResponse(false, message));
  }
}

export async function getStudents(req: Request, res: Response) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter: Record<string, string> = {};
    if (req.query.status) filter.status = req.query.status as string;
    if (req.query.className) filter.className = req.query.className as string;
    if (req.query.search) filter.search = req.query.search as string;
    const result = await madrasaService.getStudents(filter, { page, limit, skip });
    res.json(apiResponse(true, undefined, { data: result.data, pagination: paginate(page, limit, result.total) }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function getStudentById(req: Request, res: Response) {
  try {
    const student = await madrasaService.getStudentById(String(req.params.id));
    if (!student) {
      res.status(404).json(apiResponse(false, "Student not found"));
      return;
    }
    res.json(apiResponse(true, undefined, { student }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function updateStudent(req: Request, res: Response) {
  try {
    const student = await madrasaService.updateStudent(String(req.params.id), req.body);
    if (!student) {
      res.status(404).json(apiResponse(false, "Student not found"));
      return;
    }
    res.json(apiResponse(true, "Student updated", { student }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function deleteStudent(req: Request, res: Response) {
  try {
    const student = await madrasaService.deleteStudent(String(req.params.id));
    if (!student) {
      res.status(404).json(apiResponse(false, "Student not found"));
      return;
    }
    res.json(apiResponse(true, "Student deleted"));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function createTeacher(req: Request, res: Response) {
  try {
    const teacher = await madrasaService.createTeacher(req.body);
    res.status(201).json(apiResponse(true, "Teacher added", { teacher }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    res.status(400).json(apiResponse(false, message));
  }
}

export async function getTeachers(req: Request, res: Response) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter: Record<string, string> = {};
    if (req.query.status) filter.status = req.query.status as string;
    if (req.query.search) filter.search = req.query.search as string;
    const result = await madrasaService.getTeachers(filter, { page, limit, skip });
    res.json(apiResponse(true, undefined, { data: result.data, pagination: paginate(page, limit, result.total) }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function getTeacherById(req: Request, res: Response) {
  try {
    const teacher = await madrasaService.getTeacherById(String(req.params.id));
    if (!teacher) {
      res.status(404).json(apiResponse(false, "Teacher not found"));
      return;
    }
    res.json(apiResponse(true, undefined, { teacher }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function updateTeacher(req: Request, res: Response) {
  try {
    const teacher = await madrasaService.updateTeacher(String(req.params.id), req.body);
    if (!teacher) {
      res.status(404).json(apiResponse(false, "Teacher not found"));
      return;
    }
    res.json(apiResponse(true, "Teacher updated", { teacher }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function deleteTeacher(req: Request, res: Response) {
  try {
    const teacher = await madrasaService.deleteTeacher(String(req.params.id));
    if (!teacher) {
      res.status(404).json(apiResponse(false, "Teacher not found"));
      return;
    }
    res.json(apiResponse(true, "Teacher deleted"));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}
