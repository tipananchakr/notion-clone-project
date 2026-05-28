type EdgeStoreFileBucket = {
  delete: (input: { url: string }) => Promise<unknown>;
};

export function isEdgeStoreFileUrl(url: string) {
  try {
    const { hostname } = new URL(url);
    return hostname.endsWith('edgestore.dev');
  } catch {
    return false;
  }
}

export async function deleteEdgeStoreFileByUrl(
  bucket: EdgeStoreFileBucket,
  url?: string | null,
) {
  if (!url || !isEdgeStoreFileUrl(url)) {
    return;
  }

  await bucket.delete({ url });
}
