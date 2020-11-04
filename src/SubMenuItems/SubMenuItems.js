import React from "react";
import "./SubMenuItems.scss";

class SubMenuItems extends React.Component {
    constructor(props) {
        super();
        let listItemHeight = 40;
        let height = listItemHeight * props.listItems.length;
        this.state = {
            selectedItem: -1,
            listStyle: {
                height: height,
            },
        }
    }

    selectListItem(index) {
        this.setState({
            selectedItem: index,
        })
    }

    render() {
        return (
            <ul
                className="menu__sub-menu deep-blue-bg-1"
                style={this.props.selected ? this.state.listStyle : { height: "0px" }}
            >
                {
                    this.props.listItems.map((item, index) => {
                        return (
                            <li
                                key={index}
                                className={"menu__sub-menu__title " + (index === this.state.selectedItem ? "menu__sub-menu__title--selected" : "")}
                                onClick={() => this.selectListItem(index)}
                            >
                                {item.title}

                            </li>
                        );
                    })
                }
            </ul>
        );
    }
}

export default SubMenuItems;