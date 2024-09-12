import { Config } from "tailwindcss";

/** @type {import('tailwindcss').Config} */
const config: Config = {
	content: ["./index.html"],
	theme: {
		extend: {
			screens: {
				xs: "480px",
			},
			container: {
				center: true,
				padding: "20px",
			},
			colors: {
				primary: {
					base: "#2D6A4F",
					light: "#3D8F69",
					dark: "#255640",
				},
				secondary: {
					base: "#F4F1DE",
					light: "#FAF9F0",
					dark: "#F0ECD1",
				},
				accent: {
					base: "#8D8741",
					light: "#EDE9C1",
					medium: "#A8A04D",
					dark: "#706B33",
				},
			},
			fontFamily: {
				montserrat: ["Montserrat", "sans-serif"],
				"playfair-display": ["Playfair Display", "serif"],
			},
		},
	},
	plugins: [],
};
export default config;
