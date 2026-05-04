const statusColors = {
  todo: "bg-gray-100 text-gray-700",
  "in-progress": "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
};

const priorityColors = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

const Badge = ({ type = "status", value }) => {
  const colorMap = type === "status" ? statusColors : priorityColors;
  const color = colorMap[value] || "bg-gray-100 text-gray-700";
  return (
    <span className={`badge ${color} capitalize`}>
      {value?.replace("-", " ")}
    </span>
  );
};

export default Badge;
