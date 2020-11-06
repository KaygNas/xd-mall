import React from "react";
import "./ContentEdit.scss";

function ContentEdit(props) {
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

function EditArea(props) {
    return (
        <React.Fragment>
            <input className="edit__title" placeholder="请输入名称"></input>
            <div className="edit__main">
                {props.children}
            </div>
        </React.Fragment>
    )
}

function ControlBox(props) {
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

function ImgUpdater(props) {
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


export { ContentEdit, EditArea, ControlBox, ImgUpdater };