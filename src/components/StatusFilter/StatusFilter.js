import "./StatusFilter.scss";

function StatusFilter(props) {
    return (
        <ul className="status-filter">
            {
                props.status.map((item, index) => {
                    return (
                        <li
                            key={index}
                            className={"status-filter__item " + (props.curStatus === item.status ? "current" : "")}
                            onClick={() => { props.selectStatus(item.status); }}
                        >
                            <span className="normal-link">
                                {item.status + "(" + item.itemQty + ")"}
                            </span>
                        </li>
                    );
                })
            }
        </ul >
    )
}

export default StatusFilter;