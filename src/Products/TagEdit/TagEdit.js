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

class TagEdit extends React.Component {
    constructor(props) {
        super();
        this.state = {
            id: "",
            data: { id: "", name: "", products: [] },
            newItem: "",
            tableHead: [
                { name: "图片", col: 1 },
                { name: "商品", col: 3 },
                { name: "标签", col: 2 },
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
        let emptyItem = { id: "", name: "", products: [] }
        ca.getItemData({ that: this, type: "tags", emptyItem: emptyItem });
    }

    addItem = () => {
        ca.addItem({ that: this, type: "products", item: this.state.newItem });
    }

    removeItem = (id) => {
        ca.removeItem({ that: this, type: "products", id: id })
    }

    updateData = () => {
        ca.updateData({ that: this, type: "tags", url: "/products/tags/edit/" });
    }

    removeTag = () => {
        ca.deleteData({ type: "tags", key: this.state.id }, () => {
            this.props.history.push("/products/tags");
        });
    }

    render() {
        this.getData();
        const tableBody = this.state.data.products.map((item, index) => {
            return (
                <React.Fragment>
                    {
                        //TODO:待完成商品页面时更新
                    }
                    <td className="valign-middle"><span className="table__list-item__img"></span></td>
                    <td>
                        <div className="table__list-item__name">
                            <div className="table__list-item__name__title">
                                <span className="normal-link">可口可乐</span>
                            </div>
                            <div className="product__attr">规格：500mL*24</div>
                            <div className="table__list-item__name__controlor">
                                <ul>
                                    <li className="table__list-item__name__controlor__item">
                                        ID:1234
                        </li>
                                    <li className="table__list-item__name__controlor__item">
                                        <span className="normal-link">编辑</span>
                                    </li>
                                    <li className="table__list-item__name__controlor__item">
                                        <span className="delete">移除本项</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span className="normal-link">待更新、可口可乐</span>
                    </td>
                </React.Fragment>
            )
        })
        return (
            <Content isfolded={this.props.isfolded}>
                <ContentHeader title="标签编辑" addBtnPath="/products/tags/edit/new" />
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
                            editBtns={[{ name: "删除", fn: this.removeTag }]}
                            updateBtn={{ on: true, fn: this.updateData }} >
                        </ControlBox>
                    } />

            </Content>
        );
    }
}

export default TagEdit;