import { z } from "zod";

export const attendanceStatusEnum = z.enum(["PRESENT", "ABSENT", "HALF_DAY"]);

export const markAttendanceSchema = z.object({
  userId: z.coerce.number().int().positive(),
  date:   z.coerce.date(),             
  status: attendanceStatusEnum,
});

export const getAttendanceByDateQuerySchema = z.object({
  date: z.coerce.date(),
});

export const getAttendanceByUserQuerySchema = z.object({
  start: z.coerce.date().optional(),
  end:   z.coerce.date().optional(),
});