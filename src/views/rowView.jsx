/***********************************************************************
 * PURE UI
 * A single horizontal list of anime (like Netflix)
 ***********************************************************************/

export function RowView(props) {
    return (
        <div className="row-container">

            <h2 className="row-title">{props.title}</h2>

            <div className="row-scroll">
                {props.items?.map(item =>
                    <div
                        key={item.id}
                        className="row-item"
                        onClick={() => props.onSelectItem(item)}
                    >
                        <img
                            src={item.image}
                            alt={item.title}
                            className="row-item-img"
                        />
                        <p className="row-item-title">{item.title}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
