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
import { Link } from "react-router-dom"

const tableHead = [
    { name: "图片", col: 1 },
    { name: "商品", col: 3 },
    { name: "标签", col: 2 },
]

export default function TagEdit({ isfolded, params, history }) {
    const [data, setData] = useState({ name: "" })
    const [productsCollection, setProductsCollection] = useState([])
    const [newItem, setNewItem] = useState("")
    const id = Number(params.id)

    useEffect(() => {
        getData()
        getProductsCollection()
    }, [])

    const getData = () => {
        ca.getItemData({ type: "tags", id }, setData);
    }

    const getProductsCollection = () => {
        if (!isNaN(id)) {
            ca.getAllItemsData({
                type: "products",
                filter: { tags: id },
            }, setProductsCollection)
        }
    }

    const onChange = (e, content) => {
        switch (content) {
            case "title":
                setData({ ...data, name: e.target.value })
                break
            case "newItem":
                setNewItem(e.target.value)
                break
            default: ;
        }
    }

    const addItem = () => {
        //!未完成功能
        ca.addItem({ type: "products", item: newItem, data }, (res) => {
            setData(res)
        });
    }

    const removeItem = (id) => {
        //!未完成功能
        ca.removeItem({ type: "products", id: id, data }, (res) => {
            setData(res)
        })
    }

    const updateData = () => {
        ca.updateData({ type: "tags", id, data, }, (res) => {
            history.push("/products/tags/edit/" + res);
        })
    }

    const removeTag = () => {
        ca.deleteData({ type: "tags", id: id }, () => {
            history.push("/products/tags");
        });
    }

    const tableBody = productsCollection.map((item) => {
        return (
            <React.Fragment>
                <td className="valign-middle">
                    <span className="table__list-item__img"></span></td>
                <td>
                    <div className="table__list-item__name">
                        <div className="table__list-item__name__title">
                            <Link
                                to={"/products/edit/" + item.id}
                                className="normal-link">{item.name}
                            </Link>
                        </div>
                        {
                            item.attributes.map(attr => {
                                return (
                                    <div key={attr.id} className="table__list-item__name__title product__attr">
                                        {attr.name}: {attr.option}
                                    </div>
                                )
                            })
                        }
                        <div className="table__list-item__name__controlor">
                            <ul>
                                <li className="table__list-item__name__controlor__item">
                                    ID:{item.id}
                                </li>
                                <li className="table__list-item__name__controlor__item">
                                    <Link
                                        to={"/products/edit/" + item.id}
                                        className="normal-link" >
                                        编辑
                                                </Link>
                                </li>
                                <li className="table__list-item__name__controlor__item">
                                    <span className="normal-link" >快速编辑</span>
                                </li>
                                <li className="table__list-item__name__controlor__item">
                                    <span className="delete"
                                        onClick={() => { removeItem(item.id) }}
                                    >删除</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </td>
                <td>
                    {
                        item.tags.map(item => (
                            <span key={item.id} className="normal-link sepearate">
                                <Link
                                    to={"/products/tags/edit/" + item.id}>
                                    {item.name}
                                </Link>
                            </span>
                        ))
                    }
                </td>
            </React.Fragment>
        )
    })

    return (
        <Content isfolded={isfolded}>
            <ContentHeader title="标签编辑" addBtnPath="/products/tags/edit/new" />
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
                        editBtns={[{ name: "删除", fn: removeTag }]}
                        updateBtn={{ on: true, fn: updateData }} >
                    </ControlBox>
                } />
        </Content>
    );
}

