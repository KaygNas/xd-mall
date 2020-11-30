import React, { useEffect, useState } from "react";
import ContentHeader from "../components/ContentHeader/ContentHeader";
import ContentTable from "../components/ContentTable/ContentTable";
import Content from "../components/Content/Content";
import { commonAction as ca } from "../utils/utils";
import { Link } from "react-router-dom";

export default function Tags({ isfolded }) {
    const [headerData] = useState({ title: "标签" })
    const [tableHead] = useState([
        { name: "名称", col: 6 },
        { name: "包含商品", col: 6 },
    ])
    const [data, setData] = useState([])

    useEffect(() => {
        getData()
    }, [])

    const getData = () => {
        ca.getAllItemsData({ type: "tags" }, setData);
    }

    const removeTag = (id) => {
        ca.deleteData({ type: "tags", id: id }, () => getData());
    }

    const tableBody = data.map(item => {
        return (
            <React.Fragment>
                <td>
                    <div className="table__list-item__name">
                        <div className="table__list-item__name__title">
                            <Link
                                to={"/products/tags/edit/" + item.id} className="normal-link">
                                {item.name}
                            </Link>
                        </div>
                        <div className="table__list-item__name__controlor">
                            <ul>
                                <li className="table__list-item__name__controlor__item">
                                    ID:{item.id}
                                </li>
                                <li className="table__list-item__name__controlor__item">
                                    <Link
                                        to={"/products/tags/edit/" + item.id} className="normal-link">
                                        编辑
                                        </Link>
                                </li>
                                <li className="table__list-item__name__controlor__item">
                                    <span className="normal-link">快速编辑</span>
                                </li>
                                <li className="table__list-item__name__controlor__item">
                                    <span className="delete"
                                        onClick={() => {
                                            removeTag(item.id)
                                        }}
                                    >删除</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </td>
                <td>{item.productsQuantity}</td>
            </React.Fragment >
        )
    });

    return (
        <Content isfolded={isfolded} >
            <ContentHeader
                title={headerData.title}
                addBtnPath="/products/tags/edit/new"
            ></ContentHeader>
            <ContentTable
                tableHead={tableHead}
                tableBody={tableBody}
            ></ContentTable>
        </Content>
    )
}
