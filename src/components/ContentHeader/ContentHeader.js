import React from "react";
import { Link } from "react-router-dom";
import StatusFilter from "../StatusFilter/StatusFilter";
import SearchBox from "../SearchBox/SearchBox";
import "./ContentHeader.scss"
function ContentHeader(props) {
    return (
        <React.Fragment>
            <div className="content-header">
                <h1 className="content-header__title">{props.title}</h1>
                <Link
                    className="content-header__button btn-1"
                    to={props.addBtnPath}
                >
                    添加新的
                </Link>
            </div>
            <div className="content-filters">
                {
                    props.status &&
                    <StatusFilter status={props.status} curStatus={props.curStatus} selectStatus={props.selectStatus}></StatusFilter>
                }
                {
                    props.searchBox &&
                    <SearchBox searchBtnText={props.searchBtnText}></SearchBox>
                }
            </div>
        </React.Fragment>
    );
}

export default ContentHeader;