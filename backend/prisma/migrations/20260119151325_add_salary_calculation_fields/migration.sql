/*
  Warnings:

  - Added the required column `paymentType` to the `salarypayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rate` to the `salarypayment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `salarypayment` DROP FOREIGN KEY `SalaryPayment_userId_fkey`;

-- AlterTable
ALTER TABLE `salarypayment` ADD COLUMN `daysWorked` INTEGER NULL,
    ADD COLUMN `paymentType` ENUM('DAILY', 'WEEKLY', 'CUSTOM') NOT NULL,
    ADD COLUMN `rate` DOUBLE NOT NULL;

-- AddForeignKey
ALTER TABLE `salarypayment` ADD CONSTRAINT `salarypayment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
