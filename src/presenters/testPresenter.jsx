import { useModel } from "../miniModel.js";
import { TestView } from "../views/testView.jsx";

// Presenter component for handling anime search logic
export function TestPresenter(props) {
    // Subscribe to the model using the custom hook
    const model = useModel(props.model);

    // Shortcut to the model's promise state (holds promise, data, and error)
    const ps = model.promiseState;

    // 1. Suspense/loading state
    // If there is no promise, or the promise is pending without data/error, show loading
    if (!ps.promise || (!ps.data && !ps.error)) {
        return <div>Loading...</div>;
    }

    // 2. Error state
    // If the promise rejected, show an error message
    if (ps.error) {
        return <div>Error: {ps.error.toString()}</div>;
    }

    // 3. Success state
    // If the promise has resolved successfully, render the search results view
    return (
        <TestView searchResults={ps.data} />
    );
}
