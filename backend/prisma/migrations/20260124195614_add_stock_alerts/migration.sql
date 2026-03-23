-- CreateTable
CREATE TABLE `StockAlert` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `priceCategoryId` INTEGER NOT NULL,
    `lastSentAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `StockAlert_priceCategoryId_key`(`priceCategoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
