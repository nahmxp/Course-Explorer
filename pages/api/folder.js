import { google } from "googleapis";

const jwtClient = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/drive.readonly"]
});

export default async function handler(req, res) {
  const { link } = req.body;
  const folderIdMatch = link.match(/[-\w]{25,}/);
  if (!folderIdMatch) return res.status(400).json({ error: "Invalid link" });
  const folderId = folderIdMatch[0];

  const drive = google.drive({ version: "v3", auth: jwtClient });
  const resp = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: "files(id,name,mimeType,thumbnailLink,webViewLink)",
    pageSize: 50
  });

  res.status(200).json(resp.data.files);
}
