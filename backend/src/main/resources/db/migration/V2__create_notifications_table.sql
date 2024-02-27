CREATE TABLE IF NOT EXISTS `notification` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `message` VARCHAR(255) NOT NULL,
    `user_id` INT NOT NULL,
    `created_at` BIGINT NOT NULL
);