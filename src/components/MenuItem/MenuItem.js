import React, { useEffect, useState } from "react";
import SubMenuItmes from "../SubMenuItems/SubMenuItems";
import "./MenuItem.scss";


function MenuItem(props) {
    const [subMenuIsShown, setSubMenuIsShown] = useState(props.selected)
    const subMenuShouldShown = subMenuIsShown && !props.isfolded

    const onClick = () => {
        if (props.isfolded) {
            props.foldSider()
            setSubMenuIsShown(true)
        } else {
            setSubMenuIsShown(!subMenuIsShown)
        }
    }

    useEffect(() => {

    }, [props.isfolded])

    return (
        <div className="menu">
            <div
                className={"menu__title " + (subMenuShouldShown ? "menu__title--selected" : " ")}
                onClick={onClick}
            >
                <span className="menu__icon">
                    {props.icon}
                </span>
                {props.title}
            </div>
            <SubMenuItmes
                listItems={props.listItems}
                selected={subMenuShouldShown}
            ></SubMenuItmes>
        </div>
    );
}

export default MenuItem;