import PageTurner from "../PageTurner/PageTurner";
import TableFilter from "../TableFilter/TableFilter";
import "./ContentTable.scss";

function ContentTable(props) {
    return (
        <div>
            <div className="table-nav">
                <TableFilter></TableFilter>
                <PageTurner curPage="1" totalPage="233"></PageTurner>
            </div>
        </div>
    )
}

export default ContentTable;