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
export function searchAnime(query) {
    const url = PROXY_URL + "/anime?q=" + encodeURIComponent(query) + "&limit=20";

    return fetch(url, {
    method: "GET",
    headers: {
        "X-DH2642-Key": PROXY_KEY,
        "X-DH2642-Group": GROUP_NUMBER
    }
    })
    .then(checkStatusACB)
    .then(handleAnimeSearchJSONACB);    // this extract the 'data' array from the JSON response
} 

/***************************************************************
 *  GET TOP ANIME LIST (TRENDING)
 ***************************************************************/
export function getTopAnime() {
    const url = PROXY_URL + "/top/anime?limit=20";

    return fetch(url, {
        method: "GET",
        headers: {
            "X-DH2642-Key": PROXY_KEY,
            "X-DH2642-Group": GROUP_NUMBER
        }
    })
        .then(checkStatusACB)
        .then(handleAnimeSearchJSONACB);   // same data format
}

/***************************************************************
 *  GET GENRES
 ***************************************************************/
export function getGenres() {
    const url = PROXY_URL + "/genres/anime";

    return fetch(url, {
        method: "GET",
        headers: {
            "X-DH2642-Key": PROXY_KEY,
            "X-DH2642-Group": GROUP_NUMBER
        }
    })
        .then(checkStatusACB)
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

    return fetch(url, {
        method: "GET",
        headers: {
            "X-DH2642-Key": PROXY_KEY,
            "X-DH2642-Group": GROUP_NUMBER
        }
    })
        .then(checkStatusACB)
        .then(handleAnimeSearchJSONACB);
}

/***************************************************************
 *  GET CHARACTERS FOR A GIVEN ANIME ID
 *  Example: getAnimeCharacters(20)
 ***************************************************************/
export function getAnimeCharacters(animeID) {
    const url = PROXY_URL + "/anime/" + animeID + "/characters";

    return fetch(url, {
    method: "GET",
    headers: {
        "X-DH2642-Key": PROXY_KEY,
        "X-DH2642-Group": GROUP_NUMBER
    }
    })
    .then(checkStatusACB)
    .then(handleAnimeCharactersJSONACB);    // Transform characters into a standard format
}

/***************************************************************
 *  GET ANIME FROM GIVEN ID
 ***************************************************************/
export function getAnimeById(animeID) {
    const url = PROXY_URL + "/anime/" + animeID;

    return fetch(url, {
    method: "GET",
    headers: {
        "X-DH2642-Key": PROXY_KEY,
        "X-DH2642-Group": GROUP_NUMBER
    }
    })
    .then(checkStatusACB)
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
        rating: a.rating
    };
}

/*function transformAnimeCB(a) {
    return {
        id: a.mal_id,
        title: a.title,
        image: a.images && a.images.jpg ? a.images.jpg.image_url : "",
        score: a.score,
        year: a.year
    };
}*/


// function for handling the JSON response of getAnimeCharacters
function handleAnimeCharactersJSONACB(json) {
    // Transform each character object into the standard format
    return json.data.map(transformCharacterCB);
}

// Standardize the character format for the app
function transformCharacterCB(c) {
    return {
    id: c.character.mal_id,                     // Character ID from MyAnimeList
    name: c.character.name,                     // Character name
    image: c.character.images.jpg.image_url,    // Character image URL
    role: c.role                                // Role in the anime (main, supporting, etc.)
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