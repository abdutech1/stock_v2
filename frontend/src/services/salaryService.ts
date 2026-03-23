// import api from "@/api/axios";

// export const salaryService = {
//   getAll: () => 
//     api.get("/salaries").then(res => res.data),

//   // New Preview Method
//   preview: (payload: { userId: number; rate: number; periodStart: Date; periodEnd: Date }) => 
//     api.post("/salary-preview", payload).then(res => res.data),

//   create: (payload: { userId: number; rate: number; periodStart: Date; periodEnd: Date }) => 
//     api.post("/salaries", payload).then(res => res.data),

//   getReport: (start?: Date, end?: Date) => 
//     api.get("/salaries/report", { 
//       params: { start, end } 
//     }).then(res => res.data),
    
//   delete: (id: number) => 
//     api.delete(`/salaries/${id}`).then(res => res.data),
// };


import api from "@/api/axios";

export const salaryService = {
  getAll: () => 
    api.get("/salaries").then(res => res.data),

  preview: (payload: { userId: number; rate: number; periodStart: Date; periodEnd: Date }) => 
    api.post("/salary-preview", payload).then(res => res.data),

  create: (payload: any) => 
    api.post("/salaries", payload).then(res => res.data),

  // Fetches aggregated totals for the dashboard cards
  getReport: (params?: { start: string; end: string }) => 
    api.get("/salaries/report", { params }).then(res => res.data),
    
  delete: (id: number) => 
    api.delete(`/salaries/${id}`).then(res => res.data),
};