export default function api(path: string, options?: RequestInit) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const url = `${baseUrl}${path}`;
  return fetch(url, options);
}
