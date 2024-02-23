import { notifications } from "@/components/notifications";
import { TextInput } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import PhoneInput, { formatPhoneNumber, formatPhoneNumberIntl, isPossiblePhoneNumber, isValidPhoneNumber } from "react-phone-number-input";

type RegisterFormValues = {
	companyName: string;
	email: string;
	telNr: string;
	btwNr: string;
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
			btwNr: "",
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
				if ((!value || isPossiblePhoneNumber(value), isValidPhoneNumber(value))) {
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
	};

	return (
		<form onSubmit={registerForm.onSubmit((values) => handleRegisterButton(values))}>
			<TextInput
				label={t("registerpage:companyInputTitle")}
				placeholder={t("registerpage:companyInputPlaceholder")}
				required
				{...registerForm.getInputProps("company")}
			/>
		</form>
	);
};
