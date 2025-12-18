/***************************************************************
 *  =========  FILE RESPONSIBILITIES =========
 *
 *  This file handles ALL external communication with Jikan API.
 *  - Builds correct API URLs
 *  - Performs fetch()
 *  - Validates HTTP response
 *  - Normalizes / transforms JSON
 *  - Returns clean Promises (standard Promise results)
 *
 *  MUST NOT:
 *      - Touch Redux (Modify Redux state)
 *      - Modify UI (Contain UI logic)
 *      - Access presenters or views
 *
 *  ALL thunks (Redux Toolkit) call these functions.
 *
 ***************************************************************/

import { PROXY_URL, PROXY_KEY, GROUP_NUMBER, PROXY_URL_FACTS, PROXY_URL_LINK } from "./apiConfig.js";

/***************************************************************
 *  SEARCH ANIME BY NAME
 *  Example: searchAnime("naruto")
 ***************************************************************/
export function searchAnime(query, filters = {}) {
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    params.append("limit", 20);

    // Optional filters
    if (filters.type) params.append("type", filters.type);        // TV, Movie, OVA
    if (filters.status) params.append("status", filters.status);  // Airing, Completed, Upcoming
    if (filters.rating) params.append("rating", filters.rating);  // G, PG, R, etc.
    if (filters.genres && filters.genres.length > 0) {
        // Assuming API allows comma-separated genres
        params.append("genres", filters.genres.join(","));
    }
    if (filters.orderBy) params.append("order_by", filters.orderBy.toLowerCase());

    // const url = PROXY_URL + "/anime?q=" + encodeURIComponent(query) + "&limit=20";
    const url = `${PROXY_URL}/anime?${params.toString()}`;

    return fetchWithRetry(url, {
        method: "GET",
        headers: {
            "X-DH2642-Key": PROXY_KEY,
            "X-DH2642-Group": GROUP_NUMBER
        }
    })
    .then(handleAnimeSearchJSONACB);
        // this extract the 'data' array from the JSON response
} 

/***************************************************************
 *  GET TOP ANIME LIST (TRENDING)
 ***************************************************************/
export function getTopAnime() {
    const url = PROXY_URL + "/top/anime?limit=20";

    return fetchWithRetry(url, {
        method: "GET",
        headers: {
            "X-DH2642-Key": PROXY_KEY,
            "X-DH2642-Group": GROUP_NUMBER
        }
    })
    .then(handleAnimeSearchJSONACB);
}

/***************************************************************
 *  GET GENRES
 ***************************************************************/
export function getGenres() {
    const url = PROXY_URL + "/genres/anime";

    return fetchWithRetry(url, {
        method: "GET",
        headers: {
            "X-DH2642-Key": PROXY_KEY,
            "X-DH2642-Group": GROUP_NUMBER
        }
    })
    .then(handleGenresJSONACB);

}

function handleGenresJSONACB(json) {
    return json.data.map(transformGenreCB);
}

function transformGenreCB(g) {
    return {
        id: g.mal_id,
        name: g.name,
        count: g.count
    };
}

/***************************************************************
 *  GET ANIME LIST BY GENRE ID
 ***************************************************************/
export function getAnimeByGenre(genreID) {
    const url =
        PROXY_URL + "/anime?genres=" + genreID + "&limit=20";

    return fetchWithRetry(url, {
        method: "GET",
        headers: {
            "X-DH2642-Key": PROXY_KEY,
            "X-DH2642-Group": GROUP_NUMBER
        }
    })
    .then(handleAnimeSearchJSONACB);
}

/***************************************************************
 *  GET CHARACTERS FOR A GIVEN ANIME ID
 *  Example: getAnimeCharacters(20)
 ***************************************************************/
export function getAnimeCharacters(animeID) {
    const url = PROXY_URL + "/anime/" + animeID + "/characters";

    return fetchWithRetry(url, {
        method: "GET",
        headers: {
            "X-DH2642-Key": PROXY_KEY,
            "X-DH2642-Group": GROUP_NUMBER
        }
    })
    .then(handleAnimeCharactersJSONACB);    // Transform characters into a standard format
}

/***************************************************************
 *  GET ANIME FROM GIVEN ID
 ***************************************************************/
export function getAnimeById(animeID) {
    const url = PROXY_URL + "/anime/" + animeID;

    return fetchWithRetry(url, {
        method: "GET",
        headers: {
            "X-DH2642-Key": PROXY_KEY,
            "X-DH2642-Group": GROUP_NUMBER
        }
    })
    .then(json => transformSingleAnimeCB(json.data)); 
}                                    

/***************************************************************
 *  TRANSFORMERS CHARACTER DATA
 ***************************************************************/
// function for handling the JSON response of searchAnime
function handleAnimeSearchJSONACB(json) {
    return json.data.map(transformSingleAnimeCB);
}

// Transform single anime object into standard format
function transformSingleAnimeCB(a) {
    return {
        id: a.mal_id,
        title: a.title || a.titles?.[0]?.title || "Unknown Title",
        image: a.images?.jpg?.image_url || "",
        score: a.score,
        year: a.year,
        synopsis: a.synopsis,
        episodes: a.episodes,
        type: a.type,
        rating: normalizeRating(a.rating)
    };
}

function normalizeRating(rating) {
    if (!rating) return "NR";     // Not Rated
    return rating.split(" ")[0];  // "PG-13 - Teens..." -> "PG-13"
}

// function for handling the JSON response of getAnimeCharacters
function handleAnimeCharactersJSONACB(json) {
    // Transform each character object into the standard format
    return json.data.map(transformCharacterCB).filter(c => c.image);
}

// Standardize the character format for the app
function transformCharacterCB(c) {
    let image = c.character.images.jpg.image_url || "";

    // Skip placeholder / unknown images
    const badPatterns = ["question", "placeholder", "no_image", "default", "unknown"];
    if (!image || badPatterns.some(p => image.toLowerCase().includes(p))) {
        image = "";
    }

    return {
    id: c.character.mal_id,                     // Character ID from MyAnimeList
    name: c.character.name,                     // Character name
    image,                                      // Character image URL
    role: c.role,                               // Role in the anime (main, supporting, etc.)
    voice_actors: (c.voice_actors || []).map(va => ({
            id: va.person.mal_id,
            name: va.person.name,
            language: va.language
        }))
    };
}

/***************************************************************
 *  GET RANDOM ANIME FACT
 ***************************************************************/
export function getRandomAnimeFact() {
    const url = PROXY_URL_FACTS + "/all";

    return fetch(url, {
        method: "GET",
        headers: {
            "X-DH2642-Key": PROXY_KEY,
            "X-DH2642-Group": GROUP_NUMBER
        }
    })
    .then(checkStatusACB)
    .then(transformAnimeFactJSONACB);
}

/***************************************************************
 *  TRANSFORMER
 *  Convert API response to a single random fact object
 ***************************************************************/
function transformAnimeFactJSONACB(json) {
    // If no data, return empty values
    if (!json?.data || json.data.length === 0) return { anime: null, fact: null };

    // Pick a random anime
    const randomAnime = json.data[Math.floor(Math.random() * json.data.length)];

    // Pick a random fact from that anime
    const factsArray = randomAnime?.facts || [];
    const randomFact = factsArray.length > 0 
        ? factsArray[Math.floor(Math.random() * factsArray.length)] 
        : "No fact available.";

    return {
        anime: randomAnime.anime_name,
        fact: randomFact
    };
}

/***************************************************************
 *  STATUS CHECKER
 ***************************************************************/
function checkStatusACB(response) {
    if (!response.ok) {
        // Throw an error if response status is not OK (e.g., 404, 500)
        throw new Error("API responded with status: " + response.status);
    }

    // If OK → return JSON promise, convert HTTP response → JS Object
    return response.json();
}

/***************************************************************
 * FETCH WITH RETRY
 * - Retries on rate limit (429)
 * - Exponential backoff
 ***************************************************************/
async function fetchWithRetry(
  url,
  options,
  retries = 3,
  delay = 1000
) {
  try {
    const response = await fetch(url, options);

    // Handle rate limiting explicitly
    if (response.status === 429 && retries > 0) {
      console.warn("Rate limited. Retrying in", delay, "ms");
      await new Promise(res => setTimeout(res, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }

    if (!response.ok) {
      throw new Error("API responded with status: " + response.status);
    }

    return response.json();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise(res => setTimeout(res, delay));
    return fetchWithRetry(url, options, retries - 1, delay * 2);
  }
}

/***************************************************************
 *  Streaming Link API (Kitsu via DH2642 Proxy)
 ***************************************************************/

/**
 * Search Kitsu for anime by text query
 * Returns normalized array of anime objects
 */
export function searchAnimeLinkAPI(query) {
    const url = `${PROXY_URL_LINK}/anime?${encodeURIComponent("filter[text]")}=${encodeURIComponent(query)}`;

    return fetch(url, {
        method: "GET",
        headers: {
            "X-DH2642-Key": PROXY_KEY,
            "X-DH2642-Group": GROUP_NUMBER
        }
    })
    .then(checkStatusACB)
    .then(json => {
        if (!json?.data) return [];
        return json.data.map(transformKitsuAnimeCB);
    });
}

export function getStreamingLinksByAnimeId(animeId) {
    const url = `${PROXY_URL_LINK}/anime/${animeId}?include=streamingLinks`;

    return fetch(url, {
        method: "GET",
        headers: {
            "X-DH2642-Key": PROXY_KEY,
            "X-DH2642-Group": GROUP_NUMBER
        }
    })
    .then(checkStatusACB)
    .then(json => {
        const included = json.included || [];
        return included
            .filter(item => item.type === "streamingLinks" || item.type === "streaming-links" || item.type === "streaming_link")
            .map(transformStreamingLinkCB);
    });
}

/**
 * Search anime by query and fetch first match streaming links
 */
export function searchAnimeAndGetStreamingLinks(query) {
    return searchAnimeLinkAPI(query)
        .then(results => {
            if (!results || results.length === 0) return { anime: null, streamingLinks: [] };

            const first = results[0];
            const kitsuId = first.kitsuId || first.id;

            return getStreamingLinksByAnimeId(kitsuId)
                .then(links => ({
                    anime: first,
                    streamingLinks: links
                }));
        });
}

/***************************************************************
 * Transformers
 ***************************************************************/
function transformKitsuAnimeCB(kitsuObj) {
    const attrs = kitsuObj.attributes || {};
    const poster = attrs.posterImage || {};
    return {
        kitsuId: kitsuObj.id,
        id: kitsuObj.id,
        title: attrs.canonicalTitle || attrs.titles?.en || attrs.titles?.[0] || "Unknown Title",
        image: poster.large || poster.medium || poster.small || "",
        synopsis: attrs.synopsis || "",
        episodes: attrs.episodeCount || attrs.episodes || null,
        type: attrs.showType || attrs.subtype || attrs.type || null,
        score: attrs.averageRating ? Number(attrs.averageRating) : null,
        raw: kitsuObj
    };
}

function transformStreamingLinkCB(item) {
    const attrs = item.attributes || {};
    return {
        id: item.id,
        site: attrs.site || attrs.name || null,
        url: attrs.url || attrs.link || null,
        subtype: attrs.sub_type || attrs.type || null,
        raw: item
    };
}   

/** 
 * searchAnime(query)
 * - Uses Jikan /anime search endpoint
 * - Returns a simplified array of anime objects (from JSON.data)
 * - This will probably be used in a presenter (e.g. AnimeSearchPresenter)
 * 
 * getAnimeCharacters(animeID)
 * - Uses Jikan /anime/{id}/characters endpoint
 * - Returns standardized character objects: {id, name, image, role}
 * - Useful for features like quizzes: show character image → guess name
 * **/