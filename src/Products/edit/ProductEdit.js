import React, { useEffect, useState } from "react";
import Content from "../../components/Content/Content";
import ContentHeader from "../../components/ContentHeader/ContentHeader";
import {
  ContentEdit,
  EditArea,
  ControlBox,
  ImgUpdater,
  StatusControler,
} from "../../components/ContentEdit/ContentEdit";
import { TableFilter } from "../../components/TableControler/TableControler";
import "./ProductEdit.scss";
import { commonAction as ca } from "../../utils/utils";

const inStock = [
  { id: 0, name: "缺货", children: null },
  { id: 1, name: "有货", children: null },
]

export default function ProductEdit({ isfolded, params, history }) {
  const [data, setData] = useState({
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
  })
  const [categories, setCategories] = useState([])
  const [attributes, setAttributes] = useState([])
  const [tags, setTags] = useState([])
  const [selected, setSelected] = useState({
    categories: { id: "", name: "" },
    attributes: { id: "", name: "" },
    tags: { id: "", name: "" },
  })
  const id = Number(params.id)

  useEffect(() => {
    getData();
    ca.getAllItemsData({
      type: "categories",
      filter: { parentID: 0 }
    }, (res) => {
      res.push({ id: 0, name: "无" });
      setCategories(res)
    })
    ca.getAllItemsData({ type: "attributes" }, setAttributes)
    ca.getAllItemsData({ type: "tags" }, setTags)
  }, [])

  const getData = () => {
    ca.getItemData({ type: "products", id }, setData)
  }

  const onChange = (e, content) => {
    let selectedGroup = ["categories", "tags", "attributes"];
    if (selectedGroup.indexOf(content) !== -1) {
      setSelected({
        ...selected,
        [content]: {
          id: Number(e.target.dataset.id),
          name: e.target.dataset.value,
        }
      })
    } else {
      const newData = { ...data }
      switch (content) {
        case "option":
          for (let attr of newData["attributes"]) {
            attr.id === Number(e.target.dataset.id) && (attr.option = e.target.dataset.value)
          }; break;
        case "in_stock":
          newData[content] = Number(e.target.dataset.id) === 1; break;
        default: newData[content] = e.target.value;
      }
      setData(newData)
    }
  }

  const addItem = (type) => {
    ca.addItem({ type: type, item: selected[type], data }, setData);
  }

  const removeItem = (type, index) => {
    ca.removeItem({ type: type, id: index, data }, setData);
  }

  const updateData = () => {
    ca.updateData({ type: "products", id, data, }, (res) => {
      history.push("/products/edit/" + res);
    })
  }

  const getOptions = (id) => {
    id = typeof id === "number" ? id : Number(id)
    for (let attr of attributes) {
      if (attr.id === id) {
        return attr.options.map(val => (
          { id: attr.id, name: val }
        ));
      }
    }
    return []
  }

  const removeProduct = () => {
    ca.deleteData({ type: "products", id: id }, () => {
      history.push("/products");
    });
  }

  const areaContent = (
    <div className="edit-area__items">
      <div className="edit-area__item">
        <div>
          <span className="edit-area__item__title">分类：</span>
          <div className="edit-area__item__input">
            <TableFilter
              list={categories}
              button={{ name: "添加", fn: () => addItem("categories") }}
              placeholder="按分类显示"
              value={selected.categories.name}
              onChange={(e) => onChange(e, "categories")}
            ></TableFilter>
          </div>
        </div>

        <div className="edit-area__item__tags">
          {
            data.categories
            && data.categories.map((item, index) => {
              return (
                <span
                  key={item.id}
                  className="edit-area__item__tag">
                  {
                    ca.joinWithParent(categories, item.id)
                  }
                  <span
                    className="edit-area__item__tag__delete"
                    onClick={() => { removeItem("categories", index) }}
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
              value={data.regular_price}
              onChange={(e) => onChange(e, "regular_price")}
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
              max={data.regular_price}
              value={data.sale_price}
              onChange={(e) => { onChange(e, "sale_price") }}
            ></input>
          </div>
        </div>
      </div>

      <div className="edit-area__item">
        <div>
          <span className="edit-area__item__title">属性：</span>
          <div className="edit-area__item__input">
            <TableFilter
              list={attributes}
              button={{ name: "添加", fn: () => addItem("attributes") }}
              placeholder="添加属性"
              value={selected.attributes.name}
              onChange={(e) => onChange(e, "attributes")}
            ></TableFilter>
          </div>
        </div>

        <div className="edit-area__item__tags">
          {
            data.attributes.map((attr, index) => (
              <div key={attr.id} className="edit-area__item">
                <span className="edit-area__item__title">{attr.name}：</span>
                <div className="edit-area__item__input">
                  <TableFilter
                    key={attr.id}
                    list={getOptions(attr.id)}
                    button={{ name: "移除属性", fn: () => removeItem("attributes", index) }}
                    placeholder="选择属性"
                    value={attr.option}
                    onChange={(e) => onChange(e, "option")}
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
              list={inStock}
              value={
                data.in_stock ?
                  inStock[1].name :
                  inStock[0].name
              }
              onChange={e => onChange(e, "in_stock")}

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
              value={data.limits}
              onChange={(e) => { onChange(e, "limits") }}
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
              value={data.order}
              onChange={e => onChange(e, "order")}
            ></input>
          </div>
        </div>
      </div>

      <div className="edit-area__item">
        <div>
          <span className="edit-area__item__title">标签：</span>
          <div className="edit-area__item__input">
            <TableFilter
              list={tags}
              button={{ name: "添加", fn: () => addItem("tags") }}
              placeholder="添加新标签"
              value={selected.tags.name}
              onChange={(e) => { onChange(e, "tags") }}
            ></TableFilter>
            {
              //TODO:此处应为自动搜索匹配的输入框
            }
          </div>
        </div>

        <div className="edit-area__item__tags">
          {
            data.tags
            && data.tags.map((item, index) => {
              return (
                <span
                  key={item.id}
                  className="edit-area__item__tag">
                  {item.name}
                  <span
                    className="edit-area__item__tag__delete"
                    onClick={() => { removeItem("tags", index) }}
                  >x</span>
                </span>
              )
            })
          }
        </div>
      </div>
    </div>
  )

  return (
    <Content isfolded={isfolded}>
      <ContentHeader title="产品编辑" addBtnPath="/products/edit/new" />
      <ContentEdit
        editArea={
          <EditArea
            value={data.name}
            onChange={e => onChange(e, "name")}
          >{areaContent}</EditArea>
        }
        controlArea={
          <React.Fragment>
            <ControlBox
              editBtns={[
                { name: "复制", fn: null },
                { name: "删除", fn: removeProduct },
              ]}
              updateBtn={{ on: true, fn: updateData }} >
              <StatusControler
                status={data.status}
                modifiedDate={data.modifiedDate}
                onChange={{
                  status: (e) => onChange(e, 'status'),
                  modifiedDate: (e) => onChange(e, 'modifiedDate'),
                }}
              />
            </ControlBox>
            <ImgUpdater title="产品图片" />
          </React.Fragment>
        } />
    </Content>
  );
}

