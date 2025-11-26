export function resolvePromise(prms, promiseState, notify) {
    // Reset the promise state
    promiseState.promise = prms;
    promiseState.data = null;
    promiseState.error = null;

    // Only run if promise is not null
    if (!prms) return;

    // Define callbacks with access to promiseState
    function dataACB(result) {
        // Check for race condition
        if (promiseState.promise === prms) {
            promiseState.data = result;
            console.log("Promise resolved! Data:", result); // console check only
            notify();
        }
    }

    function errorACB(err) {
        // Check for race condition
        if (promiseState.promise === prms) {
            promiseState.error = err;
            console.log("Promise error:", err); // console check only
            notify();
        }
    }

    // Attach callbacks to the promise
    prms.then(dataACB).catch(errorACB);
}
