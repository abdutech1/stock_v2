import prisma from "../prismaClient.js";

import { sendTelegramMessage } from "../utils/telegram.js";

const CRITICAL_STOCK_LEVEL = 3;

export async function runDailyStockAlert() {
  const today = new Date();

  const lowStockItems = await prisma.pricecategory.findMany({
    where: {
      isActive: true,
      stock: {
        quantity: { lt: CRITICAL_STOCK_LEVEL },
      },
    },
    include: {
      category: true,
      stock: true,
    },
  });

  if (lowStockItems.length === 0) return;

  const alerts: string[] = [];

  for (const item of lowStockItems) {
    const existing = await prisma.stockAlert.findUnique({
      where: { priceCategoryId: item.id },
    });

    if (
      existing &&
      new Date(existing.lastSentAt).toDateString() === today.toDateString()
    ) {
      continue;
    }

    alerts.push(
      `• ${item.category.name} – ${item.fixedPrice} birr\n` +
      `  Stock: ${item.stock?.quantity ?? 0} unit(s)`
    );

    await prisma.stockAlert.upsert({
      where: { priceCategoryId: item.id },
      update: { lastSentAt: today },
      create: {
        priceCategoryId: item.id,
        lastSentAt: today,
      },
    });
  }

  if (alerts.length === 0) return;

  const message =
    `🔴 CRITICAL STOCK ALERT\n\n` +
    alerts.join("\n\n") +
    `\n\n🕒 ${today.toLocaleString()}\n` +
    `⚠️ Immediate restock required`;

  await sendTelegramMessage(message);
}


// runDailyStockAlert()
//   .then(() => {
//     console.log("Daily stock alert job finished");
//     process.exit(0);
//   })
//   .catch((err) => {
//     console.error("Daily stock alert job failed:", err);
//     process.exit(1);
//   });
