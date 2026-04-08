import { Assignment } from "../entity/assignment/types";
import { Quiz } from "../entity/quiz/types";
import { Course } from "../course/types";
import { decodeAssignmentFromAPI } from "../entity/assignment/decode";
import { decodeQuizFromAPI } from "../entity/quiz/decode";

/* Sakai のURLを取得する */
export const getBaseURL = (): string => {
    let baseURL = "";
    const match = location.href.match("(https?://[^/]+)/portal");
    if (match) {
        baseURL = match[1];
    }
    return baseURL;
};

const shouldSkipCourse = (courseId: string): boolean => {
    return courseId.startsWith("~") || courseId.startsWith("!");
};

const addCourse = (courses: Map<string, Course>, course: Course): void => {
    if (shouldSkipCourse(course.id) || courses.has(course.id)) {
        return;
    }
    courses.set(course.id, course);
};

/* Sakai のお気に入り欄からCourseを取得する */
export const fetchCourse = (): Array<Course> => {
    const baseURL = getBaseURL();
    const courses = new Map<string, Course>();

    const sidebarEntries = Array.from(document.querySelectorAll(".site-list-item[data-site]"));
    for (const elem of sidebarEntries) {
        const anchor = elem.querySelector(".sidebar-site-title") as HTMLAnchorElement | null;
        const courseId = elem.getAttribute("data-site");
        if (anchor === null || courseId === null) {
            continue;
        }

        addCourse(courses, {
            id: courseId,
            name: anchor.title || anchor.textContent?.trim() || courseId,
            link: anchor.href || baseURL + "/portal/site/" + courseId
        });
    }

    return Array.from(courses.values());
};

/* Sakai APIから課題を取得する */
export const fetchAssignment = (course: Course): Promise<Assignment> => {
    const queryURL = getBaseURL() + "/direct/assignment/site/" + course.id + ".json";
    return new Promise((resolve, reject) => {
        fetch(queryURL, { cache: "no-cache" })
            .then(async (response) => {
                if (response.ok) {
                    const data = await response.json();
                    const assignmentEntries = decodeAssignmentFromAPI(data);
                    resolve(new Assignment(course, assignmentEntries, false));
                } else {
                    reject(`Request failed: ${response.status}`);
                }
            })
            .catch((err) => console.error(err)); // Error: Request failed: 404
    });
};

/* Sakai APIからクイズを取得する */
export const fetchQuiz = (course: Course): Promise<Quiz> => {
    const queryURL = getBaseURL() + "/direct/sam_pub/context/" + course.id + ".json";
    return new Promise((resolve, reject) => {
        fetch(queryURL, { cache: "no-cache" })
            .then(async (response) => {
                if (response.ok) {
                    const data = await response.json();
                    const quizEntries = decodeQuizFromAPI(data);
                    resolve(new Quiz(course, quizEntries, true));
                } else {
                    reject(`Request failed: ${response.status}`);
                }
            })
            .catch((err) => console.error(err)); // Error: Request failed: 404
    });
};
