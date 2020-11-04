import "./PageTurner.scss";

function PageTurner(props) {
    return (
        <div className="turner">
            <div className="turner__btn btn-2">«</div>
            <div className="turner__btn  btn-2">‹</div>
            <div className="turner__indicator">
                第<input className="turner__indicator__input" value={props.curPage}></input>页，共{props.totalPage}页
            </div>
            <div className="turner__btn btn-2">›</div>
            <div className="turner__btn btn-2">»</div>
        </div >
    )
}

export default PageTurner;