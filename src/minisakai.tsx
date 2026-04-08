import React from "react";
import { createRoot } from "react-dom/client";
import { MiniSakaiRoot } from "./components/main";
import { Settings } from "./features/setting/types";

let toggle = false;
/**
 * Change visibility of miniSakai
 */
export const toggleMiniSakai = (): void => {
    if (toggle) {
        // Hide miniSakai
        miniSakai.classList.remove("cs-show");
        miniSakai.classList.add("cs-hide");
        document.getElementById("cs-cover")?.remove();
    } else {
        // Display miniSakai
        miniSakai.classList.remove("cs-hide");
        miniSakai.classList.add("cs-show");
        const cover = document.createElement("div");
        cover.id = "cs-cover";
        document.getElementsByTagName("body")[0].appendChild(cover);
        cover.onclick = toggleMiniSakai;
    }
    toggle = !toggle;
};

export const miniSakai = document.createElement("div");
miniSakai.id = "miniSakai";
miniSakai.classList.add("cs-minisakai", "cs-tab");

export const hamburger = document.createElement("button");
hamburger.className = "cs-loading";
hamburger.addEventListener("click", toggleMiniSakai);

const getMiniSakaiButtonContainer = (): Element | null => {
    return (
        document.getElementById("loginLinksImage")?.parentElement ??
        document.querySelector("header.portal-header")
    );
};

const getMiniSakaiMountPoint = (): { parent: Element; ref: Element | null } | null => {
    const portalContainer = document.querySelector(".portal-container");
    if (portalContainer !== null) {
        return {
            parent: portalContainer,
            ref: document.querySelector(".portal-main-container")
        };
    }

    const pageBody = document.getElementById("pageBody");
    if (pageBody !== null) {
        return {
            parent: pageBody,
            ref: null
        };
    }

    return null;
};

const getColorSettingsRoot = (isSubSakai: boolean): HTMLElement | null => {
    if (isSubSakai) {
        return document.querySelector("#subSakai");
    }

    return (
        (document.querySelector(".portal-container") as HTMLElement | null) ??
        (document.querySelector("header.portal-header") as HTMLElement | null)
    );
};

/**
 * Create a button to open miniSakai
 */
export function createMiniSakaiBtn(): void {
    const topbar = getMiniSakaiButtonContainer();
    try {
        topbar?.appendChild(hamburger);
    } catch (e) {
        console.log("could not launch miniSakai.");
    }
}

/**
 * Insert miniSakai into Sakai.
 */
export function createMiniSakai(hostname: string) {
    const mountPoint = getMiniSakaiMountPoint();
    if (mountPoint !== null) {
        mountPoint.parent.insertBefore(miniSakai, mountPoint.ref);
    }
    const root = createRoot(miniSakai);
    root.render(<MiniSakaiRoot subset={false} hostname={hostname} />);
}

export const applyColorSettings = (settings: Settings, isSubSakai: boolean): void => {
    const bodyStyles = getColorSettingsRoot(isSubSakai);
    if (bodyStyles === null) {
        return;
    }
    for (const colorName of Object.getOwnPropertyNames(settings.color)) {
        // @ts-ignore
        const color = settings.color[colorName];
        bodyStyles.style.setProperty(`--${colorName}`, color);
    }
    bodyStyles.style.setProperty("--textColor", settings.getTextColor());
    bodyStyles.style.setProperty("--bgColor", settings.getBgColor());
    bodyStyles.style.setProperty("--dateColor", settings.getDateColor());
};
