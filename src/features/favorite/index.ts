import { getCourseSiteID } from "../../utils";

/**
 * Limit maximum number of course sites
 * @type {int}
 */
const MAX_FAVORITES = 100;

const getSiteIdAndHrefSiteNameMap = (): Map<string, { href: string, title: string }> => {
    const map = new Map<string, { href: string; title: string }>();
    document.querySelectorAll(".site-list-item[data-site]").forEach((site) => {
        const siteId = site.getAttribute("data-site");
        const anchor = site.querySelector(".sidebar-site-title") as HTMLAnchorElement | null;
        if (siteId == null || anchor == null) return;
        if (!map.has(siteId)) {
            map.set(siteId, {
                href: anchor.href,
                title: anchor.title || anchor.textContent?.trim() || siteId
            });
        }
    });

    return map;
};

/**
 * Get hrefs of sites in favorite bar
 */
const getCurrentFavoritesSite = (): Array<string> => {
    const sidebar = document.querySelector("#pinned-site-list, #recent-site-list, #portal-nav-sidebar");
    if (sidebar == null) return new Array<string>();
    return Array.from(sidebar.querySelectorAll(".site-list-item[data-site] .sidebar-site-title"))
        .map((site) => (site as HTMLAnchorElement).href)
        .filter((href) => href.length > 0);
};

const createSidebarFavoriteItem = (siteId: string, href: string, title: string): HTMLLIElement => {
    const li = document.createElement("li");
    li.className = "site-list-item py-1";
    li.dataset.site = siteId;
    li.dataset.type = "pinned";

    const head = document.createElement("div");
    head.className = "site-list-item-head d-flex align-items-center pe-2 py-1 w-100 justify-content-between";

    const linkBlock = document.createElement("div");
    linkBlock.className = "site-link-block d-flex align-items-center rounded-end me-1 pe-2";

    const anchor = document.createElement("a");
    anchor.className = "sidebar-site-title";
    anchor.href = href;
    anchor.title = title;
    anchor.innerText = title;

    linkBlock.appendChild(anchor);
    head.appendChild(linkBlock);
    li.appendChild(head);
    return li;
};

/**
 * Add course sites to favorites bar (more than Sakai config)
 * @param {string} baseURL
 */
export const addFavoritedCourseSites = (baseURL: string): Promise<void> => {
    const pinnedSiteList = document.querySelector("#pinned-site-list, #recent-site-list");
    if (pinnedSiteList == null) return new Promise((resolve) => resolve());
    const request = new XMLHttpRequest();
    request.open("GET", baseURL + "/portal/favorites/list");
    request.responseType = "json";

    document.querySelector(".organizeFavorites")?.addEventListener("click", editFavoritesMessage);
    return new Promise((resolve, reject) => {
        request.addEventListener("load", (e) => {
            const res = request.response;
            if (res == null) {
                console.log("failed to fetch favorites list");
                reject();
            }
            const favorites = res.favoriteSiteIds as [string];
            const sitesInfo = getSiteIdAndHrefSiteNameMap();
            const currentFavoriteSite = getCurrentFavoritesSite();
            for (const favorite of favorites.slice(0, MAX_FAVORITES)) {
                // skip if favorite is the current site
                if (getCourseSiteID(window.location.href) === favorite) continue;

                const siteInfo = sitesInfo.get(favorite);
                if (siteInfo === undefined) continue;
                const href = siteInfo.href;
                const title = siteInfo.title;

                // skip if the site is already shown
                if (currentFavoriteSite.find((c) => c == href) != null) continue;

                pinnedSiteList.appendChild(createSidebarFavoriteItem(favorite, href, title));
            }
            resolve();
        });
        request.send();
    });
};

async function editFavoritesMessage(): Promise<void> {
    // Wait 200ms until jQuery finished generating message.
    await new Promise((r) => setTimeout(r, 200));
    try {
        const message = document.getElementsByClassName("favorites-max-marker")[0];
        message.innerHTML = `<i class='fa fa-bell warning-icon'></i><b>${chrome.i18n.getMessage("favorites", chrome.runtime.getManifest().name)}</b>`;
        const lectureTabs = document.getElementsByClassName("fav-sites-entry");
        const lectureTabsCount = lectureTabs.length;
        for (let i = 0; i < lectureTabsCount; i++) {
            lectureTabs[i].classList.remove("site-favorite-is-past-max");
        }
    } catch (e) {
        console.log("could not edit message");
    }
}
