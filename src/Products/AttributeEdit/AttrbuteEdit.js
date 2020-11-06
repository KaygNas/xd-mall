import React from "react";
import Content from "../../components/Content/Content";
import ContentHeader from "../../components/ContentHeader/ContentHeader";
import {
    ContentEdit,
    EditArea,
    ControlBox,
} from "../../components/ContentEdit/ContentEdit";
import { tableData, categories } from "../../appData/appData";
import ContentTable from "../../components/ContentTable/ContentTable";

class AttributeEdit extends React.Component {
    constructor(props) {
        super();
        this.state = {
        }
    }

    render() {
        return (
            <Content isfolded={this.props.isfolded}>
                <ContentHeader title="属性编辑" addBtnPath="/products/attributes/edit" />
                <ContentEdit
                    editArea={
                        <EditArea>
                            <ContentTable
                                tableHead={tableData.attributeEdit.tableHead}
                                tableBody={tableData.attributeEdit.tableBody}
                                filter={
                                    //TODO:待更新...错误的filter,应该是带自动检索的输入框
                                    {
                                        placeholder: "选择新项目",
                                        list: categories,
                                        button: { name: "添加新项目", fn: null }
                                    }}
                            ></ContentTable>
                        </EditArea>
                    }
                    controlArea={
                        <ControlBox
                            editBtns={[{ name: "删除", fn: null }]} updateBtn={{ on: true, fn: null }} >
                        </ControlBox>
                    } />
            </Content>
        );
    }
}

export default AttributeEdit;