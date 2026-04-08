import { DueCategory, getClosestTime, getDaysUntil } from "../utils";
import { Settings } from "../features/setting/types";
import { EntityProtocol, EntryProtocol } from "../features/entity/type";
import { MaxTimestamp } from "../constant";

const dueCategoryClassMap: { [key in DueCategory]: string } = {
    dueVerySoon: "cs-tab-danger",
    dueSoon: "cs-tab-warning",
    dueMiddle: "cs-tab-success",
    dueLater: "cs-tab-other",
    duePassed: ""
};

type CourseMap = Map<string, { entries: EntryProtocol[]; isRead: boolean }>;
type DueMap = Map<string, { due: DueCategory; isRead: boolean }>;
type SiteNavItem = {
    courseID: string;
    classTargets: HTMLElement[];
    badgeTarget: HTMLElement;
};

const createCourseMap = (entities: EntityProtocol[]): CourseMap => {
    const courseMap = new Map<string, { entries: EntryProtocol[]; isRead: boolean }>();
    for (const entity of entities) {
        let entries = courseMap.get(entity.course.id);
        if (entries === undefined) {
            entries = { entries: [], isRead: true };
            courseMap.set(entity.course.id, entries);
        }
        entries.entries.push(...entity.entries);
        entries.isRead = entries.isRead && (entity.isRead || entity.entries.length === 0);
    }
    return courseMap;
};

const createDueMap = (settings: Settings, courseMap: CourseMap): DueMap => {
    const dueMap = new Map<string, { due: DueCategory; isRead: boolean }>();
    for (const [courseID, entries] of courseMap.entries()) {
        if (entries.entries.length === 0) continue;
        const closestTime = getClosestTime(settings, entries.entries);
        if (closestTime === MaxTimestamp) continue;
        const daysUntilDue = getDaysUntil(settings, settings.appInfo.currentTime, closestTime);
        dueMap.set(courseID, { due: daysUntilDue, isRead: entries.isRead });
    }
    return dueMap;
};

const getCourseIDFromHref = (href: string): string | undefined => {
    const hrefContent = href.match("(https?://[^/]+)/portal/site-?[a-z]*/([^/?#]+)");
    return hrefContent?.[2];
};

const getSiteNavItems = (): SiteNavItem[] => {
    const sidebarItems = Array.from(document.querySelectorAll(".site-list-item[data-site]"))
        .map((element) => {
            const link = element.querySelector(".sidebar-site-title") as HTMLAnchorElement | null;
            const courseID = element.getAttribute("data-site") ?? (link?.href ? getCourseIDFromHref(link.href) : undefined);
            if (link === null || courseID === undefined) {
                return null;
            }

            const linkBlock = element.querySelector(".site-link-block") as HTMLElement | null;
            const classTargets = [element as HTMLElement, link];
            if (linkBlock !== null) {
                classTargets.push(linkBlock);
            }

            return {
                courseID,
                classTargets,
                badgeTarget: linkBlock ?? (element as HTMLElement)
            };
        })
        .filter((item): item is SiteNavItem => item !== null);

    return sidebarItems;
};

/**
 * Add notification badge for new Assignment/Quiz
 */
export async function createFavoritesBar(settings: Settings, entities: EntityProtocol[]): Promise<void> {
    const courseMap = createCourseMap(entities);
    const dueMap = createDueMap(settings, courseMap);

    for (const navItem of getSiteNavItems()) {
        const courseInfo = dueMap.get(navItem.courseID);
        if (courseInfo === undefined) continue;

        const tabClass = dueCategoryClassMap[courseInfo.due];
        // Apply color to course button
        if (tabClass !== "") {
            for (const target of navItem.classTargets) {
                target.classList.add(tabClass);
            }
        }
        // Put notification badge
        if (!courseInfo.isRead) {
            navItem.badgeTarget.classList.add("cs-notification-badge");
            if (navItem.badgeTarget.style.position === "") {
                navItem.badgeTarget.style.position = "relative";
                navItem.badgeTarget.dataset.csPositionManaged = "true";
            }
        }
    }
};

export const resetFavoritesBar = (): void => {
    const classList = ["cs-notification-badge", "cs-tab-danger", "cs-tab-warning", "cs-tab-success", "cs-tab-other"];
    for (const c of classList) {
        const q = document.querySelectorAll(`.${c}`);
        for (const element of Array.from(q)) {
            const target = element as HTMLElement;
            target.classList.remove(`${c}`);
            if (target.dataset.csPositionManaged === "true") {
                target.style.position = "";
                delete target.dataset.csPositionManaged;
            }
        }
    }
}
