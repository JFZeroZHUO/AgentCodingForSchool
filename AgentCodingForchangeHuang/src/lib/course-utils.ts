import { courses, courseWeeks, type Course, type CourseCategory } from "@/data/courses";

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((course) => course.slug === slug);
}

export function getCourseNeighbors(slug: string) {
  const index = courses.findIndex((course) => course.slug === slug);

  return {
    previous: index > 0 ? courses[index - 1] : undefined,
    next: index >= 0 && index < courses.length - 1 ? courses[index + 1] : undefined,
  };
}

export function getCoursesByWeek(week: string): Course[] {
  return courses.filter((course) => course.week === week);
}

export function getCategoryLabel(category: CourseCategory): string {
  const labels: Record<CourseCategory, string> = {
    all: "全部课程",
    web: "网页基础",
    data: "数据与支付",
    apps: "小程序与插件",
    agent: "Agent Skills",
    bonus: "赠送课",
  };

  return labels[category];
}

export function getCategoryWeeks(category: CourseCategory) {
  if (category === "all") return courseWeeks;
  return courseWeeks.filter((week) => week.category === category);
}

export function formatCourseTitle(title: string): string {
  return title
    .replace(/_\d+_\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}_点播视频回放/g, "")
    .replace(/_点播视频回放/g, "")
    .replace(/风变xAI产品黄叔：/g, "")
    .replace(/黄叔AI编程：/g, "")
    .trim();
}

export function getProgressCopy() {
  const requiredCourses = courses.filter((course) => !course.isBonus).length;
  const bonusCourses = courses.filter((course) => course.isBonus).length;

  return {
    total: courses.length,
    requiredCourses,
    bonusCourses,
    weeks: courseWeeks.length,
  };
}
