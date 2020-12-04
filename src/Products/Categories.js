import React, { useState, useEffect } from "react";
import ContentHeader from "../components/ContentHeader/ContentHeader";
import ContentTable from "../components/ContentTable/ContentTable";
import Content from "../components/Content/Content";
import { commonAction as ca } from "../utils/utils";
import { Link } from "react-router-dom";
import { ClockCircleFilled, CheckCircleFilled } from "@ant-design/icons";

export default function Categories({ isfolded }) {
    const [data, setData] = useState([])
    const [headerData, setHeaderData] = useState({
        title: "分类",
        status: [
            { status: "全部", itemQty: "" },
            { status: "待发布", itemQty: "" },
            { status: "已发布", itemQty: "" },
        ]
    })
    const [curStatus, setCurState] = useState("全部")
    const [tableHead] = useState([
        { name: "状态", col: 1 },
        { name: "图片", col: 1 },
        { name: "名称", col: 3 },
        { name: "父类", col: 2 },
        { name: "包含商品", col: 4 },
        { name: "排序", col: 1 },
    ])

    useEffect(() => {
        getData()
    }, [])

    const getData = (options, callback) => {
        ca.getAllItemsData({ type: "categories", options },
            (res) => {
                const status = ca.getAllStatus(res)
                setHeaderData({ ...headerData, status })
                setData(res)
                callback && callback(res)
            }
        )
    }

    const selectStatus = (status) => {
        const options = status === "全部" ? {} : { index: "status", key: status }
        getData(options, () => { setCurState(status) })
    }

    const removeCat = (id) => {
        ca.deleteData({ type: "categories", id: id }, () => getData());
    }

    const tableBody = data.map((item) => {
        return (
            <React.Fragment>
                <td className="valign-middle">{
                    item.status === "已发布" ?
                        <CheckCircleFilled className="table__list-item__indicator published" /> :
                        <ClockCircleFilled className="table__list-item__indicator" />
                }
                </td>
                <td className="valign-middle">
                    <span className="table__list-item__img"></span></td>
                <td>
                    <div className="table__list-item__name">
                        <div className="table__list-item__name__title">
                            <Link
                                to={"/products/categories/edit/" + item.id}
                                className="normal-link">{item.name}
                            </Link>
                        </div>
                        <div className="table__list-item__name__controlor">
                            <ul>
                                <li className="table__list-item__name__controlor__item">
                                    ID:{item.id}
                                </li>
                                <li className="table__list-item__name__controlor__item">
                                    <Link
                                        to={"/products/categories/edit/" + item.id}
                                        className="normal-link" >
                                        编辑
                                            </Link>
                                </li>
                                <li className="table__list-item__name__controlor__item">
                                    <span className="normal-link" >快速编辑</span>
                                </li>
                                <li className="table__list-item__name__controlor__item">
                                    <span className="delete"
                                        onClick={() => { removeCat(item.id) }}
                                    >删除</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </td>
                <td>
                    <span className="normal-link" >
                        <Link
                            to={"/products/categories/edit/" + item.parent.id}>
                            {item.parent.name}
                        </Link>
                    </span>
                </td>
                <td>{item.productsQuantity}</td>
                <td>{item.order}</td>
            </React.Fragment >
        )
    })

    return (
        <Content isfolded={isfolded} >
            <ContentHeader
                title={headerData.title}
                addBtnPath="/products/categories/edit/new"
                status={headerData.status}
                curStatus={curStatus}
                selectStatus={selectStatus}
            ></ContentHeader>
            <ContentTable
                tableHead={tableHead}
                tableBody={tableBody}
            ></ContentTable>
        </Content>
    )
}

