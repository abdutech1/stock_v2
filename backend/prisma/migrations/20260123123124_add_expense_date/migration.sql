/*
  Warnings:

  - You are about to drop the column `weekEnd` on the `expense` table. All the data in the column will be lost.
  - You are about to drop the column `weekStart` on the `expense` table. All the data in the column will be lost.
  - Added the required column `expenseDate` to the `expense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `expense` DROP COLUMN `weekEnd`,
    DROP COLUMN `weekStart`,
    ADD COLUMN `category` VARCHAR(191) NULL,
    ADD COLUMN `expenseDate` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE INDEX `expense_expenseDate_idx` ON `expense`(`expenseDate`);
