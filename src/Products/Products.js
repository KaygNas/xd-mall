import React from "react";
import ContentHeader from "../components/ContentHeader/ContentHeader";
import ContentTable from "../components/ContentTable/ContentTable";
import Content from "../components/Content/Content";
import { commonAction as ca } from "../utils";
import { Link } from "react-router-dom";
import { ClockCircleFilled, CheckCircleFilled } from "@ant-design/icons";
import { TableFilter } from "../components/TableControler/TableControler";


class Product extends React.Component {
    constructor(props) {
        super();
        this.state = {
            curStatus: "全部",
            data: [],
            categories: [],
            attributes: [],
            tags: [],
            formData: {
                filter: { id: "", name: "" },
            },
            headerData: {
                title: "产品",
                status: [
                    { status: "全部", itemQty: "" },
                    { status: "待发布", itemQty: "" },
                    { status: "已发布", itemQty: "" },
                ],
                searchBtnText: "搜索产品",
            },
            tableHead: [
                { name: "状态", col: 1 },
                { name: "图片", col: 1 },
                { name: "商品", col: 3 },
                { name: "库存", col: 1 },
                { name: "价格", col: 1 },
                { name: "分类", col: 2 },
                { name: "标签", col: 1 },
                { name: "限购", col: 1 },
                { name: "排序", col: 1 },
            ],
        }
    }

    componentDidMount = () => {
        ca.getAllItemsData({
            that: this,
            type: "categories",
        }, (res) => {
            res.push({ id: "", name: "无" });
            this.setState({
                categories: res,
            })
        })
        ca.getAllItemsData({
            type: "attributes",
            that: this,
            setState: "attributes",
        })
        ca.getAllItemsData({
            type: "tags",
            that: this,
            setState: "tags",
        })
        this.getData();
    }

    getData = () => {
        ca.getAllItemsData({ type: "products" }, (res) => {
            let data = res.value,
                headerData = this.state.headerData,
                status = ca.getAllStatus(data);
            headerData.status = status;

            this.setState({
                headerData: headerData,
                data: data,
            })
        });
    }

    getCategories = () => {
        ca.getAllItemsData({
            that: this,
            type: "categories",
        }, (res) => {
            res.value.push({ id: "", name: "无" });
            this.setState({
                categories: res.value,
            })
        })
    }

    selectStatus = (status) => {
        let filter = status === "全部" ? {} : { status: status };
        ca.getAllItemsData(
            { type: "products", filter: filter },
            (res) => {
                this.setState({
                    data: res.value,
                    curStatus: status,
                })
            })
    }

    filterProducts = () => {
        let filter = { categories: this.state.formData.filter };
        ca.getAllItemsData(
            { type: "products", filter: filter },
            (res) => {
                this.setState({
                    data: res.value,
                })
            })
    }

    onChange = (e, content) => {
        let formData = this.state.formData;

        formData[content] = {
            id: e.target.dataset.id,
            name: e.target.dataset.value,
        };
        this.setState({
            formData: formData,
        })
    }

    removeProduct = (id) => {
        ca.deleteData({ type: "products", key: id }, this.getData);
    }

    render() {
        const tableBody = this.state.data.map(item => {
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
                                            onClick={() => { this.removeProduct(item.id) }}
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
                                <span key={item.id} className="normal-link sepearate">{
                                    ca.joinWithParent(this.state.categories, item.id)
                                }</span>
                            ))
                        }
                    </td>
                    <td>
                        {
                            item.tags.map(item => (
                                <span key={item.id} className="normal-link sepearate">{item.name}</span>
                            ))
                        }
                    </td>
                    <td>{item.limits}</td>
                    <td>{item.order}</td>
                </React.Fragment>
            )
        })
        return (
            <Content isfolded={this.props.isfolded} >
                <ContentHeader
                    title={this.state.headerData.title}
                    addBtnPath="/products/edit/new"
                    status={this.state.headerData.status}
                    curStatus={this.state.curStatus}
                    searchBox={true}
                    searchBtnText={this.state.headerData.searchBtnText}
                    selectStatus={this.selectStatus}
                ></ContentHeader>
                <ContentTable
                    tableHead={this.state.tableHead}
                    tableBody={tableBody}
                    tableNav={
                        <TableFilter
                            list={this.state.categories}
                            button={{ name: "筛选", fn: this.filterProducts }}
                            placeholder="按分类显示"
                            value={this.state.formData.filter.name}
                            onChange={e => this.onChange(e, "filter")}
                        ></TableFilter>
                    }
                ></ContentTable>
            </Content>
        )
    }
}

export default Product;