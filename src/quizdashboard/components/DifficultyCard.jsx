export default function DifficultyCard({ title, subtitle, img, selected, onSelect }) {
  return (
    <div className={`diff-card ${selected ? "selected" : ""}`}>
      <div className="diff-text">
        <h3>{title}</h3>
        <p>{subtitle}</p>
        <button type="button" className="btn" onClick={onSelect}>
          Välj
        </button>
      </div>

      <div className="diff-media">
        <img src={img} alt={title} />
      </div>
    </div>
  );
}
