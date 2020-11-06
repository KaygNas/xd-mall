import React from "react";
import Content from "../../components/Content/Content";
import ContentHeader from "../../components/ContentHeader/ContentHeader";
import {
    ContentEdit,
    EditArea,
    ControlBox,
    ImgUpdater
} from "../../components/ContentEdit/ContentEdit";
import TableFilter from "../../components/TableFilter/TableFilter";
import "./CategoryEdit.scss";
import { tableData, categories } from "../../appData/appData";
import ContentTable from "../../components/ContentTable/ContentTable";

class CategoryEdit extends React.Component {
    constructor(props) {
        super();
        this.state = {
            productCategory: ["可口可乐", "碳酸饮料/其他"],
        }
    }

    render() {
        const areaContent = (
            <div className="edit-area__items">
                <div className="edit-area__item">
                    <div>
                        <span className="edit-area__item__title">父类：</span>
                        <div className="edit-area__item__input">
                            <TableFilter
                                list={categories}
                                placeholder="选择父类"
                                value="碳酸饮料"
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
                                type="number" min="0"></input>
                        </div>
                    </div>
                </div>
            </div>
        )

        const status = (
            <React.Fragment>
                <div className="product-status__item">
                    <span className="product-status__item__title">状态:</span>
                    <TableFilter
                        list={[{ name: "待发布", children: null }, { name: "已发布", children: null }]}
                        value="待发布"
                    ></TableFilter>
                </div>
                <div className="product-status__item">
                    <span className="product-status__item__title">发布于:</span>
                    <input type="datetime-local" value="2020-11-06T18:06"></input>
                </div>
            </React.Fragment>
        )

        return (
            <Content isfolded={this.props.isfolded}>
                <ContentHeader title="分类编辑" addBtnPath="/products/categories/edit" />
                <ContentEdit
                    editArea={
                        <EditArea>
                            <React.Fragment>
                                {areaContent}
                                <ContentTable
                                    tableHead={tableData.categoryEdit.tableHead}
                                    tableBody={tableData.categoryEdit.tableBody}
                                    filter={
                                        //TODO:待更新...错误的filter,应该是带自动检索的输入框
                                        {
                                            placeholder: "选择新项目",
                                            list: categories,
                                            button: { name: "添加新项目", fn: null }
                                        }}
                                ></ContentTable>
                            </React.Fragment>
                        </EditArea>
                    }
                    controlArea={
                        <React.Fragment>
                            <ControlBox
                                editBtns={[{ name: "复制", fn: null }, { name: "移至回收站", fn: null }]} updateBtn={{ on: true, fn: null }} >
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