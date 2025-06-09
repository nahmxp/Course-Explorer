import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FolderCard from "@/components/FolderCard";
import FileCard from "@/components/FileCard";
import Layout from "@/components/Layout";
import axios from "axios";

export default function FolderView() {
  const { encodedLink } = useRouter().query;
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!encodedLink) return;
    (async () => {
      const link = decodeURIComponent(encodedLink);
      const res = await axios.post("/api/folder", { link });
      setItems(res.data);
    })();
  }, [encodedLink]);

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((it) =>
          it.mimeType === "application/vnd.google-apps.folder" ? (
            <FolderCard key={it.id} title={it.name} link={it.id} folderPage />
          ) : (
            <FileCard key={it.id} name={it.name} mimeType={it.mimeType} />
          )
        )}
      </div>
    </Layout>
  );
}
