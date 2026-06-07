export const COMPLETED_COURSES_KEY = "huangshu-ai-course-progress";
export const COURSE_PROGRESS_EVENT = "course-progress-updated";

export function readCompletedCourses(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(COMPLETED_COURSES_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function markCourseCompleted(slug: string): string[] {
  const completed = new Set(readCompletedCourses());
  completed.add(slug);
  const nextValue = [...completed];

  window.localStorage.setItem(COMPLETED_COURSES_KEY, JSON.stringify(nextValue));
  window.dispatchEvent(new CustomEvent(COURSE_PROGRESS_EVENT, { detail: nextValue }));

  return nextValue;
}

export function isCourseCompleted(slug: string): boolean {
  return readCompletedCourses().includes(slug);
}
