import React from "react";
import ContentHeader from "../components/ContentHeader/ContentHeader";
import ContentTable from "../components/ContentTable/ContentTable";
import Content from "../components/Content/Content";
import { commonAction as ca } from "../utils";
import { Link } from "react-router-dom";
import { ClockCircleFilled, CheckCircleFilled } from "@ant-design/icons";

class Categories extends React.Component {
    constructor(props) {
        super();
        this.state = {
            curStatus: "全部",
            data: [],
            headerData: {
                title: "分类",
                status: [
                    { status: "全部", itemQty: "" },
                    { status: "待发布", itemQty: "" },
                    { status: "已发布", itemQty: "" },
                ]
            },
            tableHead: [
                { name: "状态", col: 1 },
                { name: "图片", col: 1 },
                { name: "名称", col: 3 },
                { name: "父类", col: 2 },
                { name: "包含商品", col: 4 },
                { name: "排序", col: 1 },
            ],
        }
    }

    componentDidMount = () => {
        this.getData();
    }

    getData = () => {
        ca.getAllItemsData({ type: "categories" }, (res) => {
            let data = this.flatArr(res.value),
                headerData = this.state.headerData,
                status = ca.getAllStatus(data);
            headerData.status = status;

            this.setState({
                headerData: headerData,
                data: data,
            })
        });
    }

    flatArr = function flatArr(categories) {
        let result = [];
        for (let item of categories) {
            let temp = flatArr(item.children);
            result.push(item, ...temp);
        }
        return result;
    }

    selectStatus = (status) => {
        let filter = status === "全部" ? {} : { status: status };
        ca.getAllItemsData(
            { type: "categories", filter: filter },
            (res) => {
                let data = this.flatArr(res.value);
                console.log("data=", data, "filter:", filter);
                this.setState({
                    data: data,
                    curStatus: status,
                })
            })
    }

    removeCat = (key) => {
        ca.deleteData({ type: "categories", key: key }, this.getData);
    }

    render() {
        const tableBody = this.state.data.map((item) => {
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
                                            onClick={() => { this.removeCat(item.id) }}
                                        >删除</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span className="normal-link" >
                            {item.parent.name}
                        </span>
                    </td>
                    {
                        //TODO:更新数量统计数据
                    }
                    <td>13</td>
                    <td>{item.order}</td>
                </React.Fragment >
            )
        })

        return (
            <Content isfolded={this.props.isfolded} >
                <ContentHeader
                    title={this.state.headerData.title}
                    addBtnPath="/products/categories/edit/new"
                    status={this.state.headerData.status}
                    curStatus={this.state.curStatus}
                    selectStatus={this.selectStatus}
                ></ContentHeader>
                <ContentTable
                    tableHead={this.state.tableHead}
                    tableBody={tableBody}
                ></ContentTable>
            </Content>
        )
    }
}

export default Categories;