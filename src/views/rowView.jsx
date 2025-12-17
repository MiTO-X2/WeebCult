/***********************************************************************
 * PURE UI
 * A single horizontal list of anime (like Netflix)
 ***********************************************************************/

export function RowView(props) {
    return (
        <div className="row-container">

            <h2 className="row-title">{props.title}</h2>

            <div className="row-scroll">
                {props.items?.map(renderItemCB)}
            </div>
        </div>
    );

    function renderItemCB(item, index) {
        return (
            <div key={`${props.title}-${item.id}-${index}`} className="row-item" onClick={() => props.onSelectItem(item)}>
                <img src={item.image} alt={item.title} className="row-item-img" />
                <p className="row-item-title">{item.title}</p>
            </div>
        );
    }
}
