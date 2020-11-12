import INDEXEDDB from "./indexedDB"

class BaseLocalStorage {
    getTable() {
        let rawData = JSON.parse(this.storage.getItem(this.tableName)) || [];
        return new Map(rawData);
    }

    autoIncrementId() {
        let autoIcrementId = this.storage.getItem(this.tableName + "-autoIcrementId");
        autoIcrementId = (autoIcrementId ? ++autoIcrementId : 1).toString();
        this.storage.setItem(this.tableName + "-autoIcrementId", autoIcrementId);
        return autoIcrementId;
    }

    setItem(key, value, callback) {
        let status = this.status.SUCCESS,
            result,
            tableData = this.getTable();
        if (!key) {
            value.id = this.autoIncrementId();
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


class Table extends BaseLocalStorage {
    constructor(tableName) {
        super();
        this.tableName = tableName;
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

    get(id, filter) {
        const filterData = (data, filter) => {
            return data.filter((item) => {
                for (let key in filter) {
                    // console.log(`filter${key} , item${key}`, filter[key] !== item[key]);
                    if (Array.isArray(item[key])) {
                        return item[key].some(val => val.id === filter[key].id)
                    } else if (filter[key] !== item[key]) {
                        return false;
                    }
                }
                return true;
            })
        }

        return new Promise((resolve, reject) => {
            this.getItem(id, (res) => {
                if (res.status.code === 0) {
                    if (id === "all" && filter) {
                        res.value = filterData(res.value, filter);
                    }
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

//不安全,外部能通过对象访问到BaseLocalStorage的共享方法,但我只想暴露Table的共享方法而已.
const products = new Table("products"),
    categories = new Table("categories"),
    attributes = new Table("attributes"),
    tags = new Table("tags");

//categories的数据需要额外的处理
categories.get = function (id, filter) {
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
                // console.log(`filter${key} , item${key}`, filter[key] !== item[key]);
                if (Array.isArray(item[key])) {
                    return item[key].some(val => val.id === filter[key].id)
                } else if (filter[key] !== item[key]) {
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
                        // console.log("res after filter", res.value);
                    }
                } else {
                    let categories = this.getItem("all");
                    res.value.children = colChildren(res.value.id, categories);
                }
                // console.log("get categories", res);
                resolve(res);
            } else {
                reject(res);
            };
        });
    })
}


export const DATABASE = {
    products: products,
    categories: categories,
    attributes: attributes,
    tags: tags,
}

const addItem = ({ that, type, item }) => {
    let data = that.state.data;
    //拦截相同的选项,首先比较其id,否则则比较其本身 
    if (item.id) {
        if (data[type].some(val => val.id === item.id)) return;
    } else {
        if (data[type].some(val => val === item)) return;
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
const updateData = async ({ that, type, url }) => {
    let id = that.state.id === "new" ? "" : that.state.id
    const data = that.state.data

    if (id) {
        await INDEXEDDB[type].put({ id, data })
    } else {
        id = await INDEXEDDB[type].add(data)
    }
    that.props.history.push(url + id);
    // DATABASE[type].set(id, that.state.data).then(res => {
    //     that.props.history.push(url + res.value.id);
    // });
}

const getItemData = ({ that, type }) => {
    //获取数据
    if (that.props.params.id !== "new") {
        DATABASE[type].get(that.props.params.id).then(res => {
            // console.log("recieve response", res);
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
        // console.log("recieve data", res.value);
        if (res.status.code === 0) {
            // console.log(res);
            setData && that.setState({
                [setData]: res.value,
            })
            callback && callback(res);
        }
    })
}

const deleteData = ({ type, key }, callback) => {
    DATABASE[type].remove(key).then(res => {
        // console.log("recieve response", res);
        if (res.status.code === 0) {
            callback && callback(res);
        }
    })
}

const getLocaleISOTime = ({ zoneoff }) => {
    return new Date(Date.now() + zoneoff * 3600 * 1000)
        .toISOString().replace(/(:\d+\.\w+)$/, "");
}

const getAllStatus = (data) => {
    let status = [],
        stat = new Map();
    data.forEach((item) => {
        let value = stat.get(item.status);
        if (value) {
            stat.set(item.status, ++value);
        } else {
            stat.set(item.status, 1)
        }
    })
    status.push({ status: "全部", itemQty: data.length });
    stat.forEach((val, key) => {
        status.push({ status: key, itemQty: val });
    })
    return status;
}

const joinWithParent = (categories, id) => {
    const helper = (category, id, parent) => {
        if (category.id === id) {
            return parent + category.name;
        };
        if (!category.children || category.children === 0) {
            return "";
        };
        let res = "";
        for (let child of category.children) {
            res += helper(child, id, category.name + "/");
        }
        return res;
    }

    for (let cate of categories) {
        let res = helper(cate, id, "")
        if (res) {
            return res;
        }
    }
}

export const commonAction = {
    addItem: addItem,
    removeItem: removeItem,
    updateData: updateData,
    getItemData: getItemData,
    getAllItemsData: getAllItemsData,
    deleteData: deleteData,
    getLocaleISOTime: getLocaleISOTime,
    getAllStatus: getAllStatus,
    joinWithParent: joinWithParent,
}

