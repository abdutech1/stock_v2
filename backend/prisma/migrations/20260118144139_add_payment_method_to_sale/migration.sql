/*
  Warnings:

  - Added the required column `paymentMethod` to the `sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sale` ADD COLUMN `bankName` VARCHAR(191) NULL,
    ADD COLUMN `paymentMethod` ENUM('CASH', 'BANK') NOT NULL;

-- CreateIndex
CREATE INDEX `SalaryPayment_userId_fkey` ON `salarypayment`(`userId`);
