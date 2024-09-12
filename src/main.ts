// Simplebar
import SimpleBar from "simplebar";
import "simplebar/dist/simplebar.min.css";
import ResizeObserver from "resize-observer-polyfill";

import "./sass/main.scss";

type GlobalVariablesBlueprint = {
	mobile_navigation_container?: HTMLElement;
};
const GLOBALS: GlobalVariablesBlueprint = {};

// Add resize observer polyfill
window.ResizeObserver = ResizeObserver;

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

function SETUP_mobileMenuCustomScrollbar(): SimpleBar | null {
	const mobile_menu = document.querySelector(
		"#mobile-navigation-menu > .wrapper"
	);

	if (mobile_menu === null) {
		return null;
	}

	try {
		const simplebar = new SimpleBar(mobile_menu as HTMLElement, {});
		return simplebar;
	} catch (error) {
		return null;
	}
}

function onDomContentLoaded() {
	GLOBALS.mobile_navigation_container =
		document.getElementById("mobile-navigation-menu") || undefined;

	// SETUP LISTENERS FOR MOBILE MENU CLOSE AND OPEN
	SETUP_mobileMenuOpenListeners();
	SETUP_mobileMenuCloseListeners();

	// SETUP CUSTOM SCROLLBARS
	SETUP_mobileMenuCustomScrollbar();

	return;
}

window.addEventListener("DOMContentLoaded", onDomContentLoaded);
