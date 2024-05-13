ALTER TABLE `order_requests`
    DROP COLUMN `customer_code`,
    ADD COLUMN `company_id` BIGINT AFTER `id`,
    ADD CONSTRAINT FOREIGN KEY(company_id) REFERENCES companies(id);