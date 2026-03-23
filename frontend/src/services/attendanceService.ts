
import api from "@/api/axios";
import { format } from "date-fns";

export const attendanceService = {
  // Get all attendance for a specific date
  getByDate: (date: Date) => 
    api.get("/attendance/date", { 
      params: { date: format(date, "yyyy-MM-dd") } 
    }).then(res => res.data),

  // Mark/Upsert attendance
  mark: (userId: number, date: Date, status: string) => 
    api.post("/attendance", { 
      userId, 
      date: format(date, "yyyy-MM-dd"), 
      status 
    }).then(res => res.data),

  // Get range for a specific user
  getByUser: (userId: number, start: Date, end: Date) => 
    api.get(`/attendance/user/${userId}`, {
      params: { 
        start: format(start, "yyyy-MM-dd"), 
        end: format(end, "yyyy-MM-dd") 
      },
    }).then(res => res.data),
    
    getBulkRange: (start: Date, end: Date) => 
    api.get("/attendance/bulk", {
      params: { 
        start: format(start, "yyyy-MM-dd"), 
        end: format(end, "yyyy-MM-dd") 
      },
    }).then(res => res.data),
};