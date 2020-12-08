import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./SubMenuItems.scss";

export default function SubMenuItems(props) {
    const listItemHeight = 40;
    const listStyle = {
        height: listItemHeight * props.listItems.length
    }
    const path = useLocation().pathname
    const curRootPath = (path.match(/^\/.*(?=\/edit.*)/) || path.match(/.*/))[0]

    return (
        <ul
            className="menu__sub-menu "
            style={props.selected ? listStyle : { height: "0px" }}
        >
            {
                props.listItems.map((item, index) => {
                    const isSelected = curRootPath === item.path
                    return (
                        <Link key={index} to={item.path}>
                            <li
                                className={"menu__sub-menu__title " + (isSelected ? "menu__sub-menu__title--selected" : "")}
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

