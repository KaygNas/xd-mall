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
import { usePages } from "../../utils/myHooks"

const tableHead = [
    { name: "选项", col: 12 }
]

export default function AttributeEdit({ isfolded, params, history }) {
    const id = Number(params.id) || 0
    const [data, setData] = useState({ name: "", options: [] })
    const [newItem, setNewItem] = useState({ label: "", data: null })


    useEffect(() => {
        getData();
    }, [])

    const onChange = (e, content) => {
        switch (content) {
            case "title":
                setData({ ...data, name: e.target.value });
                break;
            case "newItem":
                setNewItem({ label: e.target.value, data: e.target.value })
                break;
            default: ;
        }
    }

    const getData = () => {
        ca.getItemData({ type: "attributes", id }, setData);
    }

    const resetItem = (e) => {
        setNewItem({ label: "", data: null })
    }

    const addItem = () => {
        ca.addItem({ items: data.options, item: newItem.data }, newItems => {
            const newData = { ...data, options: newItems }
            setData(newData)
        })
    }

    const removeItem = (id) => {
        ca.removeItem({ items: data.options, index: id }, newItems => {
            const newData = { ...data, options: newItems }
            setData(newData)
        })
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
                                <ItemInputer
                                    placeholder="输入新项目"
                                    value={newItem.label}
                                    onChange={(e) => onChange(e, "newItem")}
                                    onClear={resetItem}
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

