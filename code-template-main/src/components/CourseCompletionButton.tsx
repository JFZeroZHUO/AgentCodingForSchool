"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isCourseCompleted, markCourseCompleted } from "@/lib/course-progress";

interface CourseCompletionButtonProps {
  slug: string;
  title: string;
}

export default function CourseCompletionButton({ slug, title }: CourseCompletionButtonProps) {
  const router = useRouter();
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCompleted(isCourseCompleted(slug));
  }, [slug]);

  const completeCourse = () => {
    markCourseCompleted(slug);
    setCompleted(true);
    router.push("/");
  };

  return (
    <button
      className={`complete-course ${completed ? "is-completed" : ""}`}
      type="button"
      onClick={completeCourse}
      aria-label={`标记已完成并返回课程首页：${title}`}
    >
      <span aria-hidden="true">✓</span>
      <strong>{completed ? "已完成，返回课程首页" : "我已完成本课学习"}</strong>
    </button>
  );
}
