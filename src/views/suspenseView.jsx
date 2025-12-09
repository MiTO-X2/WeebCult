// 3rd-party spinner React component (component made by others)
import { MoonLoader } from "react-spinners";

export function SuspenseView(props) {
    // Case 1: No promise
    if (!props.promise) {
        return <span>no data</span>;
    }

    // Case 2: Promise exists but has an error
    if (props.error) {
        return <span>{props.error.toString()}</span>;
    }

    // Case 3: Promise exists and is pending (no error yet)
    return (
        <div className="suspense-loader">
            <MoonLoader size={100} color="#b673ff" />
        </div>
    );
}