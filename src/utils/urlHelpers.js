export function isValidURL(input) {
    try {
        new URL(input);
        return true;
    } catch {
        return false;
    }
}