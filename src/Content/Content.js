import React from "react";
import ContentHeader from "../ContentHeader/ContentHeader";
import ContentTable from "../ContentTable/ContentTable";
import "./Content.scss"

class Content extends React.Component {
    constructor(props) {
        super();
        this.state = {
            statusIdx: 0,
        }
    }

    selectStatus = (index) => {
        this.setState({
            statusIdx: index,
        })
    }

    render() {
        let title = "产品";
        let status = [
            { status: "待发布", itemQty: 3 },
            { status: "已发布", itemQty: 12 },
            { status: "回收站", itemQty: 3 },
        ];
        let searchBtnText = "搜索产品";
        return (
            <main
                className={"content-wraper " + (this.props.isfolded ? "fold" : "")}
            >
                <ContentHeader
                    title={title}
                    status={status}
                    statusIdx={this.state.statusIdx}
                    searchBtnText={searchBtnText}
                    selectStatus={this.selectStatus}
                ></ContentHeader>
                <ContentTable></ContentTable>
            </main>
        );
    }
}

export default Content;