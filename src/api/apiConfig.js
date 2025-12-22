// Replace GROUP_NUMBER with the actual group number (group 10), if stated by the project coach
// Currently the group number is the last 3 digits of my canvas ID
export const GROUP_NUMBER = "808";

// The proxy is needed because API has strict CORS.
// This wraps any URL after the group number as we did for the lab.

// API 1 (Jikan API)
export const PROXY_URL = `https://brfenergi.se/iprog/group/${GROUP_NUMBER}/https://api.jikan.moe/v4`;

// API 2 (Nekos API)
export const PROXY_URL_NEKO = `https://brfenergi.se/iprog/group/${GROUP_NUMBER}`;

// Same key used in the lab
export const PROXY_KEY="3d2a031b4cmsh5cd4e7b939ada54p19f679jsn9a775627d767"