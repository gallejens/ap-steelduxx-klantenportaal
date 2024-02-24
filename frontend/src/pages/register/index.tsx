import { FC } from "react";
import { RegisterForm } from "./components/RegisterForm";
import styles from "./styles/register.module.scss";
import { ActionIcon, Divider, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useRouter } from "@tanstack/react-router";
import navigate_back_icon from "../../../public/navigate_back_icon.svg";

export const RegisterPage: FC = () => {
	const { t } = useTranslation();
	const { history } = useRouter();

	return (
		<div className={styles.register_page}>
			<div className={styles.panel}>
				<div className={styles.header}>
					<ActionIcon onClick={() => history.go(-1)} style={{ width: "32px", height: "32px" }}>
						<img
							src={navigate_back_icon}
							alt="Navigate Back"
							style={{ width: "18px", height: "18px", filter: "invert(100%)" }}
						/>
					</ActionIcon>
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
