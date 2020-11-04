import React from "react";
import "./TableFilter.scss";

class TableFilter extends React.Component {
    constructor(props) {
        super();
        this.state = {
            dropList: false,
            curSubList: null,
            subListPos: null,
            categorys: [
                {
                    id: "0",
                    name: "碳酸可乐",
                    imgSrc: "#",
                    children: [
                        { id: "01", name: "可口可乐", imgSrc: "#", children: null },
                        { id: "02", name: "百事可乐", imgSrc: "#", children: null },
                    ]
                },
                {
                    id: "1",
                    name: "牛奶饮品",
                    imgSrc: "#",
                    children: [
                        { id: "11", name: "娃哈哈", imgSrc: "#", children: null },
                        { id: "12", name: "燕塘牛奶", imgSrc: "#", children: null },
                    ]
                },
            ]
        }
    }

    dropList = () => {
        this.setState({
            dropList: !this.state.dropList,
            curSubList: this.state.curSubList && null,
        })
    }

    setCurSubList = (e) => {
        const index = e.target.dataset.index;
        const subListPos = {
            top: e.target.offsetTop,
            left: e.target.offsetWidth,
            opacity: 1,
        }
        this.state.dropList && this.setState({
            curSubList: this.state.categorys[index].children,
            subListPos: subListPos,
        })
    }

    render() {
        return (
            <div className="table-filter" onClick={this.dropList}>
                <input
                    className="table-filter__input"
                    readOnly={true}
                    value="按分类显示"
                ></input>
                <ul className="table-filter__drop-down"
                    style={(this.state.dropList ? { opacity: "1" } : null)}
                >
                    {
                        this.state.dropList && this.state.categorys.map((item, index) => {
                            return (
                                <li
                                    key={index}
                                    className="table-filter__drop-down__item"
                                    data-index={index}
                                    onMouseEnter={this.setCurSubList}
                                >
                                    {item.name}
                                    {
                                        item.children &&
                                        <span className="table-filter__drop-down__arrow"></span>
                                    }
                                </li>
                            )
                        })
                    }
                    <ul
                        className="table-filter__drop-down sub-list"
                        style={this.state.subListPos}
                    >
                        {
                            this.state.curSubList &&
                            this.state.curSubList.map((item, index) => {
                                return (
                                    <li
                                        key={index}
                                        className="table-filter__drop-down__item"
                                    >
                                        {item.name}
                                    </li>
                                )
                            })
                        }
                    </ul>
                </ul>

            </div>
        )
    }
}
export default TableFilter;