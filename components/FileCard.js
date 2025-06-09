export default function FileCard({ name, mimeType }) {
  const icon = mimeType.includes("video") ? "🎥" : "📄";
  return (
    <div className="border rounded p-4 flex items-center gap-2">
      <span className="text-2xl">{icon}</span>
      <span>{name}</span>
    </div>
  );
}
