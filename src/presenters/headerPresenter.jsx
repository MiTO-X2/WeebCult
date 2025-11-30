// This a placeholder header presenter, used for testing and debugging
import { HeaderView } from "../views/headerView.jsx";

export function HeaderPresenter() {
    return (
        <HeaderView
            onNavigateHome={() => window.location.href = "/"}
            onProfile={() => window.location.href = "/"}
        />
    );
}
