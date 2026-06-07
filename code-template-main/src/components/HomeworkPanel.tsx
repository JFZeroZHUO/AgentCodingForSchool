interface HomeworkPanelProps {
  homework: string[];
}

export default function HomeworkPanel({ homework }: HomeworkPanelProps) {
  return (
    <section className="homework-panel">
      <div className="panel-title">
        <span aria-hidden="true">✓</span>
        <h2>本课作业要求</h2>
      </div>

      <ol>
        {homework.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>

      <button className="submit-work" type="button">
        <span aria-hidden="true">↑</span>
        上传并提交学习成果
      </button>
    </section>
  );
}
