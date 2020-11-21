import React from "react";
import Content from "../../components/Content/Content";
import ContentHeader from "../../components/ContentHeader/ContentHeader";
import {
  ContentEdit,
  EditArea,
  ControlBox,
  ImgUpdater
} from "../../components/ContentEdit/ContentEdit";
import { TableFilter } from "../../components/TableControler/TableControler";
import "./ProductEdit.scss";
import { commonAction as ca } from "../../utils";

class ProductEdit extends React.Component {
  constructor(props) {
    super();
    this.state = {
      data: {
        id: "",
        name: "",
        attributes: [],
        categories: [],
        images: [],
        status: "已发布", //Queries:status设定为数字,根据数字匹配对应选项更安全?
        order: "",
        regular_price: "",
        sale_price: "",
        in_stock: true,
        limits: 0,
        tags: [],
        modifiedDate: "",
      },
      categories: [],
      attributes: [],
      tags: [],
      inStock: [
        { id: 0, name: "缺货", children: null },
        { id: 1, name: "有货", children: null },
      ],
      selected: {
        categories: { id: "", name: "" },
        attributes: { id: "", name: "" },
        tags: { id: "", name: "" },
      },
    }
  }

  componentDidMount = () => {
    ca.getAllItemsData({
      that: this,
      type: "categories",
    }, (res) => {
      res.value.push({ id: "", name: "无" });
      this.setState({
        categories: res.value,
      })
    })
    ca.getAllItemsData({
      type: "attributes",
      that: this,
      setData: "attributes",
    })
    ca.getAllItemsData({
      type: "tags",
      that: this,
      setData: "tags",
    })
  }

  getData = () => {
    let emptyItem = {
      id: "",
      name: "",
      attributes: [],
      categories: [],
      images: [],
      status: "已发布",
      order: "",
      regular_price: "",
      sale_price: "",
      in_stock: true,
      limits: 0,
      tags: [],
      modifiedDate: ca.getLocaleISOTime({ zoneoff: 8 }),
    };
    ca.getItemData({
      that: this,
      type: "products",
      emptyItem: emptyItem,
    })
  }

  onChange = (e, content) => {
    let group1 = ["categories", "tags", "attributes"];
    if (group1.some(val => val === content)) {

      let selected = this.state.selected;
      selected[content] = {
        id: e.target.dataset.id,
        name: e.target.dataset.value,
      };
      this.setState({
        selected: selected,
      });

    } else {

      let data = this.state.data;
      switch (content) {
        case "option":
          for (let attr of data["attributes"]) {
            attr.id === e.target.dataset.id &&
              (attr.option = e.target.dataset.value)
          }; break;
        case "in_stock":
          data[content] = e.target.dataset.id === "1"; break;
        default: data[content] = e.target.value;
      }

      this.setState({
        data: data,
      })

    }
  }

  addItem = (type) => {
    ca.addItem({ that: this, type: type, item: this.state.selected[type] });
  }

  removeItem = (type, index) => {
    ca.removeItem({ that: this, type: type, id: index });
  }

  updateData = () => {
    ca.updateData({ that: this, type: "products", url: "/products/edit/" })
  }

  getOptions = (id) => {
    for (let attr of this.state.attributes) {
      if (attr.id === id) {
        return attr.options.map(val => (
          { id: attr.id, name: val }
        ));
      }
    }
  }

  removeProduct = () => {
    ca.deleteData({ type: "products", key: this.state.id }, () => {
      this.props.history.push("/products");
    });
  }

  render() {
    this.getData();
    const areaContent = (
      <div className="edit-area__items">
        <div className="edit-area__item">
          <div>
            <span className="edit-area__item__title">分类：</span>
            <div className="edit-area__item__input">
              <TableFilter
                list={this.state.categories}
                button={{ name: "添加", fn: () => this.addItem("categories") }}
                placeholder="按分类显示"
                value={this.state.selected.categories.name}
                onChange={(e) => this.onChange(e, "categories")}
              ></TableFilter>
            </div>
          </div>

          <div className="edit-area__item__tags">
            {
              this.state.data.categories
              && this.state.data.categories.map((item, index) => {
                return (
                  <span
                    key={item.id}
                    className="edit-area__item__tag">
                    {
                      ca.joinWithParent(this.state.categories, item.id)
                    }
                    <span
                      className="edit-area__item__tag__delete"
                      onClick={() => { this.removeItem("categories", index) }}
                    >x</span>
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
                type="number"
                step="0.5"
                min="0"
                value={this.state.data.regular_price}
                onChange={(e) => this.onChange(e, "regular_price")}
              ></input>
            </div>
          </div>
        </div>

        <div className="edit-area__item">
          <div>
            <span className="edit-area__item__title">促销价：</span>
            <div className="edit-area__item__input--price">
              <input
                className="edit-area__item__input--price__ele"
                type="number"
                step="0.5"
                min="0"
                max={this.state.data.regular_price}
                value={this.state.sale_price}
                onChange={(e) => { this.onChange(e, "sale_price") }}
              ></input>
            </div>
          </div>
        </div>

        <div className="edit-area__item">
          <div>
            <span className="edit-area__item__title">属性：</span>
            <div className="edit-area__item__input">
              <TableFilter
                list={this.state.attributes}
                button={{ name: "添加", fn: () => this.addItem("attributes") }}
                placeholder="添加属性"
                value={this.state.selected.attributes.name}
                onChange={(e) => this.onChange(e, "attributes")}
              ></TableFilter>
            </div>
          </div>

          <div className="edit-area__item__tags">
            {
              this.state.data.attributes.map((attr, index) => (
                <div key={attr.id} className="edit-area__item">
                  <span className="edit-area__item__title">{attr.name}：</span>
                  <div className="edit-area__item__input">
                    <TableFilter
                      key={attr.id}
                      list={this.getOptions(attr.id)}
                      button={{ name: "移除属性", fn: () => this.removeItem("attributes", index) }}
                      placeholder="选择属性"
                      value={attr.option}
                      onChange={(e) => this.onChange(e, "option")}
                    ></TableFilter>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        <div className="edit-area__item">
          <div>
            <span className="edit-area__item__title">库存：</span>
            <div className="edit-area__item__input">
              <TableFilter
                list={this.state.inStock}
                value={
                  this.state.data.in_stock ?
                    this.state.inStock[1].name :
                    this.state.inStock[0].name
                }
                onChange={e => this.onChange(e, "in_stock")}

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
                type="number"
                min="0"
                value={this.state.data.limits}
                onChange={(e) => { this.onChange(e, "limits") }}
              ></input>
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
                onChange={e => this.onChange(e, "order")}
              ></input>
            </div>
          </div>
        </div>

        <div className="edit-area__item">
          <div>
            <span className="edit-area__item__title">标签：</span>
            <div className="edit-area__item__input">
              <TableFilter
                list={this.state.tags}
                button={{ name: "添加", fn: () => this.addItem("tags") }}
                placeholder="添加新标签"
                value={this.state.selected.tags.name}
                onChange={(e) => { this.onChange(e, "tags") }}
              ></TableFilter>
              {
                //TODO:此处应为自动搜索匹配的输入框
              }
            </div>
          </div>

          <div className="edit-area__item__tags">
            {
              this.state.data.tags
              && this.state.data.tags.map((item, index) => {
                return (
                  <span
                    key={item.id}
                    className="edit-area__item__tag">
                    {item.name}
                    <span
                      className="edit-area__item__tag__delete"
                      onClick={() => { this.removeItem("tags", index) }}
                    >x</span>
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

    return (
      <Content isfolded={this.props.isfolded}>
        <ContentHeader title="产品编辑" addBtnPath="/products/edit/new" />
        <ContentEdit
          editArea={
            <EditArea
              value={this.state.data.name}
              onChange={e => this.onChange(e, "name")}
            >{areaContent}</EditArea>
          }
          controlArea={
            <React.Fragment>
              <ControlBox
                editBtns={[
                  { name: "复制", fn: null },
                  { name: "删除", fn: this.removeProduct },
                ]}
                updateBtn={{ on: true, fn: this.updateData }} >
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