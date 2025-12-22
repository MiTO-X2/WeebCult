/***********************************************************************
 * PURPOSE:
 *   - Fetch anime of an image via DH2642 proxy
 *   - Normalize response
 *   - Return clean Promise
 ***********************************************************************/
import { PROXY_KEY, GROUP_NUMBER, PROXY_URL_TRACEMOE } from "./apiConfig.js";
export async function traceMoeSearch(imageUrl) {
    const requestURL = `${PROXY_URL_TRACEMOE}/search?url=${encodeURIComponent(imageUrl)}`;
    try {
        const res = await fetch(requestURL, {
            method: "GET",
            headers: {
                "X-DH2642-Key": PROXY_KEY,
                "X-DH2642-Group": GROUP_NUMBER
            }
        });

        if (!res.ok) throw new Error(`Trace.moe error: ${res.status}`);
        const data = await res.json();

        if (!data.result || data.result.length === 0) return null;

        return data.result.map(result => ({
            filename: result.filename,
            episode: result.episode,
            similarity: result.similarity,
            image: result.image
        }));
    } catch (err) {
        console.error("Trace.moe search error:", err);
        return null;
    }
}