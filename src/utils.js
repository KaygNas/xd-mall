class BaseLocalStorage {
    constructor(tableName) {
        this.tableName = tableName;
    }

    getTable() {
        let rawData = JSON.parse(this.storage.getItem(this.tableName)) || [];
        return new Map(rawData);
    }

    generateId(tableData) {
        let lastId = tableData.size > 0 ?
            Array.from(tableData)[tableData.size - 1][0] : 0;
        return ++lastId + "";
    }

    setItem(key, value, callback) {
        let status = this.status.SUCCESS,
            result,
            tableData = this.getTable();
        if (!key) {
            value.id = this.generateId(tableData);
            tableData.set(value.id, value);
        } else if (tableData.has(key)) {
            tableData.set(key, value);
        } else {
            status = this.status.FAILURE;
        };

        try {
            this.storage.setItem(
                this.tableName,
                JSON.stringify(
                    Array.from(tableData)
                )
            );
        } catch (err) {
            status = this.status.OVERFLOW;
        };

        result = {
            key: key,
            value: value,
            status: status,
        };

        callback && callback.call(this, result);
    }

    getItem(key, callback) {
        let status = this.status.SUCCESS,
            value,
            result;

        value = key.toString().toLowerCase() === "all" ?
            Array.from(this.getTable().values()) :
            this.getTable().get(key);

        if (!value) {
            value = null;
            status = this.status.FAILURE;
        }

        result = {
            key: key,
            value: value,
            status: status,
        };

        callback && callback.call(this, result);
        return value;
    }

    removeItem(key, callback) {
        let status = this.status.FAILURE,
            value = this.getItem(key),
            tableData = this.getTable(),
            result;

        if (value) {
            tableData.delete(key);
            this.storage.setItem(
                this.tableName,
                JSON.stringify(
                    Array.from(tableData)
                )
            );
            status = this.status.SUCCESS;
        } else {
            status = this.status.FAILURE;
        }

        result = {
            key: key,
            value: value,
            status: status,
        }
        callback && callback.call(this, result);
    }
}

Object.assign(BaseLocalStorage.prototype, {
    storage: localStorage || window.localStorage,
    status: {
        SUCCESS: {
            code: 0,
            message: "success"
        },
        FAILURE: {
            code: 1,
            message: "failure"
        },
        OVERFLOW: {
            code: 2,
            message: "overflow"
        },
    },
})

class Products extends BaseLocalStorage {
    constructor() {
        super("products");
    }
    set(id, obj) {
        /* obj = {
                id:id,
                name: name,
                attributes:Array,
                categories:Array,
                images:Array,
                status:String,
                order:Number || String,
                regular_price:Number || String,
                sale_price:Number || String,
                in_stock:Boolean,
                limits:Number || String,
                tags:Array,
            }
        */
        return new Promise((resolve, reject) => {
            this.setItem(id, obj, (res) => {
                if (res.status.code === 0) {
                    resolve(res);
                } else {
                    reject(res);
                };
            });
        })
    }

    get(id) {
        return new Promise((resolve, reject) => {
            this.getItem(id, (res) => {
                if (res.status.code === 0) {
                    resolve(res);
                } else {
                    reject(res);
                };
            });
        })
    }

    remove(id) {
        return new Promise((resolve, reject) => {
            this.removeItem(id, (res) => {
                if (res.status.code === 0) {
                    resolve(res);
                } else {
                    reject(res);
                };
            });
        })
    }
}

class Attributes extends BaseLocalStorage {
    constructor() {
        super("attributes");
    }

    set(id, obj) {
        return new Promise((resolve, reject) => {
            this.setItem(id, obj, (res) => {
                if (res.status.code === 0) {
                    resolve(res);
                } else {
                    reject(res);
                };
            });
        })
    }

    get(id) {
        return new Promise((resolve, reject) => {
            this.getItem(id, (res) => {
                if (res.status.code === 0) {
                    resolve(res);
                } else {
                    reject(res);
                };
            });
        })
    }

    remove(id) {
        return new Promise((resolve, reject) => {
            this.removeItem(id, (res) => {
                if (res.status.code === 0) {
                    resolve(res);
                } else {
                    reject(res);
                };
            });
        })
    }
}

class Categories extends BaseLocalStorage {
    constructor() {
        super("categories");
    }

    set(id, obj) {
        /* obj = {
            id:id,
            name: name,
            images:Array,
            parent:Object,
            status:String,
            children:Array,
            productsCollection:Array,
            order:String || Number,
            modifiedDate:String,
            }
        */
        return new Promise((resolve, reject) => {
            this.setItem(id, obj, (res) => {
                if (res.status.code === 0) {
                    resolve(res);
                } else {
                    reject(res);
                };
            });
        })
    }

    get(id, filter) {
        const colChildren = (parentId, data) => {
            let children = [];
            for (let item of data) {
                if (item.parent.id === parentId) {
                    item.children = colChildren(item.id, data);
                    children.push(item);
                }
            }
            return children;
        }

        const filterData = (data, filter) => {
            return data.filter((item) => {
                for (let key in filter) {
                    if (filter[key] !== item[key]) {
                        return false;
                    }
                }
                return true;
            })
        }

        return new Promise((resolve, reject) => {
            this.getItem(id, (res) => {
                //TODO:增加productsCollection的数据处理
                if (res.status.code === 0) {
                    if (id === "all") {
                        res.value = colChildren("", res.value);
                        if (filter) {
                            res.value = filterData(res.value, filter);
                        }
                    } else {
                        let categories = this.getItem("all");
                        res.value.children = colChildren(res.value.id, categories);
                    }
                    console.log("get categories", res);
                    resolve(res);
                } else {
                    reject(res);
                };
            });
        })
    }

    remove(id) {
        return new Promise((resolve, reject) => {
            this.removeItem(id, (res) => {
                if (res.status.code === 0) {
                    resolve(res);
                } else {
                    reject(res);
                };
            });
        })
    }
}

class Tags extends BaseLocalStorage {
    constructor() {
        super("tags");
    }
    set(id, obj) {
        /* obj = {
             id:id,
             name: name,
         }
         */
        return new Promise((resolve, reject) => {
            this.setItem(id, obj, (res) => {
                if (res.status.code === 0) {
                    resolve(res);
                } else {
                    reject(res);
                };
            });
        })
    }

    get(id) {
        return new Promise((resolve, reject) => {
            this.getItem(id, (res) => {
                if (res.status.code === 0) {
                    resolve(res);
                } else {
                    reject(res);
                };
            });
        })
    }

    remove(id) {
        return new Promise((resolve, reject) => {
            this.removeItem(id, (res) => {
                if (res.status.code === 0) {
                    resolve(res);
                } else {
                    reject(res);
                };
            });
        })
    }
}

export const DATABASE = {
    products: new Products(),
    categories: new Categories(),
    attributes: new Attributes(),
    tags: new Tags(),
}

const addItem = ({ that, type, item }) => {
    let data = that.state.data;
    //拦截相同的选项,第一判断标准为 id, 第二判断标准为 name
    if (item.id) {
        if (data[type].some(val => val.id === item.id)) return;
    } else {
        if (data[type].some(val => val.name === item.name)) return;
    }
    data[type].push(item);
    that.setState({
        data: data,
        newItem: "",
    })
}

const removeItem = ({ that, type, id }) => {
    let data = that.state.data;
    data[type].splice(id, 1);
    that.setState({
        data: data,
    })
}


//这很不函数式,依赖与外部的状态
const updateData = ({ that, type, url }) => {
    let id = that.state.id === "new" ? "" : that.state.id;
    DATABASE[type].set(id, that.state.data).then(res => {
        that.props.history.push(url + res.value.id);
    });
}

const getItemData = ({ that, type, emptyItem }) => {
    //获取数据
    if (that.props.params.id === "new"
        && that.props.params.id !== that.state.id) {
        that.setState({
            id: that.props.params.id,
            data: emptyItem,
        })
    } else if (that.props.params.id !== that.state.id) {
        DATABASE[type].get(that.props.params.id).then(res => {
            console.log("recieve response", res);
            if (res.status.code === 0) {
                that.setState({
                    id: that.props.params.id,
                    data: res.value,
                })
            }
        })
    }
}

const getAllItemsData = ({ that, type, filter, setData }, callback) => {
    DATABASE[type].get("all", filter).then(res => {
        console.log("recieve data", res.value);
        if (res.status.code === 0) {
            console.log(res);
            setData && that.setState({
                [setData]: res.value,
            })
            callback && callback(res);
        }
    })
}

const deleteData = ({ type, key }, callback) => {
    DATABASE[type].remove(key).then(res => {
        console.log("recieve response", res);
        if (res.status.code === 0) {
            callback && callback(res);
        }
    })
}

const getLocaleISOTime = ({ zoneoff }) => {
    return new Date(Date.now() + zoneoff * 3600 * 1000)
        .toISOString().replace(/(:\d+\.\w+)$/, "");
}

export const commonAction = {
    addItem: addItem,
    removeItem: removeItem,
    updateData: updateData,
    getItemData: getItemData,
    getAllItemsData: getAllItemsData,
    deleteData: deleteData,
    getLocaleISOTime: getLocaleISOTime,
}

