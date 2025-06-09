export default function FileCard({ name, mimeType }) {
  const icon = mimeType.includes("video") ? "🎥" : "📄";
  return (
    <div className="border rounded p-4 flex flex-col justify-between items-start gap-2 min-h-48">
      <span className="text-2xl">{icon}</span>
      <span>{name}</span>
    </div>
  );
}
