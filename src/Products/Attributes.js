import React from "react";
import ContentHeader from "../components/ContentHeader/ContentHeader";
import ContentTable from "../components/ContentTable/ContentTable";
import Content from "../components/Content/Content";
import { commonAction as ca } from "../utils";
import { Link } from "react-router-dom";

class Attributes extends React.Component {
    constructor(props) {
        super();
        this.state = {
            data: [],
            headerData: {
                title: "属性",
            },
            tableHead: [
                { name: "名称", col: 6 },
                { name: "选项", col: 6 },
            ],
        }
    }

    componentDidMount = () => {
        this.getData();
    }

    getData = () => {
        ca.getAllItemsData({ that: this, type: "attributes", setData: "data" });
    }

    removeAttr = (key) => {
        ca.deleteData({ type: "attributes", key: key }, this.getData);
    }

    render() {
        const tableBody = this.state.data.map(item => {
            return (
                <React.Fragment>
                    <td>
                        <div className="table__list-item__name">
                            <div className="table__list-item__name__title">
                                <Link
                                    to={"/products/attributes/edit/" + item.id}
                                    className="normal-link">
                                    {item.name}</Link>
                            </div>
                            <div className="table__list-item__name__controlor">
                                <ul>
                                    <li className="table__list-item__name__controlor__item">
                                        ID:{item.id}
                                    </li>
                                    <li className="table__list-item__name__controlor__item">
                                        <Link
                                            to={"/products/attributes/edit/" + item.id}
                                            className="normal-link"
                                        >编辑</Link>
                                    </li>
                                    <li className="table__list-item__name__controlor__item">
                                        <span className="normal-link">快速编辑</span>
                                    </li>
                                    <li className="table__list-item__name__controlor__item">
                                        <span className="delete"
                                            onClick={() => { this.removeAttr(item.id) }}
                                        >删除</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </td>

                    <td className="normal-link">
                        {item.options.join("、")}
                    </td>
                </React.Fragment>
            )
        })

        return (
            <Content isfolded={this.props.isfolded} >
                <ContentHeader
                    title={this.state.headerData.title}
                    addBtnPath="/products/attributes/edit/new"
                ></ContentHeader>
                <ContentTable
                    tableHead={this.state.tableHead}
                    tableBody={tableBody}
                ></ContentTable>
            </Content>
        )
    }
}

export default Attributes;