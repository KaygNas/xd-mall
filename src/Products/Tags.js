import React from "react";
import ContentHeader from "../components/ContentHeader/ContentHeader";
import ContentTable from "../components/ContentTable/ContentTable";
import Content from "../components/Content/Content";
import { tableData } from "../appData/appData";


class Tags extends React.Component {
    constructor(props) {
        super();
        this.state = {
        }
    }


    render() {
        const headerData = {
            title: "标签",
        }
        return (
            <Content isfolded={this.props.isfolded} >
                <ContentHeader
                    title={headerData.title}
                    addBtnPath="/products/tags/edit"
                ></ContentHeader>
                <ContentTable
                    tableHead={tableData.tags.tableHead}
                    tableBody={tableData.tags.tableBody}
                ></ContentTable>
            </Content>
        )
    }
}

export default Tags;