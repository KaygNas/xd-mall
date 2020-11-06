import React from "react";
import ContentHeader from "../components/ContentHeader/ContentHeader";
import ContentTable from "../components/ContentTable/ContentTable";
import Content from "../components/Content/Content";
import { tableData } from "../appData/appData";


class Categories extends React.Component {
    constructor(props) {
        super();
        this.state = {
            statusIdx: 0,
        }
    }

    selectStatus = (index) => {
        this.setState({
            statusIdx: index,
        })
    }

    render() {
        const headerData = {
            title: "分类",
            status: [
                { status: "待发布", itemQty: 3 },
                { status: "已发布", itemQty: 12 },
                { status: "回收站", itemQty: 3 },
            ]
        }
        return (
            <Content isfolded={this.props.isfolded} >
                <ContentHeader
                    title={headerData.title}
                    addBtnPath="/products/categories/edit"
                    status={headerData.status}
                    statusIdx={this.state.statusIdx}
                    selectStatus={this.selectStatus}
                ></ContentHeader>
                <ContentTable
                    tableHead={tableData.categories.tableHead}
                    tableBody={tableData.categories.tableBody}
                ></ContentTable>
            </Content>
        )
    }
}

export default Categories;