/***********************************************************************
 * Pure UI.
 * Renders:
 *   - Rows of anime lists (Trending + Genres)
 * Props:
 *   props.trending
 *   props.genres: array of { label, items }
 *   props.onSelectAnime
 ***********************************************************************/

import { RowView } from "./rowView.jsx";

export function MainPageView(props) {

    return (
        <div className="main-page">

            {/* Trending */}
            {props.trending?.length > 0 && (
                <RowView
                    title="Trending"
                    items={props.trending}
                    onSelectItem={props.onSelectAnime}
                />
            )}

            {/* Dynamic list of genre rows */}
            {props.genres?.map((g) => (
                <RowView
                    key={g.label}
                    title={g.label}
                    items={g.items}
                    onSelectItem={props.onSelectAnime}
                />
            ))}

        </div>
    );
}
