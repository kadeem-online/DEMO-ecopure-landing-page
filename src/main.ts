import "./sass/main.scss";

type GlobalVariablesBlueprint = {
	mobile_navigation_container?: HTMLElement;
};
const GLOBALS: GlobalVariablesBlueprint = {};

function INT_openMobileMenu() {
	if (GLOBALS.mobile_navigation_container === undefined) {
		return;
	}

	const menu = GLOBALS.mobile_navigation_container;
	menu.ariaExpanded = "true";
}

function INT_closeMobileMenu() {
	if (GLOBALS.mobile_navigation_container === undefined) {
		return;
	}

	const menu = GLOBALS.mobile_navigation_container;
	menu.ariaExpanded = "false";
}

function SETUP_mobileMenuOpenListeners() {
	const listeners: NodeList = document.querySelectorAll("[data-open-menu]");

	listeners.forEach((value, key, parent) => {
		value.addEventListener("click", (event) => {
			INT_openMobileMenu();
		});
	});

	return;
}

function SETUP_mobileMenuCloseListeners() {
	const listeners: NodeList = document.querySelectorAll("[data-close-menu]");

	listeners.forEach((value, key, parent) => {
		value.addEventListener("click", (event) => {
			INT_closeMobileMenu();
		});
	});

	return;
}

function onDomContentLoaded() {
	GLOBALS.mobile_navigation_container =
		document.getElementById("mobile-navigation-menu") || undefined;

	// SETUP LISTENERS FOR MOBILE MENU CLOSE AND OPEN
	SETUP_mobileMenuOpenListeners();
	SETUP_mobileMenuCloseListeners();

	return;
}

window.addEventListener("DOMContentLoaded", onDomContentLoaded);
