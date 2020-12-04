import "./ContentTable.scss";

export default function ContentTable({ pages, tableNav, tableHead, tableBody }) {
    return (
        <div>
            <TableNav pages={pages}>
                {tableNav}
            </TableNav>
            <table className="table">
                <thead className="table__head">
                    <tr>
                        {
                            tableHead && tableHead.map((item, index) => {
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
                        tableBody && tableBody.map((item, index) => {
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
                            tableHead && tableHead.map((item, index) => {
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
            <TableNav >
                {tableNav}
            </TableNav>
        </div >
    )
}

function TableNav({ children, pages = {} }) {
    return (
        <div className="table-nav">
            {children}
            <PageTurner
                curPage={pages.curPage}
                totalPages={pages.totalPages}
            ></PageTurner>
        </div>
    )
}

function PageTurner({ curPage, totalPages }) {
    return (
        <div className="turner">
            <button className="turner__btn btn-2">«</button>
            <button className="turner__btn  btn-2">‹</button>
            <div className="turner__indicator">
                第<input className="turner__indicator__input"
                    value={curPage}
                    readOnly={true}
                ></input>页，共{totalPages}页
            </div>
            <button className="turner__btn btn-2">›</button>
            <button className="turner__btn btn-2">»</button>
        </div >
    )
}

