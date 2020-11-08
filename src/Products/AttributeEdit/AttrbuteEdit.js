import React from "react";
import Content from "../../components/Content/Content";
import ContentHeader from "../../components/ContentHeader/ContentHeader";
import {
    ContentEdit,
    EditArea,
    ControlBox,
} from "../../components/ContentEdit/ContentEdit";
import ContentTable from "../../components/ContentTable/ContentTable";
import { DATABASE as DB } from "../../utils";
import { Redirect } from "react-router-dom";


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
            redirect: false,
        }

    }

    getData = () => {
        //获取数据
        if (this.props.params.id === "new"
            && this.props.params.id !== this.state.id) {
            this.setState({
                id: this.props.params.id,
                data: { id: "", name: "", options: [] },
            })
        } else if (this.props.params.id !== this.state.id) {
            DB.attributes.get(this.props.params.id).then(res => {
                if (res.status.code === 0) {
                    this.setState({
                        id: this.props.params.id,
                        data: res.value,
                    })
                }
            })
        }
    }

    updateData = () => {
        let id = this.state.id === "new" ? "" : this.state.id;
        DB.attributes.set(id, this.state.data).then(res => {
            this.props.history.push(
                "/products/attributes/edit/" + res.value.id);
        });
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

    addItem = () => {
        let data = this.state.data;
        data.options.push(this.state.newItem);
        this.setState({
            data: data,
            newItem: "",
        })
    }

    removeItem = (index) => {
        let data = this.state.data;
        data.options.splice(index, 1);
        this.setState({
            data: data,
        })
    }

    render() {
        this.getData();
        const tableBody = this.state.data.options.map((item, index) => {
            return (
                <tr key={index}>
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
                </tr>
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
                            editBtns={[{ name: "删除", fn: null }]}
                            updateBtn={{ on: true, fn: this.updateData }} >
                        </ControlBox>
                    } />
            </Content>
        );
    }
}

export default AttributeEdit;