import Link from "next/link";
import { notFound } from "next/navigation";
import CourseCompletionButton from "@/components/CourseCompletionButton";
import CourseVideoPlayer from "@/components/CourseVideoPlayer";
import HomeworkPanel from "@/components/HomeworkPanel";
import { courses } from "@/data/courses";
import { formatCourseTitle, getCourseBySlug, getCourseNeighbors } from "@/lib/course-utils";

interface CoursePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return courses.map((course) => ({
    slug: course.slug,
  }));
}

export async function generateMetadata({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  return {
    title: course ? `${formatCourseTitle(course.title)} | 风变黄叔AI编程学习路径` : "课程不存在",
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const { previous } = getCourseNeighbors(course.slug);

  return (
    <main className="classroom-shell">
      <header className="classroom-topbar">
        <Link className="back-link" href="/">
          <span aria-hidden="true">←</span>
          返回课程大纲
        </Link>

        <div className="classroom-title">
          <span>{course.week}</span>
          <strong>{formatCourseTitle(course.title)}</strong>
        </div>

        <div className="classroom-meta">第 {course.sequence} 课</div>
      </header>

      <section className="classroom-grid">
        <div className="learning-column">
          <section className="video-section">
            <div className="panel-title">
              <span aria-hidden="true">▣</span>
              <h1>课程视频</h1>
            </div>
            <CourseVideoPlayer title={course.title} videoUrl={course.videoUrl} />
          </section>

          <HomeworkPanel homework={course.homework} />

          {previous ? (
            <nav className="lesson-nav lesson-nav-single" aria-label="上一课">
              <Link href={`/courses/${previous.slug}`}>
                <span aria-hidden="true">←</span>
                上一课
              </Link>
            </nav>
          ) : null}
        </div>

        <aside className="document-column">
          <div className="document-header">
            <div>
              <span className="eyebrow">HTML Document</span>
              <h2>教学文档</h2>
            </div>
            <a href={course.docPath} target="_blank" rel="noreferrer">
              新窗口打开
            </a>
          </div>

          <iframe title={`${course.title} 教学文档`} src={course.docPath} className="document-frame" />

          <div className="document-completion">
            <CourseCompletionButton slug={course.slug} title={course.title} />
          </div>
        </aside>
      </section>
    </main>
  );
}
