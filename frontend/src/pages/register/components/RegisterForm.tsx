import { notifications } from "@/components/notifications";
import { Button, NumberInput, TextInput } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { FC } from "react"; // Import useState
import { checkVAT, countries } from "jsvat";
import { useTranslation } from "react-i18next";
import { isPossiblePhoneNumber, isValidPhoneNumber } from "react-phone-number-input";
import styles from "../styles/register.module.scss";
import { doApiAction } from "@/lib/api";

type RegisterFormValues = {
	companyName: string;
	email: string;
	phoneNr: string;
	vatNr: string;
	postalCode: string;
	district: string;
	street: string;
	streetNr: string;
	boxNr: string;
	firstName: string;
	lastName: string;
	//intrisCode: string;
};

export const RegisterForm: FC = () => {
	const { t } = useTranslation();
	const registerForm = useForm<RegisterFormValues>({
		initialValues: {
			companyName: "",
			email: "",
			phoneNr: "",
			vatNr: "",
			postalCode: "",
			district: "",
			street: "",
			streetNr: "",
			boxNr: "",
			firstName: "",
			lastName: "",
			//intrisCode: ""
		},
		validate: {
			companyName: (value) => {
				if (!value) {
					return t("registerpage:companyInputError");
				}
			},
			email: isEmail(t("registerpage:emailInputError")),
			phoneNr: (value) => {
				if (!value || !isPossiblePhoneNumber(value) || !isValidPhoneNumber(value)) {
					return t("registerpage:phoneNrInputError");
				}
			},
			vatNr: (value) => {
				if (!value || !checkVAT(value, countries)?.isValid) {
					return t("registerpage:vatNrInputError");
				}
			},
			postalCode: (value) => {
				if (!value) {
					return t("registerpage:postalCodeInputError");
				}
			},
			district: (value) => {
				if (!value) {
					return t("registerpage:districtInputError");
				}
			},
			street: (value) => {
				if (!value) {
					return t("registerpage:streetInputError");
				}
			},
			streetNr: (value) => {
				if (!value && value !== "0") {
					return t("registerpage:streetNrInputError");
				}
			},
			boxNr: (value) => {
				if (value === "0") {
					return t("registerpage:boxNrInputError");
				}
			},
			firstName: (value) => {
				if (!value) {
					return t("registerpage:firstNameInputError");
				}
			},
			lastName: (value) => {
				if (!value) {
					return t("registerpage:lastNameInputError");
				}
			},
			// Kan mogelijk weg gelaten worden! FIX VALIDATION
			// intrisCode: (value) => {
			// 	if (!value) {
			// 		return t("registerpage:intrisCodeInputError");
			// 	}
			// },
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

		const result = await doApiAction({
			endpoint: "/auth/register",
			method: "POST",
			body: {
				companyName: values.companyName,
				email: values.email,
				phoneNr: values.phoneNr,
				vatNr: values.vatNr,
				postalCode: values.postalCode,
				district: values.district,
				street: values.street,
				streetNr: values.streetNr,
				boxNr: values.boxNr,
				firstName: values.firstName,
				lastName: values.lastName,
				//intriscode: values.intrisCode
			},
		});

		console.log(result);

		// TODO: get response from backend if account already exists
		// 		IF NOT:
		// 			Clear all fields and navigate to confirmation page
		//		ELSE:
		//			Show notification and do nothing
	};

	return (
		<form className={styles.register_form} onSubmit={registerForm.onSubmit((values) => handleRegisterButton(values))}>
			<div className={styles.company_detail_fields}>
				<TextInput
					label={t("registerpage:companyInputTitle")}
					description={t("registerpage:companyInputDescription")}
					placeholder={t("registerpage:companyInputPlaceholder")}
					required
					{...registerForm.getInputProps("companyName")}
				/>
				<TextInput
					className={styles.email_field}
					label={t("registerpage:emailInputTitle")}
					description={t("registerpage:emailInputDescription")}
					placeholder={t("registerpage:emailInputPlaceholder")}
					required
					{...registerForm.getInputProps("email")}
				/>
				<div className={styles.number_fields}>
					<TextInput
						label={t("registerpage:phoneNrInputTitle")}
						description={t("registerpage:phoneNrInputDescription")}
						placeholder={t("registerpage:phoneNrInputPlaceholder")}
						required
						{...registerForm.getInputProps("phoneNr")}
					/>
					<TextInput
						label={t("registerpage:vatNrInputTitle")}
						description={t("registerpage:vatNrInputDescription")}
						placeholder={t("registerpage:vatNrInputPlaceholder")}
						required
						{...registerForm.getInputProps("vatNr")}
					/>
				</div>
				<div className={styles.place_fields}>
					<NumberInput
						label={t("registerpage:postalCodeInputTitle")}
						description={t("registerpage:postalCodeInputDescription")}
						placeholder={t("registerpage:postalCodeInputPlaceholder")}
						hideControls
						allowNegative={false}
						allowDecimal={false}
						required
						{...registerForm.getInputProps("postalCode")}
					/>
					<TextInput
						label={t("registerpage:districtInputTitle")}
						description={t("registerpage:districtInputDescription")}
						placeholder={t("registerpage:districtInputPlaceholder")}
						required
						{...registerForm.getInputProps("district")}
					/>
				</div>
				<div className={styles.street_fields}>
					<TextInput
						label={t("registerpage:streetInputTitle")}
						description={t("registerpage:streetInputDescription")}
						placeholder={t("registerpage:streetInputPlaceholder")}
						required
						{...registerForm.getInputProps("street")}
					/>
					<NumberInput
						label={t("registerpage:streetNrInputTitle")}
						description={t("registerpage:streetNrInputDescription")}
						placeholder={t("registerpage:streetNrInputPlaceholder")}
						hideControls
						allowNegative={false}
						allowDecimal={false}
						maxLength={3}
						required
						{...registerForm.getInputProps("streetNr")}
					/>
					<NumberInput
						label={t("registerpage:boxNrInputTitle")}
						description={t("registerpage:boxNrInputDescription")}
						placeholder={t("registerpage:boxNrInputPlaceholder")}
						hideControls
						allowNegative={false}
						allowDecimal={false}
						maxLength={1}
						{...registerForm.getInputProps("boxNr")}
					/>
				</div>
			</div>
			<div className={styles.name_fields}>
				<TextInput
					label={t("registerpage:firstNameInputTitle")}
					description={t("registerpage:firstNameInputDescription")}
					placeholder={t("registerpage:firstNameInputPlaceholder")}
					required
					{...registerForm.getInputProps("firstName")}
				/>
				<TextInput
					className={styles.lastname_field}
					label={" "}
					description={t("registerpage:lastNameInputDescription")}
					placeholder={t("registerpage:lastNameInputPlaceholder")}
					{...registerForm.getInputProps("lastName", { required: true })}
				/>
				{/* <NumberInput
					className={styles.intriscode_field}
					label={t("registerpage:intrisCodeInputTitle")}
					description={t("registerpage:intrisCodeInputDescription")}
					placeholder={t("registerpage:intrisCodeInputPlaceholder")}
					hideControls
					allowNegative={false}
					allowDecimal={false}
					required
					{...registerForm.getInputProps("intrisCode")}
				/> */}
			</div>

			<div className={styles.register_button}>
				<Button type="submit">{t("registerpage:registerButton")}</Button>
			</div>
		</form>
	);
};
