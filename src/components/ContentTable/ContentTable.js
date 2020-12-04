import "./ContentTable.scss";

export default function ContentTable({ pages, onPageChange, tableNav, tableHead, tableBody }) {
    return (
        <div>
            <TableNav pages={pages} onPageChange={onPageChange}>
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
            <TableNav pages={pages} onPageChange={onPageChange}>
                {tableNav}
            </TableNav>
        </div >
    )
}

function TableNav({ children, pages = {}, onPageChange }) {
    return (
        <div className="table-nav">
            {children}
            <PageTurner
                curPage={pages.curPage}
                totalPages={pages.totalPages}
                onPageChange={onPageChange}
            ></PageTurner>
        </div>
    )
}

function PageTurner({ curPage, totalPages, onPageChange }) {
    return (
        <div className="turner">
            <button
                className="turner__btn btn-2"
                onClick={() => onPageChange("first")}
            >«</button>
            <button
                className="turner__btn  btn-2"
                onClick={() => onPageChange("pre")}
            >‹</button>
            <div className="turner__indicator">
                第<input className="turner__indicator__input"
                    value={curPage}
                    readOnly={true}
                ></input>页，共{totalPages}页
            </div>
            <button
                className="turner__btn btn-2"
                onClick={() => onPageChange("next")}
            >›</button>
            <button
                className="turner__btn btn-2"
                onClick={() => onPageChange("last")}
            >»</button>
        </div >
    )
}

