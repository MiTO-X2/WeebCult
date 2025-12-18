/***********************************************************************
 * PURPOSE:
 *   - Fetch random neko image via DH2642 proxy
 *   - Normalize response
 *   - Return clean Promise
 ***********************************************************************/

import { PROXY_KEY, GROUP_NUMBER, PROXY_URL_NEKO } from "./apiConfig.js";

/***************************************************************
 * GET RANDOM NEKO IMAGE
 ***************************************************************/
export async function getRandomNeko() {
    try {
        // Nekos API full URL
        const targetURL = "https://api.nekosapi.com/v4/images/random";
        const url = `${PROXY_URL_NEKO}/${targetURL}`;

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "X-DH2642-Key": PROXY_KEY,
                "X-DH2642-Group": GROUP_NUMBER
            }
        });
        
        const json = await checkStatusACB(res);
        console.log("Raw Neko API response:", json); 
        return transformNekoJSONACB(json);
    } catch (err) {
        console.error("getRandomNeko error:", err);
        return null; 
    }
}

/***************************************************************
 * TRANSFORMER
 * Normalize API response -> single neko object
 ***************************************************************/
function transformNekoJSONACB(json) {
    if (!json || !Array.isArray(json) || json.length === 0) return null;

    // Find the first "safe" image
    const safeNeko = json.find(neko => neko.rating === "safe");

    if (!safeNeko) return null; // no safe images found

    return {
        id: safeNeko.id,
        image_url: safeNeko.url || null,
        artist: safeNeko.artist_name || null,
        source: safeNeko.source_url || null,
        rating: safeNeko.rating || null
    };
}

/***************************************************************
 * STATUS CHECKER (same pattern as animeSource)
 ***************************************************************/
async function checkStatusACB(response) {
    if (!response.ok) {
        throw new Error("API responded with status: " + response.status);
    }
    return response.json();
}