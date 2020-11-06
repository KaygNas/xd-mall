import PageTurner from "../PageTurner/PageTurner";
import TableFilter from "../TableFilter/TableFilter";
import "./ContentTable.scss";

function ContentTable(props) {
    return (
        <div>
            <div className="table-nav">
                {
                    props.filter &&
                    <TableFilter
                        placeholder={props.filter.placeholder}
                        list={props.filter.list}
                        button={props.filter.button}
                    ></TableFilter>
                }
                <PageTurner curPage="1" totalPage="233"></PageTurner>
            </div>
            <table className="table">
                <thead className="table__head">
                    <tr>
                        {
                            props.tableHead && props.tableHead.map((item, index) => {
                                return (
                                    <th key={index}
                                        className={"col-" + item.col}>
                                        {item.name}
                                    </th>
                                )
                            })
                        }
                    </tr>
                </thead>
                <tbody className="table__body">
                    {
                        props.tableBody && props.tableBody.map((item, index) => {
                            return (
                                <tr
                                    key={index}
                                    className="table__row">
                                    {item}
                                </tr>
                            )
                        })
                    }
                </tbody>
                <tfoot className="table__tfoot">
                    <tr>
                        {
                            props.tableHead && props.tableHead.map((item, index) => {
                                return (
                                    <th
                                        key={index}
                                        className={"col-" + item.col}>
                                        {item.name}
                                    </th>
                                )
                            })
                        }
                    </tr>
                </tfoot>
            </table>
            <div className="table-nav">
                {
                    props.filter &&
                    <TableFilter
                        placeholder={props.filter.placeholder}
                        list={props.filter.list}
                        button={props.filter.button}
                    ></TableFilter>
                }
                <PageTurner curPage="1" totalPage="233"></PageTurner>
            </div>

        </div >
    )
}

export default ContentTable;