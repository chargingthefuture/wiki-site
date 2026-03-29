import { useQuery } from "@tanstack/react-query";

/**
 * Fetches raw markdown content from the GitHub wiki.
 */
export function useArticle(repo: string, slug: string) {
  return useQuery({
    queryKey: ['article', repo, slug],
    queryFn: async () => {
      // Reconstruct the full repo path
      const fullRepo = repo === 'mono' ? 'chargingthefuture/mono' : 'chargingthefuture/chargingthefuture';

      // Encode each segment so folder slugs and special chars (for example '#') resolve correctly.
      const encodedSlugPath = slug
        .split('/')
        .map((segment) => encodeURIComponent(segment))
        .join('/');

      const url = `https://raw.githubusercontent.com/wiki/${fullRepo}/${encodedSlugPath}.md`;
      const res = await fetch(url);
      
      if (!res.ok) {
        if (res.status === 404) throw new Error("Transmission lost. Document not found.");
        throw new Error("Failed to decode transmission from the server.");
      }
      
      const text = await res.text();
      return text;
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    retry: 1
  });
}
