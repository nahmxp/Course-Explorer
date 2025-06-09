export default function FolderCard({ title, link, folderPage }) {
  const href = folderPage
    ? `/folder/${encodeURIComponent(link)}`
    : link;
  return (
    <div className="border rounded p-4 hover:shadow cursor-pointer">
      <a href={href} className="text-lg font-medium">{title}</a>
    </div>
  );
}
