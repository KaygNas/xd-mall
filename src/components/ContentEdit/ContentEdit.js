import React from "react";
import { TableFilter } from "../TableControler/TableControler"
import "./ContentEdit.scss";

export function ContentEdit(props) {
    return (
        <div className="edit-wraper">
            <div className="edit-area col-9">
                {props.editArea}
            </div>
            <div className="control-area col-3">
                {props.controlArea}
            </div>
        </div>
    )
}

export function EditArea(props) {
    return (
        <React.Fragment>
            <input
                className="edit__title"
                placeholder="请输入名称"
                value={props.value}
                onChange={props.onChange}
            ></input>
            <div className="edit__main">
                {props.children}
            </div>
        </React.Fragment>
    )
}

export function ControlBox(props) {
    return (
        <div className="control-box">
            <div className="control-box__title">{props.title || "操作"}</div>
            <div className="control-box__status">{props.children}</div>
            <div className="control-box__edit">
                <div className="control-box__edit__btn-group">
                    {
                        props.editBtns && props.editBtns.map((item, index) => {
                            return (
                                <span
                                    key={index}
                                    className="control-box__edit__normal-btn"
                                    onClick={item.fn}
                                >{item.name}</span>
                            )
                        })
                    }
                </div>
                {
                    props.updateBtn.on &&
                    <button
                        className="control-box__edit__update-btn btn-2--blue"
                        onClick={props.updateBtn.fn}
                    >更新</button>
                }
            </div>
        </div>
    )
}

export function ImgUpdater(props) {
    return (
        <ControlBox
            title={props.title}
            editBtns={[{ name: "删除图片", fn: null }]}
            updateBtn={{ on: false, fn: null }}
        >
            <div>ImgUpdater</div>
        </ControlBox>
    )
}

export function StatusControler({ status, modifiedDate, onChange }) {
    return (
        <React.Fragment>
            {
                //TODO:创建新Item时默认状态为已发布,按钮文字改为"发布"
            }
            <div className="product-status__item">
                <span className="product-status__item__title">状态:</span>
                <TableFilter
                    list={[{ name: "待发布", children: null }, { name: "已发布", children: null }]}
                    value={status}
                    onChange={onChange.status}
                ></TableFilter>
            </div>
            <div className="product-status__item">
                <span className="product-status__item__title">发布于:</span>
                <input
                    type="datetime-local"
                    value={modifiedDate}
                    onChange={onChange.modifiedDate}
                ></input>
            </div>
        </React.Fragment >
    )
}