// This a placeholder header presenter, used for testing and debugging
import { HeaderView } from "../views/headerView.jsx";

export function HeaderPresenter() {
    return (
        <HeaderView
            onNavigateHome={() => navigate("/")}
            onProfile={() => navigate("/")}
        />
    );
}
