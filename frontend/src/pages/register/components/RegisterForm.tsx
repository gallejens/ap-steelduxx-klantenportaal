import { notifications } from "@/components/notifications";
import { Button, TextInput } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { FC } from "react"; // Import useState
import { useTranslation } from "react-i18next";
import { isPossiblePhoneNumber, isValidPhoneNumber } from "react-phone-number-input";
import styles from "../styles/register.module.scss";

type RegisterFormValues = {
	companyName: string;
	email: string;
	telNr: string;
	vatNr: string;
	postalCode: string;
	town: string;
	street: string;
	streetNumber: string;
	boxNumber: string;
	firstName: string;
	lastName: string;
	intrisCode: string;
	password: string;
};

export const RegisterForm: FC = () => {
	const { t } = useTranslation();
	const registerForm = useForm<RegisterFormValues>({
		initialValues: {
			companyName: "",
			email: "",
			telNr: "",
			vatNr: "",
			postalCode: "",
			town: "",
			street: "",
			streetNumber: "",
			boxNumber: "",
			firstName: "",
			lastName: "",
			intrisCode: "",
			password: "",
		},
		validate: {
			companyName: (value) => {
				if (!value || value.length === 0) {
					return t("registerpage:companyInputError");
				}
			},
			email: isEmail(t("register:emailInputError")),
			telNr: (value) => {
				if (!value || !isPossiblePhoneNumber(value) || !isValidPhoneNumber(value)) {
					return t("registerpage:telNrInputError");
				}
			},
			// FIX VAT VALIDATION
			vatNr: (value) => {
				if (!value) {
					return t("registerpage:btwNrInputError");
				}
			},
		},
		validateInputOnBlur: true,
	});

	const handleRegisterButton = async (values: RegisterFormValues) => {
		if (!registerForm.isValid()) {
			notifications.add({
				title: t("notifications: genericError"),
				message: t("notifications:invalidForm"),
				color: "red",
			});
			return;
		}

		// Continue with your registration logic here
	};

	return (
		<form className={styles.register_form} onSubmit={registerForm.onSubmit((values) => handleRegisterButton(values))}>
			<TextInput
				label={t("registerpage:companyInputTitle")}
				placeholder={t("registerpage:companyInputPlaceholder")}
				required
				{...registerForm.getInputProps("company")}
			/>
			<TextInput
				label={t("registerpage:emailInputTitle")}
				placeholder={t("registerpage:emailInputPlaceholder")}
				required
				{...registerForm.getInputProps("email")}
			/>
			<TextInput
				label={t("registerpage:telNrInputTitle")}
				placeholder={t("registerpage:telNrPlaceholder")}
				required
				{...registerForm.getInputProps("telNr")}
			/>
			<TextInput
				label={t("registerpage:vatNrInputTitle")}
				placeholder={t("registerpage:vatNrPlaceholder")}
				required
				{...registerForm.getInputProps("vatNr")}
			/>
			<div>
				<Button type="submit">{t("registerpage:registerButton")}</Button>
			</div>
		</form>
	);
};
