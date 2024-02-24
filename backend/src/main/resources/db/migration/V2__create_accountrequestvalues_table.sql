CREATE TABLE IF NOT EXISTS `accounts` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `company_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone_nr` VARCHAR(20) NOT NULL,
    `vat_nr` VARCHAR(20) NOT NULL,
    `postal_code` VARCHAR(20) NOT NULL,
    `district` VARCHAR(255) NOT NULL,
    `street` VARCHAR(255) NOT NULL,
    `street_nr` VARCHAR(20) NOT NULL,
    `box_nr` VARCHAR(20),
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL
)