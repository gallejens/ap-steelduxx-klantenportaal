CREATE TABLE IF NOT EXISTS `choose_password_tokens` (
    `token` VARCHAR(36) NOT NULL,
    `user_id` BIGINT NOT NULL PRIMARY KEY,
    `expiry_date` BIGINT NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE CASCADE ON DELETE CASCADE
);