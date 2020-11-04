import React from "react";
import Header from "../Header/Header";
import Sider from "../Sider/Sider";
import Content from "../Content/Content";

class Layout extends React.Component {
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
        let menuItems = [{
            id: 1,
            title: "订单",
            listItems: [{ id: 1, title: "全部订单" }, { id: 2, title: "报表" }],
        }, {
            id: 2,
            title: "产品",
            listItems: [{ id: 1, title: "全部产品" }, { id: 2, title: "分类" }, { id: 3, title: "标签" }, { id: 4, title: "属性" }],
        }, {
            id: 3,
            title: "用户",
            listItems: [{ id: 1, title: "全部用户" }],
        }];

        return (
            <React.Fragment>
                <Header title="祥达易购"></Header>
                <Sider
                    menuItems={menuItems}
                    isfolded={this.state.isfolded}
                    foldSider={() => { this.foldSider() }}
                ></Sider>
                <Content isfolded={this.state.isfolded}></Content>
            </React.Fragment>
        );
    }
}

export default Layout;