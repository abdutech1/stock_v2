/*
  Warnings:

  - A unique constraint covering the columns `[type,minAmount]` on the table `bonusRule` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `bonusRule_type_minAmount_isActive_key` ON `bonusrule`;

-- CreateIndex
CREATE UNIQUE INDEX `bonusRule_type_minAmount_key` ON `bonusRule`(`type`, `minAmount`);
