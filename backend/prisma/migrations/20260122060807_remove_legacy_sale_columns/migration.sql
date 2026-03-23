/*
  Warnings:

  - You are about to drop the column `bankName` on the `sale` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `sale` table. All the data in the column will be lost.
  - You are about to drop the column `priceCategoryId` on the `sale` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `sale` table. All the data in the column will be lost.
  - You are about to drop the column `soldPrice` on the `sale` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `sale` DROP COLUMN `bankName`,
    DROP COLUMN `paymentMethod`,
    DROP COLUMN `priceCategoryId`,
    DROP COLUMN `quantity`,
    DROP COLUMN `soldPrice`;
