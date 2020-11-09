import React from "react";
import ContentHeader from "../components/ContentHeader/ContentHeader";
import ContentTable from "../components/ContentTable/ContentTable";
import Content from "../components/Content/Content";
import { tableData, categories } from "../appData/appData";


class Product extends React.Component {
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
            title: "产品",
            status: [
                { status: "待发布", itemQty: 3 },
                { status: "已发布", itemQty: 12 },
                { status: "回收站", itemQty: 3 },
            ],
            searchBtnText: "搜索产品",
        }
        return (
            <Content isfolded={this.props.isfolded} >
                <ContentHeader
                    title={headerData.title}
                    addBtnPath="/products/edit/new"
                    status={headerData.status}
                    statusIdx={this.state.statusIdx}
                    searchBox={true}
                    searchBtnText={headerData.searchBtnText}
                    selectStatus={this.selectStatus}
                ></ContentHeader>
                <ContentTable
                    tableHead={tableData.products.tableHead}
                    tableBody={tableData.products.tableBody}
                    filter={{
                        placeholder: "按分类显示",
                        list: categories,
                        button: { name: "筛选", fn: null }
                    }}
                ></ContentTable>
            </Content>
        )
    }
}

export default Product;