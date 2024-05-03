CREATE TABLE IF NOT EXISTS `order_request_documents` (
    `order_request_id` BIGINT NOT NULL,
    `type` VARCHAR(32) NOT NULL,
    `file_name` VARCHAR(36) NOT NULL,
    PRIMARY KEY (`order_request_id`, `type`),
    FOREIGN KEY (`order_request_id`) REFERENCES `order_requests`(`id`) ON UPDATE CASCADE ON DELETE CASCADE
);