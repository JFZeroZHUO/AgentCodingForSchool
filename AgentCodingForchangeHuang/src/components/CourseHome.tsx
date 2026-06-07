"use client";

import { useEffect, useMemo, useState } from "react";
import CourseCard from "@/components/CourseCard";
import { courses, courseWeeks, type CourseCategory } from "@/data/courses";
import { COURSE_PROGRESS_EVENT, readCompletedCourses } from "@/lib/course-progress";
import { getCategoryLabel, getProgressCopy } from "@/lib/course-utils";

const categories: CourseCategory[] = ["all", "web", "data", "apps", "agent", "bonus"];

export default function CourseHome() {
  const [activeCategory, setActiveCategory] = useState<CourseCategory>("all");
  const [activeWeek, setActiveWeek] = useState("all");
  const [completedCourses, setCompletedCourses] = useState<Set<string>>(() => new Set());
  const progress = getProgressCopy();

  useEffect(() => {
    const syncCompletedCourses = () => {
      setCompletedCourses(new Set(readCompletedCourses()));
    };

    syncCompletedCourses();
    window.addEventListener("storage", syncCompletedCourses);
    window.addEventListener(COURSE_PROGRESS_EVENT, syncCompletedCourses);

    return () => {
      window.removeEventListener("storage", syncCompletedCourses);
      window.removeEventListener(COURSE_PROGRESS_EVENT, syncCompletedCourses);
    };
  }, []);

  const visibleWeeks = useMemo(() => {
    return courseWeeks.filter((week) => activeCategory === "all" || week.category === activeCategory);
  }, [activeCategory]);

  const visibleCourses = useMemo(() => {
    return courses.filter((course) => {
      const categoryMatch = activeCategory === "all" || course.category === activeCategory;
      const weekMatch = activeWeek === "all" || course.week === activeWeek;
      return categoryMatch && weekMatch;
    });
  }, [activeCategory, activeWeek]);

  const changeCategory = (category: CourseCategory) => {
    setActiveCategory(category);
    setActiveWeek("all");
  };

  return (
    <main className="site-shell">
      <nav className="top-nav">
        <div className="brand-mark">
          <span className="brand-stamp">AI</span>
          <div>
            <strong>风变黄叔AI编程学习路径</strong>
            <small>零基础 AI 协同学习平台</small>
          </div>
        </div>
        <div className="nav-note">课程排期来自风变教研组</div>
      </nav>

      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">项目制学习路径 · 风变教研组排课</span>
          <h1>从第一个网页，到自己的 Agent Skills 工作流</h1>
          <p>
            课程目录按你的学习路径重新编排，视频、作业和教学 HTML 文档都收进同一个学习工作台。
          </p>
        </div>
        <div className="progress-board" aria-label="课程统计">
          <div>
            <strong>{progress.total}</strong>
            <span>总课程</span>
          </div>
          <div>
            <strong>{progress.requiredCourses}</strong>
            <span>主线课</span>
          </div>
          <div>
            <strong>{progress.bonusCourses}</strong>
            <span>赠送课</span>
          </div>
        </div>
      </section>

      <section className="course-layout">
        <aside className="syllabus-panel">
          <div className="directory-heading">
            <span aria-hidden="true">▦</span>
            <span>课程大纲目录</span>
          </div>

          <div className="category-tabs">
            {categories.map((category) => (
              <button
                key={category}
                className={activeCategory === category ? "active" : ""}
                type="button"
                onClick={() => changeCategory(category)}
              >
                <span aria-hidden="true">{category === "bonus" ? "✦" : "↗"}</span>
                {getCategoryLabel(category)}
              </button>
            ))}
          </div>

          <div className="week-list">
            <button className={activeWeek === "all" ? "active" : ""} type="button" onClick={() => setActiveWeek("all")}>
              <span>全部阶段</span>
              <small>{visibleCourses.length}</small>
            </button>

            {visibleWeeks.map((week) => (
              <button
                key={week.label}
                className={activeWeek === week.label ? "active" : ""}
                type="button"
                onClick={() => setActiveWeek(week.label)}
              >
                <span>{week.label}</span>
                <small>{week.courseCount}</small>
              </button>
            ))}
          </div>
        </aside>

        <div className="course-feed">
          <div className="feed-header">
            <div>
              <span className="eyebrow">Course Catalog</span>
              <h2>{activeWeek === "all" ? getCategoryLabel(activeCategory) : activeWeek}</h2>
            </div>
            <p>{visibleCourses.length} 节课</p>
          </div>

          <div className="course-grid">
            {visibleCourses.map((course) => (
              <CourseCard key={course.slug} course={course} completed={completedCourses.has(course.slug)} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
