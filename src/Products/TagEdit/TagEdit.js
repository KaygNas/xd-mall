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
import { ItemInputer } from "../../components/TableControler/TableControler";
import { Link } from "react-router-dom"

class TagEdit extends React.Component {
    constructor(props) {
        super();
        this.state = {
            id: "",
            data: { name: "" },
            productsCollection: [],
            newItem: "",
            tableHead: [
                { name: "图片", col: 1 },
                { name: "商品", col: 3 },
                { name: "标签", col: 2 },
            ],
        }
    }

    componentDidMount = () => {
        this.getData()
        this.getProductsCollection()
    }

    getProductsCollection = () => {
        let id = this.props.params.id
        id = typeof id === 'number' ? id : Number(id)
        ca.getAllItemsData({
            type: "products",
            filter: { tags: id },
            that: this,
            setState: "productsCollection",
        })
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
        // console.log(e.target.value)
    }

    getData = () => {
        ca.getItemData({ that: this, type: "tags" });
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
        const tableBody = this.state.productsCollection.map((item) => {
            return (
                <React.Fragment>
                    <td className="valign-middle">
                        <span className="table__list-item__img"></span></td>
                    <td>
                        <div className="table__list-item__name">
                            <div className="table__list-item__name__title">
                                <Link
                                    to={"/products/edit/" + item.id}
                                    className="normal-link">{item.name}
                                </Link>
                            </div>
                            {
                                item.attributes.map(attr => {
                                    return (
                                        <div key={attr.id} className="table__list-item__name__title product__attr">
                                            {attr.name}: {attr.option}
                                        </div>
                                    )
                                })
                            }
                            <div className="table__list-item__name__controlor">
                                <ul>
                                    <li className="table__list-item__name__controlor__item">
                                        ID:{item.id}
                                    </li>
                                    <li className="table__list-item__name__controlor__item">
                                        <Link
                                            to={"/products/edit/" + item.id}
                                            className="normal-link" >
                                            编辑
                                                </Link>
                                    </li>
                                    <li className="table__list-item__name__controlor__item">
                                        <span className="normal-link" >快速编辑</span>
                                    </li>
                                    <li className="table__list-item__name__controlor__item">
                                        <span className="delete"
                                            onClick={() => { this.removeProduct(item.id) }}
                                        >删除</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </td>
                    <td>
                        {
                            item.tags.map(item => (
                                <span key={item.id} className="normal-link sepearate">
                                    <Link
                                        to={"/products/tags/edit/" + item.id}>
                                        {item.name}
                                    </Link>
                                </span>
                            ))
                        }
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
                                tableNav={
                                    //TODO:待更新,应该是带自动检索的输入框
                                    <ItemInputer
                                        placeholder="输入新项目"
                                        value={this.state.newItem}
                                        onChange={(e) => this.onChange(e, "newItem")}
                                        button={{ name: "添加新项目", fn: this.addItem }}
                                    />
                                }
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