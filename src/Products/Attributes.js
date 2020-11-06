import React from "react";
import ContentHeader from "../components/ContentHeader/ContentHeader";
import ContentTable from "../components/ContentTable/ContentTable";
import Content from "../components/Content/Content";
import { tableData } from "../appData/appData";


class Attributes extends React.Component {
    constructor(props) {
        super();
        this.state = {
        }
    }


    render() {
        const headerData = {
            title: "属性",
        }
        return (
            <Content isfolded={this.props.isfolded} >
                <ContentHeader
                    title={headerData.title}
                    addBtnPath="/products/attributes/edit"
                ></ContentHeader>
                <ContentTable
                    tableHead={tableData.attributes.tableHead}
                    tableBody={tableData.attributes.tableBody}
                ></ContentTable>
            </Content>
        )
    }
}

export default Attributes;