import React from "react";
import Content from "../../components/Content/Content";
import ContentHeader from "../../components/ContentHeader/ContentHeader";
import {
    ContentEdit,
    EditArea,
    ControlBox,
} from "../../components/ContentEdit/ContentEdit";
import ContentTable from "../../components/ContentTable/ContentTable";
import { commonAction as ca } from "../../utils";


class AttributeEdit extends React.Component {
    constructor(props) {
        super();
        this.state = {
            id: "",
            data: { id: "", name: "", options: [] },
            newItem: "",
            tableHead: [
                { name: "选项", col: 12 },
            ],
        }

    }

    onChange = (e, content) => {
        switch (content) {
            case "title":
                let data = this.state.data;
                data.name = e.target.value;
                this.setState({ data: data });
                break;
            case "newItem":
                this.setState({ newItem: e.target.value });
                break;
            default: ;
        }
        console.log(e.target.value)
    }

    getData = () => {
        let emptyItem = { id: "", name: "", options: [] };
        ca.getItemData(this, "attributes", emptyItem);
    }

    addItem = () => {
        ca.addItem(this, "options");
    }

    removeItem = (index) => {
        ca.removeItem(this, "options", index)
    }

    updateData = () => {
        ca.updateData(this, "attributes", "/products/attributes/edit/");
    }

    removeAttr = () => {
        ca.deleteData("attributes", this.state.id, () => {
            this.props.history.push("/products/attributes");
        });
    }

    render() {
        this.getData();
        const tableBody = this.state.data.options.map((item, index) => {
            return (
                <React.Fragment>
                    <td>
                        <div className="table__list-item__name">
                            <div className="table__list-item__name__title">
                                <span className="normal-link">{item}</span>
                            </div>
                            <div className="table__list-item__name__controlor">
                                <ul>
                                    <li className="table__list-item__name__controlor__item">
                                        <span className="normal-link">编辑</span>
                                    </li>
                                    <li className="table__list-item__name__controlor__item">
                                        <span className="delete"
                                            onClick={() => this.removeItem(index)}
                                        >移除本项</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </td>
                </React.Fragment>
            )
        })

        return (
            <Content isfolded={this.props.isfolded} >
                <ContentHeader title="属性编辑" addBtnPath="/products/attributes/edit/new" />
                <ContentEdit
                    editArea={
                        <EditArea
                            value={this.state.data.name}
                            onChange={(e) => this.onChange(e, "title")}
                        >
                            <ContentTable
                                tableHead={this.state.tableHead}
                                tableBody={tableBody}
                                inputer={
                                    //TODO:待更新,应该是带自动检索的输入框
                                    {
                                        placeholder: "输入新项目",
                                        value: this.state.newItem,
                                        onChange: (e) => this.onChange(e, "newItem"),
                                        button: { name: "添加新项目", fn: this.addItem }
                                    }}
                            ></ContentTable>
                        </EditArea>
                    }
                    controlArea={
                        <ControlBox
                            editBtns={[{ name: "删除", fn: this.removeAttr }]}
                            updateBtn={{ on: true, fn: this.updateData }} >
                        </ControlBox>
                    } />
            </Content>
        );
    }
}

export default AttributeEdit;