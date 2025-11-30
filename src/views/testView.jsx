export function TestView(props) {
    return (
        <div className="test-view-text">
            <h2>Anime Fetch Results</h2>
            <div>
                {props.searchResults.map(renderAnimeItemCB)}
            </div>
        </div>
    );
}

// Callback function to render a single anime item
function renderAnimeItemCB(item) {
    return (
        <li key={item.id || item.mal_id}>
            {/* anime */}
            {item.title && <b>{item.title}</b>}

            {/* character */}
            {item.name && !item.title && <b>{item.name}</b>}

            {/* genre */}
            {item.name && item.count && <span>{item.name} ({item.count})</span>}
        </li>
    );
}

