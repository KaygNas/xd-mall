import React from "react";
import Header from "./components/Header/Header";
import Sider from "./components/Sider/Sider";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Products from "./Products/Products";
import ProductEdit from "./Products/ProductEdit/ProductEdit";
import Categories from "./Products/Categories";
import CategoryEdit from "./Products/CategoryEdit/CategoryEdit";
import Tags from "./Products/Tags";
import TagEdit from "./Products/TagEdit/TagEdit";
import Attributes from "./Products/Attributes";
import AttributeEdit from "./Products/AttributeEdit/AttrbuteEdit";
import {
    CodeSandboxOutlined,
    PayCircleOutlined,
    TeamOutlined,
} from "@ant-design/icons";

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            isfolded: false,
        }
    }

    foldSider() {
        this.setState({
            isfolded: !this.state.isfolded,
        })
    }

    render() {
        return (
            <Router>
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
                    isfolded={this.state.isfolded}
                    foldSider={() => { this.foldSider() }}
                ></Sider>

                <Switch>
                    <Route path="/products/edit">
                        <ProductEdit isfolded={this.state.isfolded}></ProductEdit>
                    </Route>
                    <Route path="/products/categories/edit/:id"
                        children={(props) => (
                            <CategoryEdit
                                isfolded={this.state.isfolded}
                                params={props.match.params}
                                history={props.history} />
                        )}
                    />
                    <Route exact path="/products/categories">
                        <Categories isfolded={this.state.isfolded}></Categories>
                    </Route>
                    <Route exact path="/products/tags">
                        <Tags isfolded={this.state.isfolded}></Tags>
                    </Route>
                    <Route path="/products/tags/edit/:id"
                        children={(props) => (
                            <TagEdit
                                isfolded={this.state.isfolded}
                                params={props.match.params}
                                history={props.history} />
                        )}
                    />
                    <Route exact path="/products/attributes">
                        <Attributes isfolded={this.state.isfolded}></Attributes>
                    </Route>
                    <Route path="/products/attributes/edit/:id"
                        children={(props) => (
                            <AttributeEdit
                                isfolded={this.state.isfolded}
                                params={props.match.params}
                                history={props.history} />
                        )}
                    />
                    <Route path="/">
                        <Products isfolded={this.state.isfolded}></Products>
                    </Route>
                </Switch>
            </Router >
        );
    }
}

export default App;