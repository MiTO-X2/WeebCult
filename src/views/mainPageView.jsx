/***********************************************************************
 * Pure UI.
 * Renders:
 *   - Trending row
 *   - Categories/Genres row
 * Props:
 *   props.trending  (array)
 *   props.genres    (array)
 *   props.comedy
 *   props.sliceOfLife
 *   props.fantasy 
 *   props."More Genres If Desired"
 *   props.onSelectAnime
 ***********************************************************************/

import { RowView } from "./rowView.jsx";

export function MainPageView(props) {

    // TODO:
    // - Call a RowView for trending anime
    // - Call a RowView for genres
    // - Trigger props.onSelectAnime(item)
    // - Trigger props.onSelectGenre(item)
    // - NO side effects


    return (
        <div className="main-page">

            <RowView
                title="Trending"
                items={props.trending}
                onSelectItem={props.onSelectAnime}
            />

            <RowView
                title="Action"
                items={props.action}
                onSelectItem={props.onSelectAnime}
            />

            <RowView
                title="Comedy"
                items={props.comedy}
                onSelectItem={props.onSelectAnime}
            />

            <RowView
                title="Slice of Life"
                items={props.sliceOfLife}
                onSelectItem={props.onSelectAnime}
            />

            <RowView
                title="Fantasy"
                items={props.fantasy}
                onSelectItem={props.onSelectAnime}
            />
        </div>
    );
}
