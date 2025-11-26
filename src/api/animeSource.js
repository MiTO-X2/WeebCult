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

import { PROXY_URL, PROXY_KEY, GROUP_NUMBER } from "./apiConfig.js";

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
 *  TRANSFORMERS CHARACTER DATA
 ***************************************************************/
// function for handling the JSON response of searchAnime
function handleAnimeSearchJSONACB(json) {
    return json.data.map(transformAnimeCB);
}

function transformAnimeCB(a) {
    return {
        id: a.mal_id,
        title: a.title,
        image: a.images && a.images.jpg ? a.images.jpg.image_url : "",
        score: a.score,
        year: a.year
    };
}

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