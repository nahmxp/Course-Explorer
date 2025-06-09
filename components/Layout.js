export default function Layout({ children }) {
  return (
    <div className="min-h-screen p-6 dark:bg-gray-900 dark:text-white">
      <h1 className="text-2xl mb-6">📚 Course Explorer</h1>
      {children}
    </div>
  );
}
