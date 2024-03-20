ALTER TABLE `user_requests`
    ADD COLUMN `extra_info` VARCHAR(255) DEFAULT '' AFTER `box_nr`,
    ADD COLUMN `country` VARCHAR(255) DEFAULT '' AFTER `company_name`;
