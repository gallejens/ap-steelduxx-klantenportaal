CREATE TABLE IF NOT EXISTS `company` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `company_name` VARCHAR(255) NOT NULL,
    `country` VARCHAR(255) NOT NULL,
    `phone_nr` VARCHAR(20) NOT NULL,
    `vat_nr` VARCHAR(20) NOT NULL,
    `postal_code` VARCHAR(20) NOT NULL,
    `district` VARCHAR(255) NOT NULL,
    `street` VARCHAR(255) NOT NULL,
    `street_nr` VARCHAR(20) NOT NULL,
    `box_nr` VARCHAR(20),
    `extra_info` VARCHAR(255),
    `reference_code` VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS `user_company` (
    `user_id` BIGINT NOT NULL,
    `company_id` BIGINT NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (`company_id`) REFERENCES `company`(`id`) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (`user_id`, `company_id`)
);
