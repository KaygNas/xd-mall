import React from "react";
import Content from "../../components/Content/Content";
import ContentHeader from "../../components/ContentHeader/ContentHeader";
import {
    ContentEdit,
    EditArea,
    ControlBox,
    ImgUpdater
} from "../../components/ContentEdit/ContentEdit";
import { TableFilter, ItemInputer } from "../../components/TableControler/TableControler";
import ContentTable from "../../components/ContentTable/ContentTable";
import { commonAction as ca } from "../../utils";

class CategoryEdit extends React.Component {
    constructor(props) {
        super();
        this.state = {
            id: "",
            data: {
                id: "",
                name: "",
                images: [],
                parent: { id: "", name: "无" },
                status: "已发布",
                children: [],
                productsCollection: [],
                order: "",
                modifiedDate: ca.getLocaleISOTime({ zoneoff: 8 }),
            },
            newItem: "",
            categories: [],
            tableHead: [
                { name: "图片", col: 1 },
                { name: "商品", col: 3 },
                { name: "分类", col: 2 },
            ],
        }
    }
    componentDidMount = () => {
        this.getData();
        console.log("componentDidMount")
    }

    getCategories = () => {
        ca.getAllItemsData({
            that: this,
            type: "categories",
        }, (res) => {
            res.value.push({ id: "", name: "无" });
            this.setState({
                categories: res.value,
            })
        })
    }

    isChild = (id) => {
        return this.state.data.children.some(val => {
            return val.id === id;
        })
    }

    onChange = (e, content) => {
        //TODO:优化为返回一个函数的闭包
        let data = this.state.data;
        switch (content) {
            case "newItem":
                this.setState({ newItem: e.target.value });
                break;
            case "title":
                data.name = e.target.value;
                break;
            case "order":
                data.order = e.target.value;
                break;
            case "parent":
                if (this.state.id !== e.target.dataset.id
                    && !this.isChild(e.target.dataset.id)) {
                    data.parent = {
                        id: e.target.dataset.id,
                        name: e.target.dataset.value,
                    };
                } else {
                    console.log("can not select self or children")
                    //TODO:noti that can not select self or children;
                }
                break;
            case "status":
                data.status = e.target.dataset.value;
                break;
            case "modifiedDate":
                data.modifiedDate = e.target.value;
                break;
            default: ;
        }
        this.setState({ data: data });
        console.log("onChange", e, e.target.dataset.value || e.target.value)
    }

    getData = () => {
        ca.getItemData({ that: this, type: "categories" });
    }

    addItem = () => {
        ca.addItem({ that: this, type: "productsCollection" });
    }

    removeItem = (index) => {
        ca.removeItem({ that: this, type: "productsCollection", id: index })
    }

    updateData = () => {
        ca.updateData({ that: this, type: "categories", url: "/products/categories/edit/" });
    }

    removeCat = () => {
        ca.deleteData({ type: "categories", key: this.state.id }, () => {
            this.props.history.push("/products/categories");
        });
    }

    render() {
        const areaContent = (
            <div className="edit-area__items">
                <div className="edit-area__item">
                    <div>
                        <span className="edit-area__item__title">父类：</span>
                        <div className="edit-area__item__input">
                            <TableFilter
                                list={this.state.categories}
                                placeholder="选择父类"
                                value={this.state.data.parent.name}
                                onChange={(e) => { this.onChange(e, "parent") }}
                                onClick={this.getCategories}
                            ></TableFilter>
                        </div>
                    </div>
                </div>

                <div className="edit-area__item">
                    <div>
                        <span className="edit-area__item__title">排序：</span>
                        <div className="edit-area__item__input">
                            <input
                                className="edit-area__item__input__ele"
                                type="number"
                                min="0"
                                value={this.state.data.order}
                                onChange={(e) => { this.onChange(e, "order") }}
                            ></input>
                        </div>
                    </div>
                </div>
            </div>
        )

        const status = (
            <React.Fragment>
                {
                    //TODO:创建新Item时默认状态为已发布,按钮文字改为"发布"
                }
                <div className="product-status__item">
                    <span className="product-status__item__title">状态:</span>
                    <TableFilter
                        list={[{ name: "待发布", children: null }, { name: "已发布", children: null }]}
                        value={this.state.data.status}
                        onChange={(e) => { this.onChange(e, "status") }}
                    ></TableFilter>
                </div>
                <div className="product-status__item">
                    <span className="product-status__item__title">发布于:</span>
                    <input
                        type="datetime-local"
                        value={this.state.data.modifiedDate}
                        onChange={(e) => { this.onChange(e, "modifiedDate") }}
                    ></input>
                </div>
            </React.Fragment>
        )

        const tableBody = this.state.data.productsCollection.map((item, index) => {
            return (
                <React.Fragment>

                </React.Fragment>
            )
        });

        return (
            <Content isfolded={this.props.isfolded}>
                <ContentHeader
                    title="分类编辑"
                    addBtnPath="/products/categories/edit/new" />
                <ContentEdit
                    editArea={
                        <EditArea
                            value={this.state.data.name}
                            onChange={(e) => { this.onChange(e, "title") }}>
                            <React.Fragment>
                                {areaContent}
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
                            </React.Fragment>
                        </EditArea>
                    }
                    controlArea={
                        <React.Fragment>
                            <ControlBox
                                editBtns={[{ name: "复制", fn: null }, { name: "删除", fn: this.removeCat }]} updateBtn={{ on: true, fn: this.updateData }} >
                                {status}
                            </ControlBox>
                            <ImgUpdater title="分类图片" />
                        </React.Fragment>
                    } />

            </Content>
        );
    }
}

export default CategoryEdit;