import React from "react";
import Content from "../../components/Content/Content";
import ContentHeader from "../../components/ContentHeader/ContentHeader";
import {
    ContentEdit,
    EditArea,
    ControlBox,
} from "../../components/ContentEdit/ContentEdit";
import "./TagEdit.scss";
import { tableData, categories } from "../../appData/appData";
import ContentTable from "../../components/ContentTable/ContentTable";

class TagEdit extends React.Component {
    constructor(props) {
        super();
        this.state = {
        }
    }

    render() {
        return (
            <Content isfolded={this.props.isfolded}>
                <ContentHeader title="标签编辑" addBtnPath="/products/tags/edit" />
                <ContentEdit
                    editArea={
                        <EditArea>
                            <ContentTable
                                tableHead={tableData.tagEdit.tableHead}
                                tableBody={tableData.tagEdit.tableBody}
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

export default TagEdit;