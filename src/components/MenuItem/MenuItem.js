import React from "react";
import SubMenuItmes from "../SubMenuItems/SubMenuItems";
import "./MenuItem.scss";


function MenuItem(props) {
    return (
        <div className="menu">
            <div
                className={"menu__title " + (props.selected ? "menu__title--selected" : " ")}
                onClick={props.onClick}
            >
                {props.title}
            </div>
            <SubMenuItmes
                listItems={props.listItems}
                selected={props.selected}
            ></SubMenuItmes>
        </div>
    );
}

export default MenuItem;