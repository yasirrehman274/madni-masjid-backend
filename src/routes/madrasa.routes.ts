import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  createStudentSchema,
  updateStudentSchema,
  createTeacherSchema,
  updateTeacherSchema,
} from "../validators/madrasa";
import * as ctrl from "../controllers/madrasa.controller";

const studentRouter = Router();

studentRouter.get("/", authenticate, ctrl.getStudents);
studentRouter.get("/:id", authenticate, ctrl.getStudentById);
studentRouter.post("/", authenticate, authorize("admin", "accountant"), validate(createStudentSchema), ctrl.createStudent);
studentRouter.put("/:id", authenticate, authorize("admin", "accountant"), validate(updateStudentSchema), ctrl.updateStudent);
studentRouter.delete("/:id", authenticate, authorize("admin", "accountant"), ctrl.deleteStudent);

const teacherRouter = Router();

teacherRouter.get("/", authenticate, ctrl.getTeachers);
teacherRouter.get("/:id", authenticate, ctrl.getTeacherById);
teacherRouter.post("/", authenticate, authorize("admin", "accountant"), validate(createTeacherSchema), ctrl.createTeacher);
teacherRouter.put("/:id", authenticate, authorize("admin", "accountant"), validate(updateTeacherSchema), ctrl.updateTeacher);
teacherRouter.delete("/:id", authenticate, authorize("admin", "accountant"), ctrl.deleteTeacher);

export { studentRouter as madrasaStudentRouter, teacherRouter as madrasaTeacherRouter };
