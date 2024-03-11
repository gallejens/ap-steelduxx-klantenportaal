DROP TABLE IF EXISTS `refresh_tokens`;

CREATE TABLE IF NOT EXISTS `refresh_tokens` (
    `token` VARCHAR(36) NOT NULL PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `expiry_date` BIGINT NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE CASCADE ON DELETE CASCADE
);