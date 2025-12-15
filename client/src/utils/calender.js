export default function MonthGrid({ days }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 18px)", // smaller column width
        gap: "1px", // LESS GAP
        marginBottom: "20px",
      }}
    >
      {days.map((day, i) => {
        return (
          <div
            key={i}
            style={{
              width: "15px",
              height: "15px",
              background: day.done ? "green" : "#eee",
              borderRadius: "3px",
            }}
          ></div>
        );
      })}
    </div>
  );
}
