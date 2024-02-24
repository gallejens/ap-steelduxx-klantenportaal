import { FC } from "react";
import { RegisterForm } from "./components/RegisterForm";
import styles from "./styles/register.module.scss";
import { Divider, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

export const RegisterPage: FC = () => {
	const { t } = useTranslation();

	return (
		<div className={styles.register_page}>
			<div className={styles.panel}>
				<div className={styles.header}>
					<Text>{t("registerpage:title")}</Text>
				</div>
				<Divider />
				<div className={styles.body}>
					<RegisterForm />
				</div>
			</div>
		</div>
	);
};
