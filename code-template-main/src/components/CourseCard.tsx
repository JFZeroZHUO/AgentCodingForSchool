"use client";

import Link from "next/link";
import type { Course } from "@/data/courses";
import { formatCourseTitle } from "@/lib/course-utils";

interface CourseCardProps {
  course: Course;
  completed?: boolean;
}

export default function CourseCard({ course, completed = false }: CourseCardProps) {
  const cardClassName = ["course-card", course.isBonus ? "course-card-bonus" : "", completed ? "course-card-completed" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cardClassName}>
      <div className="course-card-badge">
        <span>{course.isBonus ? "赠送" : `W${course.weekOrder}`}</span>
        <small>{course.sequence.toString().padStart(2, "0")}</small>
      </div>

      <div className="course-card-body">
        {completed ? (
          <div className="course-completed-mark">
            <span aria-hidden="true">✓</span>
            <strong>已完成</strong>
          </div>
        ) : null}

        <div className="course-card-meta">
          <span>{course.theme}</span>
          {course.duration ? (
            <span>
              <span aria-hidden="true">◷</span> {course.duration}
            </span>
          ) : (
            <span>
              <span aria-hidden="true">◇</span> 待补充
            </span>
          )}
        </div>

        <h3>{formatCourseTitle(course.title)}</h3>
        <p>{course.description || course.reason || "进入课程，完成本节学习任务与作业。"}</p>
      </div>

      <Link className="course-card-action" href={`/courses/${course.slug}`} aria-label={`进入课程 ${course.title}`}>
        <span aria-hidden="true">▶</span>
        <span>进入学习</span>
      </Link>
    </article>
  );
}
