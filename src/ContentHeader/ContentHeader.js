import React from "react";
import StatusFilter from "../StatusFilter/StatusFilter";
import SearchBox from "../SearchBox/SearchBox";
import "./ContentHeader.scss"
function ContentHeader(props) {
    return (
        <React.Fragment>
            <div className="content-header">
                <h1 className="content-header__title">{props.title}</h1>
                <button className="content-header__button btn-1">添加新的</button>
            </div>
            <div className="content-filters">
                <StatusFilter status={props.status} statusIdx={props.statusIdx} selectStatus={props.selectStatus}></StatusFilter>
                <SearchBox searchBtnText={props.searchBtnText}></SearchBox>
            </div>
        </React.Fragment>
    );
}

export default ContentHeader;