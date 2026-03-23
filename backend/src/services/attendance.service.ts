import prisma from "../prismaClient.js";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "HALF_DAY";

export async function markAttendance(
  userId: number,
  date: Date,
  status: AttendanceStatus
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === "OWNER") {
    throw new Error("Owner does not require attendance");
  }

  return prisma.attendance.upsert({
    where: {
      userId_date: {
        userId,
        date,
      },
    },
    update: {
      status,
    },
    create: {
      userId,
      date,
      status,
    },
  });
}

export async function getAttendanceByDate(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return prisma.attendance.findMany({
    where: {
      date: {
        gte: start,
        lte: end,
      },
    },
    include: {
      user: true,
    },
    orderBy: {
      userId: "asc",
    },
  });
}


export async function getAttendanceByUser(
  userId: number,
  start?: Date,
  end?: Date
) {
  return prisma.attendance.findMany({
    where: {
      userId,
      date: {
        gte: start,
        lte: end,
      },
    },
    orderBy: { date: "asc" },
  });
}


// services/attendance.service.ts
export async function getBulkAttendance(start: Date, end: Date) {
  return prisma.attendance.findMany({
    where: {
      date: {
        gte: start,
        lte: end,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          role: true,
          isActive: true,
        }
      }
    },
    orderBy: { date: "asc" },
  });
}