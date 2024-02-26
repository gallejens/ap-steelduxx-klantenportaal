import { FC } from "react";
import styles from "./styles/userRequest.module.scss";
import { UserRequestForm } from "./components/UserRequestForm";
import { ActionIcon, Divider, Text } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const userRequestPage: FC = () => {
	const { t } = useTranslation();
	const { history } = useRouter();

	return (
		<div className={styles.userrequest_page}>
			<div className={styles.panel}>
				<div className={styles.header}>
					<ActionIcon onClick={() => history.go(-1)} style={{ width: "32px", height: "32px" }}>
						<IconArrowLeft />
					</ActionIcon>
					<Text>{t("userrequestpage:title")}</Text>
				</div>
				<Divider />
				<div className={styles.body}>
					<UserRequestForm />
				</div>
			</div>
		</div>
	);
};
