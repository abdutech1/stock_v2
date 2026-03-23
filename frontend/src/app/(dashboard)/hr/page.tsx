// "use client";

// import { useState, useMemo } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { 
//   format, startOfMonth, endOfMonth, addDays, subDays, 
//   addMonths, subMonths, isSameDay 
// } from "date-fns";
// import { 
//   CheckCircle2, Clock, XCircle, ChevronLeft, ChevronRight, 
//   Loader2, CalendarDays, Users2, TrendingUp 
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { cn } from "@/lib/utils";
// import toast from "react-hot-toast";

// import { attendanceService } from "@/services/attendanceService";
// import { getEmployees } from "@/api/users.api";
// import Protected from "@/components/Protected";

// export type AttendanceStatus = "PRESENT" | "ABSENT" | "HALF_DAY";

// export default function HRPage() {
//   const queryClient = useQueryClient();
//   const [viewMode, setViewMode] = useState<"DAILY" | "SUMMARY">("DAILY");
//   const [currentDate, setCurrentDate] = useState(new Date());

//   // 1. Fetch Data
//   const { data: employees = [], isLoading: empLoading } = useQuery({
//     queryKey: ["employees"],
//     queryFn: getEmployees,
//   });

//   const activeStaff = useMemo(() => 
//     employees.filter((e: any) => e.isActive && e.role !== "OWNER"), 
//   [employees]);

//   // Fetch either Daily or Monthly Range based on viewMode
//   const range = useMemo(() => ({
//     start: viewMode === "DAILY" ? currentDate : startOfMonth(currentDate),
//     end: viewMode === "DAILY" ? currentDate : endOfMonth(currentDate),
//   }), [viewMode, currentDate]);

//   const { data: records = [], isLoading: dataLoading } = useQuery({
//     queryKey: ["attendance", viewMode, format(range.start, "yyyy-MM-dd")],
//     queryFn: () => attendanceService.getBulkRange(range.start, range.end),
//   });

//   // 2. Mark Attendance Mutation
//   const markMutation = useMutation({
//     mutationFn: ({ userId, status }: { userId: number; status: string }) =>
//       attendanceService.mark(userId, currentDate, status),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["attendance"] });
//       toast.success("Attendance Updated");
//     },
//   });

//   // 3. Transformation Logic
//   const dailyData = useMemo(() => {
//     return activeStaff.map((emp: any) => ({
//       ...emp,
//       status: records.find((r: any) => r.userId === emp.id && isSameDay(new Date(r.date), currentDate))?.status || "NOT_MARKED",
//     }));
//   }, [activeStaff, records, currentDate]);

//   const summaryData = useMemo(() => {
//     return activeStaff.map((emp: any) => {
//       const staffRecords = records.filter((r: any) => r.userId === emp.id);
//       const p = staffRecords.filter((r: any) => r.status === "PRESENT").length;
//       const h = staffRecords.filter((r: any) => r.status === "HALF_DAY").length;
//       const a = staffRecords.filter((r: any) => r.status === "ABSENT").length;
//       return { ...emp, p, h, a, total: p + (h * 0.5) };
//     });
//   }, [activeStaff, records]);

//   const handleNav = (direction: "prev" | "next") => {
//     const fn = viewMode === "DAILY" ? (direction === "prev" ? subDays : addDays) : (direction === "prev" ? subMonths : addMonths);
//     setCurrentDate(prev => fn(prev, 1));
//   };

//   if (empLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

//   return (
//     <Protected requireRole="OWNER">
//       <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        
//         {/* Header Section */}
//         <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
//           <div className="space-y-1">
//             <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-xs">
//               <TrendingUp size={14}/> HR Management
//             </div>
//             <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">
//               Staff <span className="text-indigo-600">Logs</span>
//             </h1>
//           </div>

//           <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner">
//             {["DAILY", "SUMMARY"].map((m) => (
//               <button
//                 key={m}
//                 onClick={() => setViewMode(m as any)}
//                 className={cn(
//                   "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
//                   viewMode === m ? "bg-white text-indigo-600 shadow-md" : "text-slate-400 hover:text-slate-600"
//                 )}
//               >
//                 {m}
//               </button>
//             ))}
//           </div>
//         </header>

//         {/* Date Control Bar */}
//         <div className="flex items-center justify-between bg-white border border-slate-100 p-3 rounded-[28px] shadow-xl shadow-slate-200/50">
//           <button onClick={() => handleNav("prev")} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors"><ChevronLeft/></button>
//           <div className="flex flex-col items-center">
//             <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">
//               {viewMode === "DAILY" ? format(currentDate, "EEEE") : "Monthly Report"}
//             </span>
//             <h2 className="text-lg font-black text-slate-900 uppercase italic">
//               {format(currentDate, viewMode === "DAILY" ? "MMMM dd, yyyy" : "MMMM yyyy")}
//             </h2>
//           </div>
//           <button onClick={() => handleNav("next")} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors"><ChevronRight/></button>
//         </div>

//         {/* Content Area */}
//         {dataLoading ? (
//           <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
//         ) : (
//           <AnimatePresence mode="wait">
//             {viewMode === "DAILY" ? (
//               <motion.div 
//                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
//                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
//               >
//                 {dailyData.map((staff) => (
//                  <StaffCard 
//   key={staff.id} 
//   staff={staff} 
  
//   onMark={(status: AttendanceStatus) => markMutation.mutate({ userId: staff.id, status })}
//   isMutating={markMutation.isPending && markMutation.variables?.userId === staff.id}
// />
//                 ))}
//               </motion.div>
//             ) : (
//               <motion.div 
//                 initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
//                 className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/40"
//               >
//                 <table className="w-full text-left border-collapse">
//                   <thead>
//                     <tr className="bg-slate-50/50 border-b border-slate-100">
//                       <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Employee</th>
//                       <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Stats</th>
//                       <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Effective Days</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-50">
//                     {summaryData.map((staff) => (
//                       <SummaryRow key={staff.id} staff={staff} />
//                     ))}
//                   </tbody>
//                 </table>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         )}
//       </div>
//     </Protected>
//   );
// }


// interface StaffCardProps {
//   staff: any; 
//   onMark: (status: AttendanceStatus) => void;
//   isMutating: boolean;
// }
// // Sub-components for cleaner code
// function StaffCard({ staff, onMark, isMutating }: StaffCardProps) {
//   const statuses: { id: AttendanceStatus; label: string; color: string; icon: any }[] = [
//     { id: "PRESENT", label: "Present", color: "emerald", icon: CheckCircle2 },
//     { id: "HALF_DAY", label: "Half Day", color: "amber", icon: Clock },
//     { id: "ABSENT", label: "Absent", color: "rose", icon: XCircle },
//   ];

//   return (
//     <div className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm hover:shadow-md transition-shadow">
//       <div className="flex items-center gap-4 mb-6">
//         <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm italic">
//           {staff.name.substring(0,2).toUpperCase()}
//         </div>
//         <div className="flex-1 min-w-0">
//           <h3 className="font-black text-slate-900 truncate uppercase tracking-tighter">{staff.name}</h3>
//           <p className="text-[10px] font-bold text-indigo-500 uppercase italic tracking-widest">{staff.role}</p>
//         </div>
//       </div>
      
//       <div className="grid grid-cols-3 gap-2">
        
//         {statuses.map((s) => (
//           <button
//             key={s.id}
//             disabled={isMutating}
//             onClick={() => onMark(s.id)}
//             className={cn(
//               "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all active:scale-95",
//               staff.status === s.id 
//                 ? `bg-${s.color}-50 border-${s.color}-200 text-${s.color}-600` 
//                 : "bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100"
//             )}
//           >
//             {isMutating ? <Loader2 size={16} className="animate-spin" /> : <s.icon size={16} />}
//             <span className="text-[8px] font-black uppercase">{s.label}</span>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

// function SummaryRow({ staff }: any) {
//   return (
//     <tr className="hover:bg-slate-50/50 transition-colors">
//       <td className="p-6">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs uppercase italic">{staff.name.charAt(0)}</div>
//           <div>
//             <p className="font-black text-slate-900 uppercase text-xs tracking-tighter">{staff.name}</p>
//             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{staff.role}</p>
//           </div>
//         </div>
//       </td>
//       <td className="p-6 text-center">
//         <div className="flex justify-center gap-4">
//           <div className="text-center">
//             <p className="text-xs font-black text-emerald-600">{staff.p}</p>
//             <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">P</p>
//           </div>
//           <div className="text-center">
//             <p className="text-xs font-black text-amber-600">{staff.h}</p>
//             <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">H</p>
//           </div>
//           <div className="text-center">
//             <p className="text-xs font-black text-rose-600">{staff.a}</p>
//             <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">A</p>
//           </div>
//         </div>
//       </td>
//       <td className="p-6 text-right">
//         <span className="text-xl font-black text-indigo-600 italic">{staff.total}</span>
//         <span className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-tighter">Days</span>
//       </td>
//     </tr>
//   );
// }



"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, subDays, addMonths, subMonths, addWeeks, subWeeks, isSameDay 
} from "date-fns";
import { 
  CheckCircle2, Clock, XCircle, ChevronLeft, ChevronRight, 
  Loader2, TrendingUp, Calendar 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

import { attendanceService } from "@/services/attendanceService";
import { getEmployees } from "@/api/users.api";
import Protected from "@/components/Protected";

// Types
export type AttendanceStatus = "PRESENT" | "ABSENT" | "HALF_DAY";
type ViewMode = "DAILY" | "WEEKLY" | "SUMMARY"; // SUMMARY = Monthly

export default function HRPage() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<ViewMode>("DAILY");
  const [currentDate, setCurrentDate] = useState(new Date());

  // 1. Fetch Staff
  const { data: employees = [], isLoading: empLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });

  const activeStaff = useMemo(() => 
    employees.filter((e: any) => e.isActive && e.role !== "OWNER"), 
  [employees]);

  // 2. Calculate Date Range based on ViewMode
  const range = useMemo(() => {
    switch (viewMode) {
      case "WEEKLY":
        return { start: startOfWeek(currentDate), end: endOfWeek(currentDate) };
      case "SUMMARY":
        return { start: startOfMonth(currentDate), end: endOfMonth(currentDate) };
      default:
        return { start: currentDate, end: currentDate };
    }
  }, [viewMode, currentDate]);

  // 3. Fetch Attendance Data
  const { data: records = [], isLoading: dataLoading } = useQuery({
    queryKey: ["attendance", viewMode, format(range.start, "yyyy-MM-dd")],
    queryFn: () => attendanceService.getBulkRange(range.start, range.end),
  });

  // 4. Mutations
  const markMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: number; status: AttendanceStatus }) =>
      attendanceService.mark(userId, currentDate, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      toast.success("Record updated");
    },
  });

  // 5. Data Transformation
  const dailyData = useMemo(() => {
    return activeStaff.map((emp: any) => ({
      ...emp,
      status: records.find((r: any) => 
        r.userId === emp.id && isSameDay(new Date(r.date), currentDate)
      )?.status || "NOT_MARKED",
    }));
  }, [activeStaff, records, currentDate]);

  const aggregateData = useMemo(() => {
    return activeStaff.map((emp: any) => {
      const staffRecords = records.filter((r: any) => r.userId === emp.id);
      const p = staffRecords.filter((r: any) => r.status === "PRESENT").length;
      const h = staffRecords.filter((r: any) => r.status === "HALF_DAY").length;
      const a = staffRecords.filter((r: any) => r.status === "ABSENT").length;
      return { ...emp, p, h, a, total: p + (h * 0.5) };
    });
  }, [activeStaff, records]);

  // Navigation Logic
  const handleNav = (direction: "prev" | "next") => {
    const isNext = direction === "next";
    setCurrentDate(prev => {
      if (viewMode === "DAILY") return isNext ? addDays(prev, 1) : subDays(prev, 1);
      if (viewMode === "WEEKLY") return isNext ? addWeeks(prev, 1) : subWeeks(prev, 1);
      return isNext ? addMonths(prev, 1) : subMonths(prev, 1);
    });
  };

  if (empLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <Protected requireRole="OWNER">
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-[10px]">
              <TrendingUp size={14}/> Management Dashboard
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">
              Staff <span className="text-indigo-600">Logs</span>
            </h1>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
            {(["DAILY", "WEEKLY", "SUMMARY"] as ViewMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                  viewMode === m ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {m === "SUMMARY" ? "Monthly" : m}
              </button>
            ))}
          </div>
        </header>

        {/* Date Selector */}
        <div className="flex items-center justify-between bg-white border border-slate-100 p-3 rounded-[28px] shadow-xl shadow-slate-200/50">
          <button onClick={() => handleNav("prev")} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors"><ChevronLeft/></button>
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em]">
              {viewMode === "DAILY" ? format(currentDate, "EEEE") : "Range View"}
            </span>
            <h2 className="text-sm md:text-lg font-black text-slate-900 uppercase italic flex items-center gap-2">
              <Calendar size={16} className="text-slate-300" />
              {viewMode === "DAILY" && format(currentDate, "MMMM dd, yyyy")}
              {viewMode === "WEEKLY" && `${format(range.start, "MMM dd")} - ${format(range.end, "MMM dd, yyyy")}`}
              {viewMode === "SUMMARY" && format(currentDate, "MMMM yyyy")}
            </h2>
          </div>
          <button onClick={() => handleNav("next")} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors"><ChevronRight/></button>
        </div>

        {/* Main View */}
        {dataLoading ? (
          <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === "DAILY" ? (
              <motion.div 
                key="daily" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {dailyData.map((staff) => (
                  <StaffCard 
                    key={staff.id} 
                    staff={staff} 
                    onMark={(status) => markMutation.mutate({ userId: staff.id, status })}
                    isMutating={markMutation.isPending && markMutation.variables?.userId === staff.id}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="aggregate" initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.99 }}
                className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/40"
              >
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Employee</th>
                      <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Status Counts</th>
                      <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Payable Days</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {aggregateData.map((staff) => (
                      <SummaryRow key={staff.id} staff={staff} />
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </Protected>
  );
}

// Helper Components
interface StaffCardProps {
  staff: any;
  onMark: (status: AttendanceStatus) => void;
  isMutating: boolean;
}

function StaffCard({ staff, onMark, isMutating }: StaffCardProps) {
  const statuses: { id: AttendanceStatus; label: string; icon: any; activeClass: string }[] = [
    { id: "PRESENT", label: "Present", icon: CheckCircle2, activeClass: "bg-emerald-50 border-emerald-200 text-emerald-700" },
    { id: "HALF_DAY", label: "Half", icon: Clock, activeClass: "bg-amber-50 border-amber-200 text-amber-700" },
    { id: "ABSENT", label: "Absent", icon: XCircle, activeClass: "bg-rose-50 border-rose-200 text-rose-700" },
  ];

  return (
    <div className="bg-white border border-slate-100 p-5 rounded-[30px] shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xs italic group-hover:scale-110 transition-transform">
          {staff.name.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <h3 className="font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">{staff.name}</h3>
          <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">{staff.role}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {statuses.map((s) => (
          <button
            key={s.id}
            disabled={isMutating}
            onClick={() => onMark(s.id)}
            className={cn(
              "flex flex-col items-center gap-2 py-3 rounded-2xl border transition-all",
              staff.status === s.id ? s.activeClass : "bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100"
            )}
          >
            {isMutating ? <Loader2 size={14} className="animate-spin" /> : <s.icon size={14} />}
            <span className="text-[8px] font-black uppercase tracking-tighter">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SummaryRow({ staff }: any) {
  return (
    <tr className="hover:bg-indigo-50/20 transition-colors">
      <td className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center font-black text-xs italic">
            {staff.name.charAt(0)}
          </div>
          <div>
            <p className="font-black text-slate-900 uppercase text-xs tracking-tighter">{staff.name}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{staff.role}</p>
          </div>
        </div>
      </td>
      <td className="p-6">
        <div className="flex justify-center gap-6">
          <StatMini label="P" count={staff.p} color="text-emerald-600" />
          <StatMini label="H" count={staff.h} color="text-amber-600" />
          <StatMini label="A" count={staff.a} color="text-rose-600" />
        </div>
      </td>
      <td className="p-6 text-right">
        <div className="flex flex-col items-end">
          <span className="text-xl font-black text-indigo-600 italic leading-none">{staff.total}</span>
          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Calculated</span>
        </div>
      </td>
    </tr>
  );
}

function StatMini({ label, count, color }: { label: string, count: number, color: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className={cn("text-xs font-black", color)}>{count}</span>
      <span className="text-[8px] font-black text-slate-300">{label}</span>
    </div>
  );
}