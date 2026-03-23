/*
  Warnings:

  - You are about to drop the column `bonus` on the `sale` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `sale` DROP FOREIGN KEY `sale_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `sale` DROP FOREIGN KEY `sale_priceCategoryId_fkey`;

-- DropIndex
DROP INDEX `sale_priceCategoryId_fkey` ON `sale`;

-- AlterTable
ALTER TABLE `sale` DROP COLUMN `bonus`,
    MODIFY `soldPrice` DOUBLE NULL,
    MODIFY `quantity` INTEGER NULL,
    MODIFY `priceCategoryId` INTEGER NULL,
    MODIFY `paymentMethod` ENUM('CASH', 'BANK') NULL;

-- CreateTable
CREATE TABLE `SaleItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `saleId` INTEGER NOT NULL,
    `priceCategoryId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `soldPrice` DOUBLE NOT NULL,

    UNIQUE INDEX `SaleItem_saleId_priceCategoryId_key`(`saleId`, `priceCategoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalePayment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `saleId` INTEGER NOT NULL,
    `method` ENUM('CASH', 'BANK') NOT NULL,
    `amount` DOUBLE NOT NULL,
    `bankName` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleItem` ADD CONSTRAINT `SaleItem_saleId_fkey` FOREIGN KEY (`saleId`) REFERENCES `Sale`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleItem` ADD CONSTRAINT `SaleItem_priceCategoryId_fkey` FOREIGN KEY (`priceCategoryId`) REFERENCES `pricecategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalePayment` ADD CONSTRAINT `SalePayment_saleId_fkey` FOREIGN KEY (`saleId`) REFERENCES `Sale`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
