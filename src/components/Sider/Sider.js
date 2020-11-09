import React from "react";
import "./Sider.scss";
import MenuItem from "../MenuItem/MenuItem";
import {
    LeftCircleFilled
} from "@ant-design/icons";

class Sider extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedItem: -1,
        }
    }

    selectMenuItem(index) {
        let selectedItem;
        if (this.props.isfolded) {
            this.props.foldSider();
            selectedItem = index;
        } else {
            selectedItem = this.state.selectedItem === index ? -1 : index
        }

        this.setState({
            selectedItem: selectedItem,
        })
    }

    render() {
        return (
            <aside
                className="menu-wraper"
                style={this.props.isfolded ? { width: "40px" } : null}
            >
                {
                    this.props.menuItems.map((item, index) => {
                        return (
                            <MenuItem
                                key={index}
                                title={item.title}
                                icon={item.icon}
                                listItems={item.listItems}
                                selected={
                                    !this.props.isfolded &&
                                    this.state.selectedItem === index
                                }
                                onClick={() => this.selectMenuItem(index)}
                            >
                            </MenuItem>
                        )
                    })
                }
                < div
                    className="sider-folder"
                    onClick={this.props.foldSider}
                >
                    <LeftCircleFilled
                        className={
                            "sider-folder__icon " +
                            (this.props.isfolded ? "rotate" : "")
                        } />
                      收起菜单
                </div>
            </aside >
        );
    }
}

export default Sider;