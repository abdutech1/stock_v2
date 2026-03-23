/*
  Warnings:

  - The values [WEEKLY_TOTAL,SINGLE_CUSTOMER] on the enum `bonusPayment_type` will be removed. If these variants are still used in the database, this will fail.
  - The values [WEEKLY_TOTAL,SINGLE_CUSTOMER] on the enum `bonusPayment_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `weeklybonus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `weeklybonus` DROP FOREIGN KEY `weeklyBonus_userId_fkey`;

-- AlterTable
ALTER TABLE `bonuspayment` MODIFY `type` ENUM('PERIOD_TOTAL', 'SINGLE_SALE', 'GLOBAL') NOT NULL;

-- AlterTable
ALTER TABLE `bonusrule` MODIFY `type` ENUM('PERIOD_TOTAL', 'SINGLE_SALE', 'GLOBAL') NOT NULL;

-- DropTable
DROP TABLE `weeklybonus`;
