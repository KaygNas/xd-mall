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
import "./ProductEdit.scss";
import { categories } from "../../appData/appData";

class ProductEdit extends React.Component {
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
            <span className="edit-area__item__title">分类：</span>
            <div className="edit-area__item__input">
              <TableFilter
                list={categories}
                button={{ name: "添加", fn: null }}
                placeholder="按分类显示"
              ></TableFilter>
            </div>
          </div>

          <div className="edit-area__item__tags">
            {
              this.state.productCategory
              && this.state.productCategory.map((item, index) => {
                return (
                  <span
                    key={index}
                    className="edit-area__item__tag">
                    {item}<span className="edit-area__item__tag__delete">x</span>
                  </span>
                )
              })
            }
          </div>
        </div>

        <div className="edit-area__item">
          <div>
            <span className="edit-area__item__title">常规价：</span>
            <div className="edit-area__item__input--price">
              <input
                className="edit-area__item__input--price__ele"
                type="number" step="0.5" min="0"></input>
            </div>
          </div>
        </div>

        <div className="edit-area__item">
          <div>
            <span className="edit-area__item__title">促销价：</span>
            <div className="edit-area__item__input--price">
              <input
                className="edit-area__item__input--price__ele"
                type="number" step="0.5" min="0"></input>
            </div>
          </div>
        </div>

        <div className="edit-area__item">
          <div>
            <span className="edit-area__item__title">属性：</span>
            <div className="edit-area__item__input">
              <TableFilter
                list={[{ name: "规格", children: null }, { name: "优惠", children: null }]}
                button={{ name: "添加", fn: null }}
                placeholder="添加属性"
              ></TableFilter>
            </div>
          </div>
          {
            //TODO:新增属性的输入框
          }
        </div>

        <div className="edit-area__item">
          <div>
            <span className="edit-area__item__title">库存：</span>
            <div className="edit-area__item__input">
              <TableFilter
                list={[{ name: "有货", children: null }, { name: "缺货", children: null }]}
                value="有货"
              ></TableFilter>
            </div>
          </div>
        </div>

        <div className="edit-area__item">
          <div>
            <span className="edit-area__item__title">限购：</span>
            <div className="edit-area__item__input">
              <input
                className="edit-area__item__input__ele"
                type="number" min="0"></input>
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

        <div className="edit-area__item">
          <div>
            <span className="edit-area__item__title">标签：</span>
            <div className="edit-area__item__input">
              <TableFilter
                list={categories}
                button={{ name: "添加", fn: null }}
                placeholder="添加新标签"
              ></TableFilter>
              {
                //TODO:此处应为自动搜索匹配的输入框
              }
            </div>
          </div>

          <div className="edit-area__item__tags">
            {
              this.state.productCategory
              && this.state.productCategory.map((item, index) => {
                return (
                  <span
                    key={index}
                    className="edit-area__item__tag">
                    {item}<span className="edit-area__item__tag__delete">x</span>
                  </span>
                )
              })
            }
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
        <ContentHeader title="产品编辑" addBtnPath="/products/edit" />
        <ContentEdit
          editArea={
            <EditArea>{areaContent}</EditArea>
          }
          controlArea={
            <React.Fragment>
              <ControlBox
                editBtns={[{ name: "复制", fn: null }, { name: "移至回收站", fn: null }]} updateBtn={{ on: true, fn: null }} >
                {status}
              </ControlBox>
              <ImgUpdater title="产品图片" />
            </React.Fragment>
          } />
      </Content>
    );
  }
}

export default ProductEdit;