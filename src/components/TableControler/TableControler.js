import React, { useState } from "react";
import "./TableControler.scss";

function List({ visible, listItems, children, onClick, onMouseEnter, className = "", style }) {
    const showArrow = (item) => {
        if (item.children instanceof Array && item.children.length > 0) {
            return <span className="table-filter__drop-down__arrow"></span>
        }
        return null
    }

    return (
        <ul className={"table-filter__drop-down " + className}
            style={{
                ...style,
                opacity: visible ? "1" : "0",
                visibility: visible ? "visible" : "hidden"
            }}
            onMouseDown={(e) => { e.preventDefault() }}
            onClick={onClick}
        >
            {
                listItems && listItems.map((item, index) => {
                    return (
                        <li
                            key={index}
                            className="table-filter__drop-down__item"
                            data-index={index}
                            data-id={item.id}
                            data-value={item.name}
                            onMouseEnter={onMouseEnter}
                        >
                            {
                                // 用 label 和 name 来区分展示的名字与数据
                            }
                            {item.name}
                            {showArrow(item)}
                        </li>
                    )
                })
            }
            {children}
        </ul>
    )
}

function AutoButton({ button }) {
    if (!button) {
        return null
    }
    return (
        button &&
        <button
            className="table-filter__btn btn-2"
            onClick={button.fn}
        >
            {button.name}
        </button>
    )
}

export class TableFilter extends React.Component {
    constructor(props) {
        super();
        this.state = {
            dropList: false,
            curSubList: null,
            subListPos: null,
        }
    }

    dropList = (e) => {
        // console.log("droplist", e.target, e.type)
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

    selectItem = (e) => {
        // console.log("selectItem", e, e.target, e.type);
        this.props.onChange && this.props.onChange(e);
    }

    onClick = (e) => {
        this.dropList(e);
        this.props.onClick && this.props.onClick(e);
    }

    onBlur = (e) => {
        this.dropList(e);
        this.props.onBlur && this.props.onBlur(e);
    }

    render() {
        return (
            <div className="table-filter-wraper"
            >
                <div
                    className="table-filter"
                    onClick={this.onClick}
                    onBlur={this.onBlur}
                >
                    <input
                        className="table-filter__input"
                        readOnly={true}
                        placeholder={this.props.placeholder}
                        value={this.props.value}
                    ></input>

                    <List
                        visible={this.state.dropList}
                        onClick={this.selectItem}
                        onMouseEnter={this.setCurSubList}
                        listItems={this.props.list}
                    >
                        <List
                            className="sub-list"
                            visible={this.state.curSubList}
                            listItems={this.state.curSubList}
                            style={this.state.subListPos}
                        ></List>
                    </List>
                </div>

                <AutoButton button={this.props.button}></AutoButton>
            </div>
        )
    }
}

export function ItemInputer({ value, placeholder, listItems, onChange, onClick, onClear, button }) {
    const [isSelected, setIsSelected] = useState(false)
    const selectItem = (event) => {
        setIsSelected(true)
        onClick(event)
    }
    const removeSelectedItem = (event) => {
        setIsSelected(false)
        onClear(event)
    }

    return (
        <div className="table-filter-wraper">
            <div className="table-inputer">
                <input
                    className="table-filter__input"
                    readOnly={isSelected}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                ></input>

                {
                    (value || isSelected)
                    && <button className="table-inputer__clear-input-btn" type="button" onClick={removeSelectedItem}>x</button>
                }
                <List
                    visible={value && !isSelected}
                    onClick={selectItem}
                >
                    {
                        listItems && listItems.map((item, index) => {
                            const label = `${item.name} (#${item.id})`
                            return (
                                <li
                                    key={index}
                                    className="table-filter__drop-down__item"
                                    data-index={index}
                                    data-id={item.id}
                                    data-value={label}
                                >
                                    {label}
                                </li>
                            )
                        })
                    }
                </List>
            </div>
            <AutoButton button={button}></AutoButton>
        </div>
    )
}