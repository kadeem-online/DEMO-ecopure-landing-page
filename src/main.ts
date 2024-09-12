// Simplebar
import SimpleBar from "simplebar";
import "simplebar/dist/simplebar.min.css";
import ResizeObserver from "resize-observer-polyfill";

// Lenis
import Lenis from "lenis";
import "lenis/dist/lenis.css";

// GSAP
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

import "./sass/main.scss";

type GlobalVariablesBlueprint = {
	mobile_navigation_container?: HTMLElement;
	page_content_simplebar?: SimpleBar;
	lenis?: Lenis;
};
const GLOBALS: GlobalVariablesBlueprint = {};

// Add resize observer polyfill
window.ResizeObserver = ResizeObserver;

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

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

function SETUP_pageSmoothScroll(): Lenis | null {
	try {
		const lenis = new Lenis({
			wrapper: GLOBALS.page_content_simplebar?.getScrollElement() || undefined,
			content: GLOBALS.page_content_simplebar?.getContentElement() || undefined,
		});

		lenis.on("scroll", ScrollTrigger.update);

		gsap.ticker.add((time: number) => {
			lenis.raf(time * 1000);
		});

		gsap.ticker.lagSmoothing(0);

		return lenis;
	} catch (error) {
		console.error("FAILED TO SETUP LENIS: ", error);
		return null;
	}
}

function SETUP_pageContentCustomScrollbar(): SimpleBar | null {
	const page_content = document.getElementById("content-wrapper");
	if (page_content === null) {
		return null;
	}

	try {
		const simplebar = new SimpleBar(page_content as HTMLElement, {});
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
	GLOBALS.page_content_simplebar =
		SETUP_pageContentCustomScrollbar() || undefined;

	// SETUP LENIS
	GLOBALS.lenis = SETUP_pageSmoothScroll() || undefined;

	return;
}

window.addEventListener("DOMContentLoaded", onDomContentLoaded);
