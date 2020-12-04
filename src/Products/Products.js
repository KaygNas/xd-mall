import React, { useEffect, useState } from "react";
import ContentHeader from "../components/ContentHeader/ContentHeader";
import ContentTable from "../components/ContentTable/ContentTable";
import Content from "../components/Content/Content";
import { commonAction as ca } from "../utils/utils";
import { Link } from "react-router-dom";
import { ClockCircleFilled, CheckCircleFilled } from "@ant-design/icons";
import { TableFilter } from "../components/TableControler/TableControler";
import { usePages } from "../utils/myHooks"

export default function Product({ isfolded }) {
    const [data, setData] = useState([])
    const [categories, setCategories] = useState([])
    const [formData, setFormDate] = useState({
        filter: { id: "", name: "" },
    })
    const [headerData, setHeaderData] = useState({
        title: "产品",
        status: [
            { status: "全部", itemQty: "" },
            { status: "待发布", itemQty: "" },
            { status: "已发布", itemQty: "" },
        ],
        searchBtnText: "搜索产品",
    })
    const [curStatus, setCurState] = useState("全部")
    const [tableHead] = useState([
        { name: "状态", col: 1 },
        { name: "图片", col: 1 },
        { name: "商品", col: 3 },
        { name: "库存", col: 1 },
        { name: "价格", col: 1 },
        { name: "分类", col: 2 },
        { name: "标签", col: 1 },
        { name: "限购", col: 1 },
        { name: "排序", col: 1 },
    ])
    const [pages, turnPage] = usePages("products")

    useEffect(() => {
        getData({ page: pages.curPage }, async (res) => {
            const status = await ca.getAllStatus("products", headerData.status)
            setHeaderData({ ...headerData, status })
        })
        getCategories()
    }, [pages.curPage])

    const getData = (options, callback) => {
        ca.getAllItemsData({
            type: "products",
            options,
        },
            (res) => {
                setData(res)
                callback && callback(res)
            }
        )
    }

    const searchProducts = (keywords) => {
        ca.searchItemsData({ type: "products", keywords }, setData)
    }

    const getCategories = () => {
        ca.getAllItemsData(
            { type: "categories", options: { index: "parentID", key: 0 } },
            (res) => {
                res.push({ id: 0, name: "无" })
                setCategories(res)
            }
        )
    }

    const selectStatus = (status) => {
        const options = status === "全部" ? {} : { index: "status", key: status }
        getData(options, () => { setCurState(status) })
    }

    const filterProducts = () => {
        const options = { index: "categories", key: formData.filter.id };
        getData(options)
    }

    const onChange = (e, content) => {
        formData[content] = {
            id: Number(e.target.dataset.id),
            name: e.target.dataset.value,
        };
        setFormDate({ ...formData })
    }

    const removeProduct = (id) => {
        ca.deleteData(
            { type: "products", id: id },
            () => getData()
        );
    }

    const tableBody = data.map(item => {
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
                                        onClick={() => { removeProduct(item.id) }}
                                    >删除</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </td>
                <td>
                    {
                        item.in_stock ?
                            <span className="product__in-stock">有货</span> :
                            <span className="product__out-of-stock">无货</span>
                    }
                </td>
                <td>
                    {
                        <React.Fragment>
                            <span
                                className={"product__price" + (item.sale_price ? "--strike" : "")}
                            >¥{item.regular_price}</span>
                            <span className="product__price">
                                {item.sale_price && ("¥" + item.sale_price)}
                            </span>
                        </React.Fragment>
                    }
                </td>
                <td>
                    {
                        item.categories.map(item => (
                            <span key={item.id} className="normal-link sepearate">
                                <Link
                                    to={"/products/categories/edit/" + item.id}>
                                    {ca.joinWithParent(categories, item.id)}
                                </Link>
                            </span>
                        ))
                    }
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
                <td>{item.limits}</td>
                <td>{item.order}</td>
            </React.Fragment>
        )
    })

    return (
        <Content isfolded={isfolded} >
            <ContentHeader
                title={headerData.title}
                addBtnPath="/products/edit/new"
                status={headerData.status}
                curStatus={curStatus}
                searchBox={{
                    btnText: headerData.searchBtnText,
                    fn: searchProducts,
                }}
                selectStatus={selectStatus}
            ></ContentHeader>
            <ContentTable
                tableHead={tableHead}
                tableBody={tableBody}
                tableNav={
                    <TableFilter
                        list={categories}
                        button={{ name: "筛选", fn: filterProducts }}
                        placeholder="按分类显示"
                        value={formData.filter.name}
                        onChange={e => onChange(e, "filter")}
                    ></TableFilter>
                }
                pages={pages}
                onPageChange={(action) => turnPage(action)}
            ></ContentTable>
        </Content>
    )
}
