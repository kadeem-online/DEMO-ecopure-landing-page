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

import { throttle } from "lodash";

type GlobalVariablesBlueprint = {
	mobile_navigation_container?: HTMLElement;
	page_content_simplebar?: SimpleBar;
	lenis?: Lenis;
	lastScrollOffset: number;
};
const GLOBALS: GlobalVariablesBlueprint = {
	lastScrollOffset: 0,
};

// Add resize observer polyfill
window.ResizeObserver = ResizeObserver;

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// GSAP match media
const GSAP_MM = gsap.matchMedia();

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

function ANIM_productSectionHorizontalSection() {
	GSAP_MM.add("(min-width: 1024px)", () => {
		const products_array = gsap.utils.toArray(
			"#products-section .product-list .product"
		);

		const scroll_timeline = gsap.timeline({
			scrollTrigger: {
				trigger: "#products-section",
				start: "top top",
				pin: true,
				scroller:
					GLOBALS.page_content_simplebar?.getScrollElement() || undefined,
				end: "+=3500",
				scrub: 1,
			},
		});

		scroll_timeline.to(products_array, {
			xPercent: -100 * products_array.length,
			ease: "none",
			duration: 5,
		});
	});
}

function ANIM_aboutSectionParallax() {
	GSAP_MM.add("(min-width: 768px)", () => {
		const parallax_scroll = gsap.timeline({
			scrollTrigger: {
				trigger: "#about-section",
				start: "top 80%",
				end: "+=512",
				scroller:
					GLOBALS.page_content_simplebar?.getScrollElement() || undefined,
				scrub: 1,
			},
		});

		parallax_scroll.fromTo(
			"#about-image",
			{
				yPercent: 25,
				scale: 0.9,
			},
			{
				yPercent: 0,
				scale: 1,
			}
		);
	});
}

function ANIM_revealFeatureCards() {
	const cards = gsap.utils.toArray(
		"#commitment-section .feature-list .feature-card"
	);

	gsap.fromTo(
		cards,
		{
			opacity: 0,
			yPercent: 25,
		},
		{
			opacity: 1,
			yPercent: 0,
			stagger: 0.25,
			scrollTrigger: {
				trigger: `#commitment-section .feature-list`,
				start: "top center",
				once: true,
				scroller:
					GLOBALS.page_content_simplebar?.getScrollElement() || undefined,
			},
		}
	);
}

function SETUP_mobileMenuOpenListeners() {
	const listeners: NodeList = document.querySelectorAll("[data-open-menu]");

	listeners.forEach((value) => {
		value.addEventListener("click", () => {
			INT_openMobileMenu();
		});
	});

	return;
}

function SETUP_mobileMenuCloseListeners() {
	const listeners: NodeList = document.querySelectorAll("[data-close-menu]");

	listeners.forEach((value) => {
		value.addEventListener("click", () => {
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

function SETUP_navbarScrollListener() {
	const scroller = GLOBALS.page_content_simplebar?.getScrollElement() || window;
	const throttledHandler = throttle(UTIL_navbarScrollHandler, 150, {});

	scroller.addEventListener("scroll", (event: Event) => {
		throttledHandler(scroller);
	});
}

function INT_scrollToSection(target: HTMLElement) {
	try {
		target.scrollIntoView({
			behavior: "smooth",
		});
	} catch (error) {
		console.error("SCROLL FAILURE: ", error);
	}
}

function HANDLER_onPageLinkNavigation(link: Element) {
	try {
		const target_id = link.getAttribute("href")?.substring(1);
		if (target_id === undefined) {
			throw new TypeError(
				`link must have a value assigned to it's href attribute'`
			);
		}

		const target_element = document.getElementById(target_id);
		if (target_element === null) {
			throw new TypeError(
				"target_element cannot be null, must be a valid HTMLElement."
			);
		}

		INT_scrollToSection(target_element);

		return;
	} catch (error) {
		console.log("FAILED ON PAGE SCROLL: ", error);
	}
}

function SETUP_mobileMenuLinkClick() {
	const links = document.querySelectorAll(
		"nav#mobile-navigation .nav-list .nav-link"
	);

	links.forEach((link) => {
		link.addEventListener("click", (event) => {
			event.preventDefault();
			HANDLER_onPageLinkNavigation(link);
			INT_closeMobileMenu();
		});
	});
}

function SETUP_footerMenuLinkClick() {
	const links = document.querySelectorAll(
		"footer#page-footer .footer-menu-list .nav-link"
	);

	links.forEach((link) => {
		link.addEventListener("click", (event) => {
			event.preventDefault();
			HANDLER_onPageLinkNavigation(link);
		});
	});
}

function SETUP_heroCTALinkClick() {
	const link = document.getElementById("hero-cta");

	if (link === null) {
		return;
	}

	link.addEventListener("click", (event) => {
		event.preventDefault();
		HANDLER_onPageLinkNavigation(link);
	});
}

function UTIL_autoScroll() {
	if (GLOBALS.lenis) {
		GLOBALS.lenis.scrollTo("bottom", {
			duration: 25,
			easing: (time: number) => {
				return time;
			},
		});
	}
}

function UTIL_comboKeyMonitor(event: KeyboardEvent) {
	// Check for Ctrl + Alt + J
	if (event.ctrlKey && event.altKey && event.key === "j") {
		UTIL_autoScroll();
	}
}

function UTIL_navbarScrollHandler(scroller: HTMLElement | Window) {
	try {
		const scroll_y_offset =
			scroller instanceof HTMLElement
				? scroller.scrollTop
				: scroller.scrollY || document.documentElement.scrollTop;

		const navbar = document.getElementById("page-navbar");
		if (navbar === null) {
			return;
		}

		if (scroll_y_offset > GLOBALS.lastScrollOffset) {
			navbar.classList.add("--down");
			navbar.classList.remove("--up");
		} else {
			navbar.classList.add("--up");
			navbar.classList.remove("--down");
		}

		GLOBALS.lastScrollOffset = scroll_y_offset;
		return;
	} catch (error) {
		return;
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

	// SETUP ON PAGE LINKS NAVIGATION
	SETUP_heroCTALinkClick();
	SETUP_mobileMenuLinkClick();
	SETUP_footerMenuLinkClick();

	// SETUP NAVBAR SCROLL
	SETUP_navbarScrollListener();

	return;
}

function onPageLoaded() {
	// GSAP
	ANIM_aboutSectionParallax();
	ANIM_productSectionHorizontalSection();
	ANIM_revealFeatureCards();

	// ADD event listener for the keyboard
	window.addEventListener("keydown", UTIL_comboKeyMonitor);
}

window.addEventListener("DOMContentLoaded", onDomContentLoaded);
window.addEventListener("load", onPageLoaded);
