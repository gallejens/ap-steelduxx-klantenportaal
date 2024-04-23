CREATE TABLE IF NOT EXISTS `order_requests` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `customer_code` VARCHAR(255) NOT NULL,
    `transport_type` VARCHAR(255) NOT NULL,
    `port_of_origin_code` VARCHAR(20) NOT NULL,
    `port_of_destination_code` VARCHAR(20) NOT NULL,
    `status` VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS `order_request_products` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `order_request_id` BIGINT NOT NULL,
    `hs_code` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `quantity` BIGINT NOT NULL,
    `weight` BIGINT NOT NULL,
    `container_nr` VARCHAR(255),
    `container_size` VARCHAR(20),
    `container_type` VARCHAR(20),
    FOREIGN KEY (`order_request_id`) REFERENCES `order_requests`(`id`) ON UPDATE CASCADE ON DELETE CASCADE
);