import { Input, NumberInput, PasswordInput, createTheme } from "@mantine/core";
import styles from "./styles/mantine.module.scss";

const PRIMARY_COLORS = [
	"#f3f3f1",
	"#dcdad5",
	"#c5c2b9",
	"#aeaa9d",
	"#979181",
	"#7e7868",
	"#545045",
	"#46433a",
	"#2a2823",
	"#241f20",
] as const;

export const theme = createTheme({
	defaultRadius: "xs",
	colors: {
		primary: PRIMARY_COLORS,
	},
	primaryColor: "primary",
	primaryShade: 9,
	black: PRIMARY_COLORS[9],
	white: PRIMARY_COLORS[0],
	components: {
		InputWrapper: Input.Wrapper.extend({
			defaultProps: {
				classNames: {
					label: styles.input_label,
				},
			},
		}),
		// password somehow doesnt use the inputwrapper so manually override
		PasswordInput: PasswordInput.extend({
			defaultProps: {
				classNames: {
					label: styles.input_label,
				},
			},
		}),
		NumberInput: NumberInput.extend({
			defaultProps: {
				classNames: {
					label: styles.input_label,
				},
			},
		}),
	},
});
