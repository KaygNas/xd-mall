import React from "react";
import "./TableFilter.scss";

class TableFilter extends React.Component {
    constructor(props) {
        super();
        this.state = {
            dropList: false,
            curSubList: null,
            subListPos: null,
        }
    }

    dropList = (e) => {
        console.log(e.target, e.type)
        let drop = e.type === "blur" ? false : !this.state.dropList;
        this.setState({
            dropList: drop,
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
            curSubList: this.props.list[index].children,
            subListPos: subListPos,
        })
    }

    render() {
        return (
            <div className="table-filter-wraper">
                <div
                    className="table-filter"
                    onClick={this.dropList}
                    onBlur={this.dropList}
                >
                    <input
                        className="table-filter__input"
                        readOnly={true}
                        placeholder={this.props.placeholder}
                        value={this.props.value}
                    ></input>
                    <ul className="table-filter__drop-down"
                        style={(this.state.dropList ? { opacity: "1" } : null)}
                    >
                        {
                            this.state.dropList && this.props.list.map((item, index) => {
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

                {
                    this.props.button &&
                    <button
                        className="table-filter__btn btn-2"
                        onClick={this.props.button.fn}
                    >{this.props.button.name}</button>
                }
            </div>
        )
    }
}
export default TableFilter;