/*
  Warnings:

  - A unique constraint covering the columns `[type,minAmount,isActive]` on the table `bonusRule` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `bonusRule_type_minAmount_isActive_key` ON `bonusRule`(`type`, `minAmount`, `isActive`);
