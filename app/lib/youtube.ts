/**
 * YouTube URL'den embed için video ID çıkarır.
 * Desteklenen formatlar: watch?v=ID, youtu.be/ID
 */
export function getYoutubeEmbedId(url: string): string | null {
  if (!url) return null;
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];
  const shortMatch = url.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];
  return null;
}

export function getYoutubeEmbedUrl(url: string): string | null {
  const id = getYoutubeEmbedId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}
