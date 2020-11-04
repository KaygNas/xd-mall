import "./StatusFilter.scss";

function StatusFilter(props) {
    let totalQty = props.status.reduce((acc, cur) => { return acc + cur.itemQty; }, 0);
    let status = [...props.status];
    status.unshift({ status: "全部", itemQty: totalQty });
    return (
        <ul className="status-filter">
            {
                status.map((item, index) => {
                    return (
                        <li
                            key={index}
                            className={"status-filter__item " + (props.statusIdx === index ? "current" : "")}
                            onClick={() => { props.selectStatus(index); }}
                        >
                            <a>{item.status + "(" + item.itemQty + ")"}</a>
                        </li>
                    );
                })
            }
        </ul >
    )
}

export default StatusFilter;