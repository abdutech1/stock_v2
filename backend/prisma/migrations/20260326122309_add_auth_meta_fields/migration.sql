-- AlterTable
ALTER TABLE `loginlog` ADD COLUMN `userAgent` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `lastLoginAt` DATETIME(3) NULL,
    ADD COLUMN `mustChangePassword` BOOLEAN NOT NULL DEFAULT false;
