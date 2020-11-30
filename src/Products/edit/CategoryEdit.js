import React, { useEffect, useState } from "react";
import Content from "../../components/Content/Content";
import ContentHeader from "../../components/ContentHeader/ContentHeader";
import {
    ContentEdit,
    EditArea,
    ControlBox,
    ImgUpdater,
    StatusControler,
} from "../../components/ContentEdit/ContentEdit";
import { TableFilter, ItemInputer } from "../../components/TableControler/TableControler";
import ContentTable from "../../components/ContentTable/ContentTable";
import { commonAction as ca } from "../../utils/utils";
import { Link } from "react-router-dom"

const tableHead = [
    { name: "图片", col: 1 },
    { name: "商品", col: 3 },
    { name: "分类", col: 2 },
]

export default function CategoryEdit({ isfolded, params, history }) {
    const [data, setData] = useState({
        name: "",
        images: [],
        parent: { id: 0, name: "无" },
        status: "已发布",
        children: [],
        order: "",
        modifiedDate: ca.getLocaleISOTime({ zoneoff: 8 }),
    })
    const [productsCollection, setProductsCollection] = useState([])
    const [newItem, setNewItem] = useState("")
    const [categories, SetCategories] = useState([])
    const id = Number(params.id)

    useEffect(() => {
        getData()
        getCategories()
        getProductsCollection()
    }, [])

    const getProductsCollection = () => {
        if (!isNaN(id)) {
            ca.getAllItemsData({ type: "products", filter: { categories: id } }, setProductsCollection)
        }
    }

    const getCategories = () => {
        ca.getAllItemsData({
            type: "categories",
            filter: { parentID: 0 },
        }, (res) => {
            res.push({ id: 0, name: "无" })
            SetCategories(res)
        })
    }

    const isChild = (id) => {
        return data.children.some(val => {
            return val.id === id;
        })
    }

    const onChange = (e, content) => {
        const newData = { ...data }
        switch (content) {
            case "newItem":
                setNewItem(e.target.value); return;
            case "title":
                newData.name = e.target.value; break;
            case "order":
                newData.order = e.target.value; break;
            case "parent":
                const parentID = Number(e.target.dataset.id)
                if (id !== parentID && !isChild(id)) {
                    newData.parent = {
                        id: parentID,
                        name: e.target.dataset.value,
                    };
                } else {
                    // console.log("can not select self or children")
                    //TODO:noti that can not select self or children;
                }
                break;
            case "status":
                newData.status = e.target.dataset.value; break;
            case "modifiedDate":
                newData.modifiedDate = e.target.value; break;
            default: ;
        }
        setData(newData)
    }

    const getData = () => {
        ca.getItemData({ type: "categories", id }, setData);
    }

    const addItem = () => {
    }

    const removeItem = (index) => {
    }

    const updateData = () => {
        ca.updateData({ type: "categories", id, data, }, (res) => {
            history.push("/products/categories/edit/" + res);
        })
    }

    const removeCat = () => {
        ca.deleteData({ type: "categories", id }, () => {
            history.push("/products/categories");
        });
    }

    const areaContent = (
        <div className="edit-area__items">
            <div className="edit-area__item">
                <div>
                    <span className="edit-area__item__title">父类：</span>
                    <div className="edit-area__item__input">
                        <TableFilter
                            list={categories}
                            placeholder="选择父类"
                            value={data.parent.name}
                            onChange={(e) => { onChange(e, "parent") }}
                            onClick={getCategories}
                        ></TableFilter>
                    </div>
                </div>
            </div>

            <div className="edit-area__item">
                <div>
                    <span className="edit-area__item__title">排序：</span>
                    <div className="edit-area__item__input">
                        <input
                            className="edit-area__item__input__ele"
                            type="number"
                            min="0"
                            value={data.order}
                            onChange={(e) => { onChange(e, "order") }}
                        ></input>
                    </div>
                </div>
            </div>
        </div>
    )

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
                        item.categories.map(category => (
                            <span key={category.id} className="normal-link sepearate">
                                <Link
                                    to={"/products/categories/edit/" + category.id}>
                                    {ca.joinWithParent(categories, category.id)}
                                </Link>
                            </span>
                        ))
                    }
                </td>
            </React.Fragment>
        )
    });

    return (
        <Content isfolded={isfolded}>
            <ContentHeader
                title="分类编辑"
                addBtnPath="/products/categories/edit/new" />
            <ContentEdit
                editArea={
                    <EditArea
                        value={data.name}
                        onChange={(e) => { onChange(e, "title") }}>
                        {areaContent}
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
                    <React.Fragment>
                        <ControlBox
                            editBtns={[
                                { name: "复制", fn: null },
                                { name: "删除", fn: removeCat },
                            ]}
                            updateBtn={{ on: true, fn: updateData }} >
                            <StatusControler
                                status={data.status}
                                modifiedDate={data.modifiedDate}
                                onChange={{
                                    status: (e) => onChange(e, 'status'),
                                    modifiedDate: (e) => onChange(e, 'modifiedDate'),
                                }}
                            />
                        </ControlBox>
                        <ImgUpdater title="分类图片" />
                    </React.Fragment>
                } />

        </Content>
    );
}

