import { Request, Response } from "express";
import {z} from 'zod'
import {
  markAttendance,
  getAttendanceByDate,
  getAttendanceByUser,
  getBulkAttendance
} from "../../services/attendance.service.js";
import { markAttendanceSchema,getAttendanceByDateQuerySchema } from "@/schemas/attendance.schema.js";

export async function markAttendanceController(req: Request, res: Response) {
  try {
    const { userId, date, status } = req.body as z.infer<typeof markAttendanceSchema>;
    const attendance = await markAttendance(userId, date, status);
    res.status(201).json(attendance);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

// export async function getAttendanceForDate(req: Request, res: Response) {
//   try {
//     const parsed = getAttendanceByDateQuerySchema.parse(req.query);
//     const date = parsed.date; 

//     const records = await getAttendanceByDate(date);
//     res.json(records);
//   } catch (error: any) {
//     res.status(400).json({ message: error.message });
//   }
// }


export async function getAttendanceForDate(req: Request, res: Response) {
  try {
    const parsed = getAttendanceByDateQuerySchema.parse(req.query);
    
    // Normalize the incoming date to the start of the day
    const date = new Date(parsed.date);
    date.setHours(0, 0, 0, 0); 

    const records = await getAttendanceByDate(date);
    res.json(records);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function getAttendanceForUser(
  req: Request,
  res: Response
) {
  try {
    const { userId } = req.params;
    const { start, end } = req.query;

    const records = await getAttendanceByUser(
      Number(userId),
      start ? new Date(String(start)) : undefined,
      end ? new Date(String(end)) : undefined
    );

    res.json(records);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}



// attendance.controller.ts
export async function getBulkAttendanceController(req: Request, res: Response) {
  try {
    const { start, end } = req.query;
    if (!start || !end) throw new Error("Start and end dates are required");

    const records = await getBulkAttendance(
      new Date(String(start)),
      new Date(String(end))
    );
    res.json(records);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}


