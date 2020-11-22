import React from "react";
import ContentHeader from "../components/ContentHeader/ContentHeader";
import ContentTable from "../components/ContentTable/ContentTable";
import Content from "../components/Content/Content";
import { commonAction as ca } from "../utils";
import { Link } from "react-router-dom";

class Tags extends React.Component {
    constructor(props) {
        super();
        this.state = {
            headerData: {
                title: "标签",
            },
            tableHead: [
                { name: "名称", col: 6 },
                { name: "包含商品", col: 6 },
            ],
            data: [],
        }
    }

    componentDidMount = () => {
        this.getData();
    }

    getData = () => {
        ca.getAllItemsData({ that: this, type: "tags", setState: "data" });
    }

    removeTag = (key) => {
        ca.deleteData({ type: "tags", key: key }, this.getData);
    }

    render() {
        const tableBody = this.state.data.map(item => {
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
                                                this.removeTag(item.id)
                                            }}
                                        >删除</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </td>
                    <td>13</td>
                </React.Fragment >
            )
        });

        return (
            <Content isfolded={this.props.isfolded} >
                <ContentHeader
                    title={this.state.headerData.title}
                    addBtnPath="/products/tags/edit/new"
                ></ContentHeader>
                <ContentTable
                    tableHead={this.state.tableHead}
                    tableBody={tableBody}
                ></ContentTable>
            </Content>
        )
    }
}

export default Tags;