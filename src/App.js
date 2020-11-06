import React from "react";
import Header from "./components/Header/Header";
import Sider from "./components/Sider/Sider";
import { menuItems } from "./appData/appData";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Products from "./Products/Products";
import ProductEdit from "./Products/ProductEdit/ProductEdit";
import Categories from "./Products/Categories";
import CategoryEdit from "./Products/CategoryEdit/CategoryEdit";
import Tags from "./Products/Tags";
import TagEdit from "./Products/TagEdit/TagEdit";
import Attributes from "./Products/Attributes";
import AttributeEdit from "./Products/AttributeEdit/AttrbuteEdit";

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
                    menuItems={menuItems}
                    isfolded={this.state.isfolded}
                    foldSider={() => { this.foldSider() }}
                ></Sider>

                <Switch>
                    <Route exact path="/products/edit">
                        <ProductEdit isfolded={this.state.isfolded}></ProductEdit>
                    </Route>
                    <Route exact path="/products/categories/edit">
                        <CategoryEdit isfolded={this.state.isfolded}></CategoryEdit>
                    </Route>
                    <Route exact path="/products/categories">
                        <Categories isfolded={this.state.isfolded}></Categories>
                    </Route>
                    <Route exact path="/products/tags">
                        <Tags isfolded={this.state.isfolded}></Tags>
                    </Route>
                    <Route exact path="/products/tags/edit">
                        <TagEdit isfolded={this.state.isfolded}></TagEdit>
                    </Route>
                    <Route exact path="/products/attributes">
                        <Attributes></Attributes>
                    </Route>
                    <Route exact path="/products/attributes/edit">
                        <AttributeEdit></AttributeEdit>
                    </Route>
                    <Route path="/">
                        <Products isfolded={this.state.isfolded}></Products>
                    </Route>
                </Switch>
            </Router>
        );
    }
}

export default App;