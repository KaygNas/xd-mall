import "./PageTurner.scss";

function PageTurner(props) {
    return (
        <div className="turner">
            <button className="turner__btn btn-2">«</button>
            <button className="turner__btn  btn-2">‹</button>
            <div className="turner__indicator">
                第<input className="turner__indicator__input" value={props.curPage}></input>页，共{props.totalPage}页
            </div>
            <button className="turner__btn btn-2">›</button>
            <button className="turner__btn btn-2">»</button>
        </div >
    )
}

export default PageTurner;