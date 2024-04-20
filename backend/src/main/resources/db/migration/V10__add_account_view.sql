CREATE OR REPLACE VIEW `account_view` AS
SELECT u.email, u.first_name, u.last_name, u.role, c.company_name, c.id AS company_id
FROM users AS u
LEFT JOIN user_company AS uc ON u.id = uc.user_id
LEFT JOIN company AS c ON uc.company_id = c.id;