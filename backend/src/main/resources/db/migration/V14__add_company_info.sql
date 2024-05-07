ALTER TABLE `company` RENAME TO `companies`;

ALTER TABLE `companies` RENAME COLUMN `company_name` TO `name`;

DROP VIEW IF EXISTS `account_view`;

CREATE OR REPLACE VIEW `company_info_accounts_view` AS
SELECT u.email, u.first_name, u.last_name, u.role, (SELECT `company_id` FROM `user_company` WHERE user_id = u.id) AS company_id
FROM users AS u;