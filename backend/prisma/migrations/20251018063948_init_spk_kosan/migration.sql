-- CreateTable
CREATE TABLE `Kriteria` (
    `id_kriteria` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_kriteria` VARCHAR(50) NOT NULL,
    `bobot` DECIMAL(5, 2) NOT NULL,
    `tipe` ENUM('benefit', 'cost') NOT NULL,

    PRIMARY KEY (`id_kriteria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kosan` (
    `id_kosan` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `harga` DECIMAL(10, 2) NOT NULL,
    `jarak` DECIMAL(10, 2) NOT NULL,
    `fasilitas` DECIMAL(10, 2) NOT NULL,
    `rating` DECIMAL(10, 2) NOT NULL,
    `sistem_keamanan` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id_kosan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HasilTopsis` (
    `id_hasil` INTEGER NOT NULL AUTO_INCREMENT,
    `id_kosan` INTEGER NOT NULL,
    `nilai_preferensi` DECIMAL(10, 4) NOT NULL,
    `ranking` INTEGER NOT NULL,

    UNIQUE INDEX `HasilTopsis_id_kosan_key`(`id_kosan`),
    PRIMARY KEY (`id_hasil`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HasilTopsis` ADD CONSTRAINT `HasilTopsis_id_kosan_fkey` FOREIGN KEY (`id_kosan`) REFERENCES `Kosan`(`id_kosan`) ON DELETE CASCADE ON UPDATE CASCADE;
