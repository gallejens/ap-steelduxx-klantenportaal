ALTER TABLE `order_requests`
    ADD COLUMN `order_type` VARCHAR(255) DEFAULT '' AFTER `status`;