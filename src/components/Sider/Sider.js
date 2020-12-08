import React from "react";
import "./Sider.scss";
import MenuItem from "../MenuItem/MenuItem";
import { useLocation } from "react-router-dom";
import {
    LeftCircleFilled
} from "@ant-design/icons";

export default function Sider(props) {
    const path = useLocation().pathname

    return (
        <aside
            className="menu-wraper"
            style={props.isfolded ? { width: "40px" } : null}
        >
            {
                props.menuItems.map((item, index) => {
                    const isSelected = !props.isfolded && path.startsWith(item.listItems[0].path)
                    return (
                        <MenuItem
                            key={index}
                            title={item.title}
                            icon={item.icon}
                            listItems={item.listItems}
                            selected={isSelected}
                            isfolded={props.isfolded}
                            foldSider={props.foldSider}
                        >
                        </MenuItem>
                    )
                })
            }
            < div
                className="sider-folder"
                onClick={props.foldSider}
            >
                <LeftCircleFilled
                    className={
                        "sider-folder__icon " +
                        (props.isfolded ? "rotate" : "")
                    } />
                      收起菜单
                </div>
        </aside >
    );
}

