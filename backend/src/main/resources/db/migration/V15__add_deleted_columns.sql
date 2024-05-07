ALTER TABLE `companies`
ADD COLUMN `deleted` BIT(1) NOT NULL DEFAULT (0);

ALTER TABLE `users`
ADD COLUMN `deleted` BIT(1) NOT NULL DEFAULT (0);

CREATE OR REPLACE VIEW `company_info_accounts_view` AS
SELECT u.email, u.first_name, u.last_name, u.role, (SELECT `company_id` FROM `user_company` WHERE user_id = u.id) AS company_id
FROM users AS u
WHERE u.deleted = 0;