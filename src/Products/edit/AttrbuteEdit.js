import React, { useEffect, useState } from "react";
import Content from "../../components/Content/Content";
import ContentHeader from "../../components/ContentHeader/ContentHeader";
import {
    ContentEdit,
    EditArea,
    ControlBox,
} from "../../components/ContentEdit/ContentEdit";
import ContentTable from "../../components/ContentTable/ContentTable";
import { commonAction as ca } from "../../utils/utils";
import { ItemInputer } from "../../components/TableControler/TableControler";

const tableHead = [
    { name: "选项", col: 12 }
]

export default function AttributeEdit({ isfolded, params, history }) {
    const [data, setData] = useState({ name: "", options: [] })
    const [newItem, setNewItem] = useState("")
    const id = Number(params.id)

    useEffect(() => {
        getData();
    }, [])

    const onChange = (e, content) => {
        switch (content) {
            case "title":
                setData({ ...data, name: e.target.value });
                break;
            case "newItem":
                setNewItem(e.target.value);
                break;
            default: ;
        }
    }

    const getData = () => {
        ca.getItemData({ type: "attributes", id }, setData);
    }

    const addItem = () => {
        ca.addItem({ type: "options", item: newItem, data }, setData);
    }

    const removeItem = (id) => {
        ca.removeItem({ type: "options", id: id, data }, setData)
    }

    const updateData = () => {
        ca.updateData({ type: "attributes", id, data }, (res) => {
            history.push("/products/attributes/edit/" + res);
        })
    }

    const removeAttr = () => {
        ca.deleteData({ type: "attributes", id: id }, () => {
            history.push("/products/attributes");
        });
    }

    const tableBody = data.options.map((item, index) => {
        return (
            <React.Fragment>
                <td>
                    <div className="table__list-item__name">
                        <div className="table__list-item__name__title">
                            <span className="normal-link">{item}</span>
                        </div>
                        <div className="table__list-item__name__controlor">
                            <ul>
                                <li className="table__list-item__name__controlor__item">
                                    <span className="normal-link">编辑</span>
                                </li>
                                <li className="table__list-item__name__controlor__item">
                                    <span className="delete"
                                        onClick={() => removeItem(index)}
                                    >移除本项</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </td>
            </React.Fragment>
        )
    })

    return (
        <Content isfolded={isfolded} >
            <ContentHeader title="属性编辑" addBtnPath="/products/attributes/edit/new" />
            <ContentEdit
                editArea={
                    <EditArea
                        value={data.name}
                        onChange={(e) => onChange(e, "title")}
                    >
                        <ContentTable
                            tableHead={tableHead}
                            tableBody={tableBody}
                            tableNav={
                                //TODO:待更新,应该是带自动检索的输入框
                                <ItemInputer
                                    placeholder="输入新项目"
                                    value={newItem}
                                    onChange={(e) => onChange(e, "newItem")}
                                    button={{ name: "添加新项目", fn: addItem }}
                                />
                            }
                        ></ContentTable>
                    </EditArea>
                }
                controlArea={
                    <ControlBox
                        editBtns={[{ name: "删除", fn: removeAttr }]}
                        updateBtn={{ on: true, fn: updateData }} >
                    </ControlBox>
                } />
        </Content>
    );
}

