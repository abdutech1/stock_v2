-- CreateTable
CREATE TABLE `bonusPayment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `periodStart` DATETIME(3) NOT NULL,
    `periodEnd` DATETIME(3) NOT NULL,
    `type` ENUM('WEEKLY_TOTAL', 'SINGLE_CUSTOMER', 'PERIOD_TOTAL', 'SINGLE_SALE', 'GLOBAL') NOT NULL,
    `amount` DOUBLE NOT NULL,
    `ruleId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `bonusPayment_periodStart_periodEnd_idx`(`periodStart`, `periodEnd`),
    INDEX `bonusPayment_userId_idx`(`userId`),
    UNIQUE INDEX `bonusPayment_userId_periodStart_periodEnd_type_key`(`userId`, `periodStart`, `periodEnd`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bonusPayment` ADD CONSTRAINT `bonusPayment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bonusPayment` ADD CONSTRAINT `bonusPayment_ruleId_fkey` FOREIGN KEY (`ruleId`) REFERENCES `bonusRule`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
