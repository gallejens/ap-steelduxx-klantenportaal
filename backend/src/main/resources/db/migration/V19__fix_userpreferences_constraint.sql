DROP TABLE IF EXISTS `userpreferences`;

CREATE TABLE IF NOT EXISTS `userpreferences` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT NOT NULL,
  `system_notification_order_status` BOOLEAN DEFAULT true,
  `email_notification_order_status` BOOLEAN DEFAULT true,
  `system_notification_order_request` BOOLEAN DEFAULT true,
  `email_notification_order_request` BOOLEAN DEFAULT true,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE CASCADE ON DELETE CASCADE
);