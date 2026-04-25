declare const google: any;
declare const gapi: any;

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const DISCOVERY_DOC =
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

let tokenClient: any = null;
let accessToken: string | null = null;

export function isGoogleConfigured(): boolean {
  return !!CLIENT_ID;
}

export async function initGoogleDrive(): Promise<void> {
  if (!isGoogleConfigured()) return;

  await new Promise<void>((resolve) => {
    gapi.load('client:picker', async () => {
      await gapi.client.init({
        discoveryDocs: [DISCOVERY_DOC],
      });
      resolve();
    });
  });

  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: (response: any) => {
      if (response.error) throw new Error(response.error);
      accessToken = response.access_token;
    },
  });
}

export async function getAccessToken(): Promise<string> {
  if (accessToken) return accessToken;
  return new Promise((resolve, reject) => {
    tokenClient.callback = (response: any) => {
      if (response.error) reject(new Error(response.error));
      else {
        accessToken = response.access_token;
        resolve(accessToken!);
      }
    };
    tokenClient.requestAccessToken({ prompt: '' });
  });
}

// Export a note as a .md file to Google Drive
export async function exportNoteToDrive(
  title: string,
  content: string
): Promise<string> {
  const token = await getAccessToken();

  const metadata = {
    name: `${title}.md`,
    mimeType: 'text/markdown',
    parents: [],
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append('file', new Blob([content], { type: 'text/markdown' }));

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    }
  );

  if (!response.ok) {
    throw new Error(`Drive upload failed: ${response.statusText}`);
  }

  const file = await response.json();
  return `https://drive.google.com/file/d/${file.id}/view`;
}

// Open Google Picker to select a file, return its text content
export async function importFileFromDrive(): Promise<{
  name: string;
  content: string;
}> {
  const token = await getAccessToken();

  return new Promise((resolve, reject) => {
    const picker = new google.picker.PickerBuilder()
      .addView(google.picker.ViewId.DOCS)
      .addView(google.picker.ViewId.PRESENTATIONS)
      .setOAuthToken(token)
      .setDeveloperKey('') // not needed for Drive file access with OAuth
      .setCallback(async (data: any) => {
        if (data.action === google.picker.Action.PICKED) {
          const file = data.docs[0];
          try {
            // Export as plain text
            const exportUrl = `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/plain`;
            const res = await fetch(exportUrl, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
              // Try direct download for non-Google files
              const dlRes = await fetch(
                `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              resolve({ name: file.name, content: await dlRes.text() });
            } else {
              resolve({ name: file.name, content: await res.text() });
            }
          } catch (err) {
            reject(err);
          }
        } else if (data.action === google.picker.Action.CANCEL) {
          reject(new Error('cancelled'));
        }
      })
      .build();
    picker.setVisible(true);
  });
}
