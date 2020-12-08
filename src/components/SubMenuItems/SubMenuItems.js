import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./SubMenuItems.scss";

export default function SubMenuItems(props) {
    const listItemHeight = 40;
    const listStyle = {
        height: listItemHeight * props.listItems.length
    }
    const curPath = useLocation().pathname

    return (
        <ul
            className="menu__sub-menu "
            style={props.selected ? listStyle : { height: "0px" }}
        >
            {
                props.listItems.map((item, index) => {
                    return (
                        <Link key={index} to={item.path}>
                            <li
                                className={"menu__sub-menu__title " + (item.path === curPath ? "menu__sub-menu__title--selected" : "")}
                            >
                                {item.title}
                            </li>
                        </Link>
                    );
                })
            }
        </ul>
    );
}

