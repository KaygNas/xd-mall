import React, { useState } from "react";
import Header from "./components/Header/Header";
import Sider from "./components/Sider/Sider";
import { Switch, Route, Redirect } from "react-router-dom";
import Products from "./Products/Products";
import ProductEdit from "./Products/edit/ProductEdit";
import Categories from "./Products/Categories";
import CategoryEdit from "./Products/edit/CategoryEdit";
import Tags from "./Products/Tags";
import TagEdit from "./Products/edit/TagEdit";
import Attributes from "./Products/Attributes";
import AttributeEdit from "./Products/edit/AttrbuteEdit";
import {
    CodeSandboxOutlined,
    PayCircleOutlined,
    TeamOutlined,
} from "@ant-design/icons";

export default function App() {
    const [isfolded, setIsfolded] = useState(false)

    const foldSider = () => {
        setIsfolded(!isfolded)
    }

    return (
        <>
            <Header title="祥达易购"></Header>
            <Sider
                menuItems={
                    [{
                        id: 1,
                        title: "订单",
                        icon: <PayCircleOutlined />,
                        listItems: [
                            { id: 1, title: "全部订单", path: "/orders" },
                            { id: 2, title: "报表", path: "/orders/report" }],
                    }, {
                        id: 2,
                        title: "产品",
                        icon: <CodeSandboxOutlined></CodeSandboxOutlined>,
                        listItems: [
                            { id: 1, title: "全部产品", path: "/products" },
                            { id: 2, title: "分类", path: "/products/categories" },
                            { id: 3, title: "标签", path: "/products/tags" },
                            { id: 4, title: "属性", path: "/products/attributes" }],
                    }, {
                        id: 3,
                        title: "用户",
                        icon: <TeamOutlined />,
                        listItems: [{ id: 1, title: "全部用户", path: "/users" }],
                    }]
                }
                isfolded={isfolded}
                foldSider={foldSider}
            ></Sider>

            <Switch>
                <Route exact path="/products/categories">
                    <Categories isfolded={isfolded}></Categories>
                </Route>

                <Route exact path="/products/tags">
                    <Tags isfolded={isfolded}></Tags>
                </Route>

                <Route exact path="/products/attributes">
                    <Attributes isfolded={isfolded}></Attributes>
                </Route>

                <Route exact path="/products">
                    <Products isfolded={isfolded}></Products>
                </Route>

                <Route exact path="/products/categories/edit/:id"
                    children={(props) => (
                        <CategoryEdit
                            key={props.match.params.id}
                            isfolded={isfolded}
                            params={props.match.params}
                            history={props.history} />
                    )}
                />

                <Route exact path="/products/tags/edit/:id"
                    children={(props) => (
                        <TagEdit
                            key={props.match.params.id}
                            isfolded={isfolded}
                            params={props.match.params}
                            history={props.history} />
                    )}
                />

                <Route exact path="/products/attributes/edit/:id"
                    children={(props) => (
                        <AttributeEdit
                            key={props.match.params.id}
                            isfolded={isfolded}
                            params={props.match.params}
                            history={props.history} />
                    )}
                />

                <Route exact path="/products/edit/:id"
                    children={(props) => {
                        return (
                            <ProductEdit
                                key={props.match.params.id}
                                isfolded={isfolded}
                                params={props.match.params}
                                history={props.history}
                            ></ProductEdit>
                        )
                    }}
                ></Route>


                <Redirect to="/products" />
            </Switch>
        </>
    );
}

