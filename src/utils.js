class BaseLocalStorage {
    constructor(tableName) {
        this.tableName = tableName;
    }

    getTable() {
        return JSON.parse(this.storage.getItem(this.tableName)) || [];
    }

    setItem(key, value, callback) {
        let status = this.status.SUCCESS,
            result,
            tableData = this.getTable();
        if (key === "") {
            key = tableData.push(value) - 1;
            value.id = key;
        } else if (key < tableData.length) {
            tableData[key] = value;
        } else {
            status = this.status.FAILURE;
        };

        try {
            this.storage.setItem(this.tableName, JSON.stringify(tableData));
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
            value = key.toString().toLowerCase() === "all" ?
                this.getTable() :
                this.getTable()[key],
            result;


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
        return result;
    }

    removeItem(key, callback) {
        let status = this.status.FAILURE,
            value = null,
            result;

        value = this.getItem(key).value;

        if (value) {
            value.splice(key, 1);
            this.setItem(key, value);
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
        super("prodcuts");
    }
    create(obj) {
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
            this.setItem("", obj, (res) => {
                if (res.status.code === 0) {
                    resolve(res);
                } else {
                    reject(res);
                };
            });
        })
    }

    update(id, obj) {
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

    create(obj) {
        /* obj = {
            id:id,
            name: name,
            images:Array,
            parent:Array,
            status:String,
            children:Array,
            productsCollection:Array,
            }
        */
        return new Promise((resolve, reject) => {
            this.setItem("", obj, (res) => {
                if (res.status.code === 0) {
                    resolve(res);
                } else {
                    reject(res);
                };
            });
        })
    }

    update(id, obj) {
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
                let table = this.getTable(),
                    category = res.value,
                    children = [];
                table.forEach(({ value, index }) => {
                    value.parent === category.id && children.push(value);
                });
                category.children = children;

                //TODO:增加productsCollection的数据处理

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

class Tags extends BaseLocalStorage {
    constructor() {
        super("tags");
    }
    create(obj) {
        return new Promise((resolve, reject) => {
            this.setItem("", obj, (res) => {
                if (res.status.code === 0) {
                    resolve(res);
                } else {
                    reject(res);
                };
            });
        })
    }

    update(id, obj) {
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

const DATABASE = {
    products: new Products(),
    categories: new Categories(),
    attributes: new Attributes(),
    tags: new Tags(),
}

export { DATABASE }

