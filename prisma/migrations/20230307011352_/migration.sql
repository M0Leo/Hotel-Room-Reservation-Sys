-- CreateTable
CREATE TABLE `Guest` (
    `guestId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `nationality` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Guest_phone_key`(`phone`),
    PRIMARY KEY (`guestId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reservation` (
    `reservationId` INTEGER NOT NULL AUTO_INCREMENT,
    `checkIn` DATETIME(3) NOT NULL,
    `checkOut` DATETIME(3) NOT NULL,
    `guestId` VARCHAR(191) NOT NULL,
    `visitors` INTEGER NOT NULL,
    `type` ENUM('Booking', 'Contract', 'Booked', 'Canceled') NOT NULL,
    `roomId` INTEGER NOT NULL,

    PRIMARY KEY (`reservationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Room` (
    `roomId` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('Single', 'Double', 'Triple') NOT NULL,

    PRIMARY KEY (`roomId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bill` (
    `invoiceNo` VARCHAR(191) NOT NULL,
    `reservationId` INTEGER NOT NULL,
    `total` DOUBLE NOT NULL DEFAULT 0,
    `remaining` DOUBLE NOT NULL DEFAULT 0,
    `paid` DOUBLE NOT NULL DEFAULT 0,
    `paymentMode` ENUM('Cash', 'Visa') NOT NULL,

    UNIQUE INDEX `Bill_reservationId_key`(`reservationId`),
    PRIMARY KEY (`invoiceNo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `serviceId` VARCHAR(191) NOT NULL,
    `type` ENUM('Bar', 'Laundry') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `quantity` INTEGER NOT NULL,
    `billInvoiceNo` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`serviceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_guestId_fkey` FOREIGN KEY (`guestId`) REFERENCES `Guest`(`guestId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`roomId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bill` ADD CONSTRAINT `Bill_reservationId_fkey` FOREIGN KEY (`reservationId`) REFERENCES `Reservation`(`reservationId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_billInvoiceNo_fkey` FOREIGN KEY (`billInvoiceNo`) REFERENCES `Bill`(`invoiceNo`) ON DELETE CASCADE ON UPDATE CASCADE;
