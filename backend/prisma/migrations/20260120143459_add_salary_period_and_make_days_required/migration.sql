-- 1. Drop the old unique index
DROP INDEX `salarypayment_userId_weekStart_weekEnd_key` ON `salarypayment`;

-- 2. Drop the old foreign key
ALTER TABLE `salarypayment` DROP FOREIGN KEY `salarypayment_userId_fkey`;

-- 3. Add the new period columns as NULLABLE
ALTER TABLE `salarypayment`
ADD COLUMN `periodStart` DATETIME(3) NULL,
ADD COLUMN `periodEnd`   DATETIME(3) NULL;

-- 4. Backfill from old weekStart/weekEnd
UPDATE `salarypayment`
SET 
  `periodStart` = `weekStart`,
  `periodEnd`   = `weekEnd`
WHERE `weekStart` IS NOT NULL AND `weekEnd` IS NOT NULL;

-- 5. Safety fallback for any remaining NULLs
UPDATE `salarypayment`
SET 
  `periodStart` = DATE_SUB(`createdAt`, INTERVAL 7 DAY),
  `periodEnd`   = `createdAt`
WHERE `periodStart` IS NULL OR `periodEnd` IS NULL;

-- 6. Make new columns required
ALTER TABLE `salarypayment`
MODIFY `periodStart` DATETIME(3) NOT NULL,
MODIFY `periodEnd`   DATETIME(3) NOT NULL;

-- 7. Fix NULLs in daysWorked
UPDATE `salarypayment`
SET `daysWorked` = 7
WHERE `daysWorked` IS NULL;

-- 8. Make daysWorked required
ALTER TABLE `salarypayment`
MODIFY `daysWorked` INTEGER NOT NULL;

-- 9a. Migrate old enum values to new ones (WEEKLY & CUSTOM → PERIOD)
UPDATE `salarypayment`
SET `paymentType` = CASE 
    WHEN `paymentType` IN ('WEEKLY', 'CUSTOM') THEN 'PERIOD'
    ELSE `paymentType`
END;

-- 9b. Now safe to change the enum
ALTER TABLE `salarypayment`
MODIFY `paymentType` ENUM('DAILY', 'PERIOD') NOT NULL;

-- 10. Drop old columns
ALTER TABLE `salarypayment`
DROP COLUMN `weekStart`,
DROP COLUMN `weekEnd`;

-- 11. Create new index
CREATE INDEX `salarypayment_userId_periodStart_periodEnd_idx` 
ON `salarypayment`(`userId`, `periodStart`, `periodEnd`);

-- 12. Re-add foreign key
ALTER TABLE `salarypayment` 
ADD CONSTRAINT `salarypayment_userId_fkey` 
FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Prisma-generated part
CREATE TABLE `attendance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `status` ENUM('PRESENT', 'ABSENT', 'HALF_DAY') NOT NULL DEFAULT 'PRESENT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `attendance_userId_date_key`(`userId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

