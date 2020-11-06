const headerData = {
    title: "产品",
    status: [
        { status: "待发布", itemQty: 3 },
        { status: "已发布", itemQty: 12 },
        { status: "回收站", itemQty: 3 },
    ],
    searchBtnText: "搜索产品",
}

const tableData = {
    products: {
        tableHead: [
            { name: "图片", col: 1 },
            { name: "商品", col: 3 },
            { name: "库存", col: 1 },
            { name: "价格", col: 1 },
            { name: "分类", col: 2 },
            { name: "标签", col: 1 },
            { name: "限购", col: 1 },
            { name: "日期", col: 2 },
        ],
        tableBody: [[
            <td className="valign-middle"><span className="table__list-item__img"></span></td>,
            <td>
                <div className="table__list-item__name">
                    <div className="table__list-item__name__title">
                        <a className="normal-link" href="#">
                            可口可乐
              </a>
                    </div>
                    <div className="product__attr">
                        规格：500mL*24
        </div>
                    <div className="table__list-item__name__controlor">
                        <ul>
                            <li className="table__list-item__name__controlor__item">
                                ID:1234
                </li>
                            <li className="table__list-item__name__controlor__item">
                                <a className="normal-link" href="#">
                                    编辑
                    </a>
                            </li>
                            <li className="table__list-item__name__controlor__item">
                                <a className="normal-link" href="#">
                                    快速编辑
                    </a>
                            </li>
                            <li className="table__list-item__name__controlor__item">
                                <a href="#">
                                    移至回收站
                    </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </td>,
            <td><span className="product__in-stock">有货</span></td>,
            <td>
                <span className="product__regular-price">¥123.5</span>
                <span className="product__sale-price">¥123.0</span>
            </td>,
            <td><a className="normal-link" href="#">碳酸饮料</a>、<a className="normal-link" href="#">可口可乐</a></td>,
            <td><a className="normal-link" href="#">图片待更新</a></td>,
            <td>1</td>,
            <td>2020年11月5日</td>,
        ], [
            <td className="valign-middle"><span className="table__list-item__img"></span></td>,
            <td>
                <div className="table__list-item__name">
                    <div className="table__list-item__name__title">
                        <a className="normal-link" href="#">
                            可口可乐
          </a>
                    </div>
                    <div className="product__attr">
                        规格：500mL*24
              </div>
                    <div className="table__list-item__name__controlor">
                        <ul>
                            <li className="table__list-item__name__controlor__item">
                                ID:1234
            </li>
                            <li className="table__list-item__name__controlor__item">
                                <a className="normal-link" href="#">
                                    编辑
                </a>
                            </li>
                            <li className="table__list-item__name__controlor__item ">
                                <a className="normal-link" href="#">
                                    快速编辑
                </a>
                            </li>
                            <li className="table__list-item__name__controlor__item">
                                <a href="#">
                                    移至回收站
                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </td>,
            <td><span className="product__out-of-stock">无货</span></td>,
            <td>
                <span className="product__regular-price">¥123.5</span>
                <span className="product__sale-price">¥123.0</span>
            </td>,
            <td><a className="normal-link" href="#">碳酸饮料</a>、<a className="normal-link" href="#">可口可乐</a></td>,
            <td><a className="normal-link" href="#">图片待更新</a></td>,
            <td>1</td>,
            <td>2020年11月5日</td>,
        ]]
    },
    categories: {
        tableHead: [
            { name: "状态", col: 1 },
            { name: "图片", col: 1 },
            { name: "名称", col: 3 },
            { name: "父类", col: 2 },
            { name: "包含商品", col: 4 },
            { name: "排序", col: 1 },
        ],
        tableBody: [[
            <td className="valign-middle"><span className="table__list-item__indicator"></span></td>,
            <td className="valign-middle">
                <span className="table__list-item__img"></span></td>,
            <td>
                <div className="table__list-item__name">
                    <div className="table__list-item__name__title">
                        <a className="normal-link" href="#">
                            碳酸饮料
              </a>
                    </div>
                    <div className="table__list-item__name__controlor">
                        <ul>
                            <li className="table__list-item__name__controlor__item">
                                ID:1234
                    </li>
                            <li className="table__list-item__name__controlor__item">
                                <a className="normal-link" href="#">
                                    编辑
                    </a>
                            </li>
                            <li className="table__list-item__name__controlor__item">
                                <a className="normal-link" href="#">
                                    快速编辑
                    </a>
                            </li>
                            <li className="table__list-item__name__controlor__item">
                                <a href="#">
                                    移至回收站
                    </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </td>,
            <td><a className="normal-link" href="#">碳酸饮料</a>、<a className="normal-link" href="#">可口可乐</a></td>,
            <td>13</td>,
            <td>001</td>,
        ]]
    },
    categoryEdit: {
        tableHead: [
            { name: "图片", col: 1 },
            { name: "商品", col: 3 },
            { name: "分类", col: 2 },
        ],
        tableBody: [[
            <td className="valign-middle"><span className="table__list-item__img"></span></td>,
            <td>
                <div className="table__list-item__name">
                    <div className="table__list-item__name__title">
                        <a className="normal-link" href="#">
                            可口可乐
              </a>
                    </div>
                    <div className="product__attr">
                        规格：500mL*24
        </div>
                    <div className="table__list-item__name__controlor">
                        <ul>
                            <li className="table__list-item__name__controlor__item">
                                ID:1234
                </li>
                            <li className="table__list-item__name__controlor__item">
                                <a className="normal-link" href="#">
                                    编辑
                    </a>
                            </li>
                            <li className="table__list-item__name__controlor__item">
                                <a href="#">
                                    移除本项
                    </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </td>,
            <td><a className="normal-link" href="#">碳酸饮料</a>、<a className="normal-link" href="#">可口可乐</a></td>,
        ]]
    },
    tags: {
        tableHead: [
            { name: "状态", col: 1 },
            { name: "名称", col: 6 },
            { name: "包含商品", col: 5 },
        ],
        tableBody: [[
            <td className="valign-middle"><span className="table__list-item__indicator"></span></td>,
            <td>
                <div className="table__list-item__name">
                    <div className="table__list-item__name__title">
                        <a className="normal-link" href="#">
                            碳酸饮料
              </a>
                    </div>
                    <div className="table__list-item__name__controlor">
                        <ul>
                            <li className="table__list-item__name__controlor__item">
                                ID:1234
                    </li>
                            <li className="table__list-item__name__controlor__item">
                                <a className="normal-link" href="#">
                                    编辑
                    </a>
                            </li>
                            <li className="table__list-item__name__controlor__item">
                                <a className="normal-link" href="#">
                                    快速编辑
                    </a>
                            </li>
                            <li className="table__list-item__name__controlor__item">
                                <a href="#">
                                    删除
                    </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </td>,
            <td>13</td>,
        ]]
    },
    tagEdit: {
        tableHead: [
            { name: "图片", col: 1 },
            { name: "商品", col: 3 },
            { name: "标签", col: 2 },
        ],
        tableBody: [[
            <td className="valign-middle"><span className="table__list-item__img"></span></td>,
            <td>
                <div className="table__list-item__name">
                    <div className="table__list-item__name__title">
                        <a className="normal-link" href="#">
                            可口可乐
              </a>
                    </div>
                    <div className="product__attr">
                        规格：500mL*24
        </div>
                    <div className="table__list-item__name__controlor">
                        <ul>
                            <li className="table__list-item__name__controlor__item">
                                ID:1234
                </li>
                            <li className="table__list-item__name__controlor__item">
                                <a className="normal-link" href="#">
                                    编辑
                    </a>
                            </li>
                            <li className="table__list-item__name__controlor__item">
                                <a href="#">
                                    移除本项
                    </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </td>,
            <td><a className="normal-link" href="#">待更新</a>、<a className="normal-link" href="#">可口可乐</a></td>,
        ]]
    },
    attributes: {
        tableHead: [
            { name: "名称", col: 6 },
            { name: "选项", col: 6 },
        ],
        tableBody: [[
            <td>
                <div className="table__list-item__name">
                    <div className="table__list-item__name__title">
                        <a className="normal-link" href="#">
                            碳酸饮料
              </a>
                    </div>
                    <div className="table__list-item__name__controlor">
                        <ul>
                            <li className="table__list-item__name__controlor__item">
                                ID:1234
                    </li>
                            <li className="table__list-item__name__controlor__item">
                                <a className="normal-link" href="#">
                                    编辑
                    </a>
                            </li>
                            <li className="table__list-item__name__controlor__item">
                                <a className="normal-link" href="#">
                                    快速编辑
                    </a>
                            </li>
                            <li className="table__list-item__name__controlor__item">
                                <a href="#">
                                    删除
                    </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </td>,
            <td>250ml*12</td>,
        ]]
    },
    attributeEdit: {
        tableHead: [
            { name: "选项", col: 12 },
        ],
        tableBody: [[
            <td>
                <div className="table__list-item__name">
                    <div className="table__list-item__name__title">
                        <a className="normal-link" href="#">
                            可口可乐
              </a>
                    </div>
                    <div className="table__list-item__name__controlor">
                        <ul>
                            <li className="table__list-item__name__controlor__item">
                                ID:1234
                </li>
                            <li className="table__list-item__name__controlor__item">
                                <a className="normal-link" href="#">
                                    编辑
                    </a>
                            </li>
                            <li className="table__list-item__name__controlor__item">
                                <a href="#">
                                    移除本项
                    </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </td>,
        ]]
    },
}

const menuItems = [{
    id: 1,
    title: "订单",
    listItems: [{ id: 1, title: "全部订单", path: "/orders" }, { id: 2, title: "报表", path: "/orders/report" }],
}, {
    id: 2,
    title: "产品",
    listItems: [{ id: 1, title: "全部产品", path: "/products" }, { id: 2, title: "分类", path: "/products/categories" }, { id: 3, title: "标签", path: "/products/tags" }, { id: 4, title: "属性", path: "/products/attributes" }],
}, {
    id: 3,
    title: "用户",
    listItems: [{ id: 1, title: "全部用户", path: "/users" }],
}];

const categories = [
    {
        id: "0",
        name: "碳酸可乐",
        imgSrc: "#",
        children: [
            { id: "01", name: "可口可乐", imgSrc: "#", children: null },
            { id: "02", name: "百事可乐", imgSrc: "#", children: null },
        ]
    },
    {
        id: "1",
        name: "牛奶饮品",
        imgSrc: "#",
        children: [
            { id: "11", name: "娃哈哈", imgSrc: "#", children: null },
            { id: "12", name: "燕塘牛奶", imgSrc: "#", children: null },
        ]
    },
];

export { headerData, tableData, menuItems, categories }