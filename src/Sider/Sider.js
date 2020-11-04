import React from "react";
import "./Sider.scss";
import MenuItem from "../MenuItem/MenuItem";
class Sider extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedItem: -1,
        }
    }

    selectMenuItem(index) {
        this.setState({
            selectedItem: this.state.selectedItem === index ? -1 : index,
        })
    }

    render() {
        return (
            <aside
                className="menu-wraper deep-blue-bg-2"
                style={this.props.isfolded ? { width: "40px" } : null}
            >
                {
                    this.props.menuItems.map((item, index) => {
                        return (
                            <MenuItem
                                key={index}
                                title={item.title}
                                listItems={item.listItems}
                                selected={this.state.selectedItem === index}
                                onClick={() => this.selectMenuItem(index)}
                            >
                            </MenuItem>
                        )
                    })
                }
                < div
                    className="sider-folder"
                    onClick={this.props.foldSider}
                > 收起菜单</div>
            </aside >
        );
    }
}

export default Sider;