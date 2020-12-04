const DBNAME = "xdMall"
const VERSION = 14

class ObjectStore {
    static indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
    static database = null

    constructor(objectStoreName) {
        this.objectStoreName = objectStoreName
    }

    upgrade(request) {
        const db = request.result
        const objectStoreNames = ["products", "categories", "attributes", "tags"]
        const notInDB = objectStoreNames.some(name => !db.objectStoreNames.contains(name))
        let objectStores = {}
        if (notInDB) {
            objectStoreNames.forEach(name => db.deleteObjectStore(name))
            objectStoreNames.forEach(name => {
                objectStores[name] = db.createObjectStore(name, { keyPath: "id", autoIncrement: true })
            })
        } else {
            objectStoreNames.forEach(name => {
                objectStores[name] = request.transaction.objectStore(name)
            })
        }

        for (let name in objectStores) {
            Array.prototype.forEach.call(objectStores[name].indexNames, (indexName) => {
                objectStores[name].deleteIndex(indexName)
            })
        }
        objectStores.categories.createIndex("parentID", "parent.id", { unique: false })
        objectStores.categories.createIndex("status", "status", { unique: false })
        objectStores.products.createIndex("categories", "categories", { unique: false, multiEntry: true })
        objectStores.products.createIndex("tags", "tags", { unique: false, multiEntry: true })
        objectStores.products.createIndex("status", "status", { unique: false, multiEntry: true })
    }

    open() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DBNAME, VERSION)
            request.onupgradeneeded = e => {
                this.upgrade(e.target)
                resolve(e.target.result)
            }
            request.onsuccess = e => { resolve(e.target.result) }
            request.onerror = e => { reject(e.target.result) }
        })
    }

    async getObjectStore(mode) {
        const objectStoreName = this.objectStoreName
        const db = ObjectStore.database ? ObjectStore.database : await this.open()
        const transaction = db.transaction([objectStoreName], mode)
        const objectStore = transaction.objectStore(objectStoreName)
        return objectStore
    }

    async getAll(options = {}) {
        // 为 page 指定默认值
        options.page = options.page || 1
        options.perPage = options.perPage || 3
        const objectStore = await this.getObjectStore("readonly")
        const keyRange = options.key && IDBKeyRange.only(options.key)
        const objecStoreIndex = options.index ? objectStore.index(options.index) : objectStore

        const res = []
        await new Promise((resolve, reject) => {
            const request = objecStoreIndex.openCursor(keyRange)
            let skipItems = (options.page - 1) * options.perPage
            let getResults = (cursor) => {
                if (skipItems) {
                    cursor.advance(skipItems)
                    skipItems = 0
                    return
                }
                // 惰性修改 getResults 函数, 减少分支判断
                getResults = cursor => {
                    if (cursor && res.length < options.perPage) {
                        res.push(cursor.value)
                        cursor.continue()
                    } else {
                        resolve('map Done')
                    }
                }
                getResults(cursor)
            }

            request.onsuccess = e => {
                let cursor = e.target.result
                getResults(cursor)
            }
            request.onerror = e => reject(e.target.result)
        })

        return res;
    }

    async get(id) {
        const objectStore = await this.getObjectStore("readonly")
        id = typeof id === "number" ? id : Number(id)
        const res = await new Promise((resolve, reject) => {
            const request = objectStore.get(id)
            request.onsuccess = e => resolve(e.target.result)
            request.onerror = e => reject(e.target.result)
        })
        return res;
    }

    async add(data) {
        const objectStore = await this.getObjectStore("readwrite")
        const res = await new Promise((resolve, reject) => {
            const request = objectStore.add(data)
            request.onsuccess = e => resolve(e.target.result)
            request.onerror = e => reject(e.target.result)
        })
        return res;
    }

    async put(data) {
        const objectStore = await this.getObjectStore("readwrite")
        const res = await new Promise((resolve, reject) => {
            const request = objectStore.put(data)
            request.onsuccess = e => resolve(e.target.result)
            request.onerror = e => reject(e.target.result)
        })
        return res;
    }

    async delete(id) {
        const objectStore = await this.getObjectStore("readwrite")
        const res = await new Promise((resolve, reject) => {
            const request = objectStore.delete(id)
            request.onsuccess = e => resolve(e.target.result)
            request.onerror = e => reject(e.target.result)
        })
        return res;
    }

    async count(options = {}) {
        const objectStore = await this.getObjectStore("readonly")
        const keyRange = options.key && IDBKeyRange.only(options.key)
        const objecStoreIndex = options.index ? objectStore.index(options.index) : objectStore
        const res = await new Promise((resolve, reject) => {
            const request = objecStoreIndex.count(keyRange)
            request.onsuccess = e => resolve(e.target.result)
            request.onerror = e => reject(e.target.result)
        })
        return res;
    }

    async search(keywords) {
        const objectStore = await this.getObjectStore("readonly")
        const res = []
        const collectResult = (result) => {
            if (result.name.indexOf(keywords) !== -1) {
                res.push(result)
            }
        }
        await new Promise((resolve, reject) => {
            const request = objectStore.openCursor()
            request.onsuccess = e => {
                let cursor = e.target.result
                if (cursor) {
                    collectResult(cursor.value)
                    cursor.continue()
                } else {
                    resolve('map Done')
                }
            }

            request.onerror = e => reject(e.target.result)
        })

        return res
    }
}




const products = new ObjectStore("products")
const addProduct = ObjectStore.prototype.add.bind(products)
const putProduct = ObjectStore.prototype.put.bind(products)
const getProduct = ObjectStore.prototype.get.bind(products)
const getAllProducts = ObjectStore.prototype.getAll.bind(products)
const searchProducts = ObjectStore.prototype.search.bind(products)
const flatArrsWithId = function (data) {
    const properties = ["categories", "tags"]
    const newData = Object.assign({}, data)
    for (let property of properties) {
        newData[property] = newData[property].map(val => val.id)
    }
    return newData
}

const formateProductDetail = async function (product) {
    const properties = ["categories", "tags"]
    for (let property of properties) {
        for (let i in product[property]) {
            let id = product[property][i]
            product[property][i] = await INDEXEDDB[property].get(id)
        }
    }
    return product
}

products.add = async function (data) {
    const newData = flatArrsWithId(data)
    return await addProduct(newData)
}

products.put = async function (data) {
    const newData = flatArrsWithId(data)
    return await putProduct(newData)
}

products.get = async function (id) {
    let res = await getProduct(id)
    res = await formateProductDetail(res)
    return res
}

products.getAll = async function (options) {
    let res = await getAllProducts(options)
    for (let i in res) {
        res[i] = await formateProductDetail(res[i])
    }
    return res
}

products.search = async function (keywords) {
    let res = await searchProducts(keywords)
    for (let i in res) {
        res[i] = await formateProductDetail(res[i])
    }
    return res
}


const deleteProductsRelativeProperty = async function (options) {
    const items = await products.getAll(options)
    items.forEach(item => {
        const type = options.type
        const id = options.id
        const index = item[type].findIndex(value => value.id === id)
        item[type].splice(index, 1)
        products.put(item)
    })
}

const categories = new ObjectStore("categories")
const getAllCategories = ObjectStore.prototype.getAll.bind(categories)
const deleteCategory = ObjectStore.prototype.delete.bind(categories)
const formateCategoriesDetail = async function (categories) {
    for (let category of categories) {
        category.children = await getAllCategories({ index: "parentID", key: category.id })
        category.productsQuantity = await products.count({ index: "categories", key: category.id })
    }
    return categories
}
categories.getAll = async function (options) {
    let res = await getAllCategories(options)
    res = await formateCategoriesDetail(res)
    return res
}
categories.delete = async function (id) {
    await deleteProductsRelativeProperty({ categories: id })
    return await deleteCategory(id)
}

const tags = new ObjectStore("tags")
const getAllTags = ObjectStore.prototype.getAll.bind(tags)
const deleteTags = ObjectStore.prototype.delete.bind(tags)
const formateTagsDetail = async function (tags) {
    for (let tag of tags) {
        tag.productsQuantity = await products.count({ index: "tags", key: tag.id })
    }
    return tags
}
tags.getAll = async function (options) {
    let res = await getAllTags(options)
    res = await formateTagsDetail(res)
    return res
}
tags.delete = async function (id) {
    await deleteProductsRelativeProperty({ tags: id })
    return await deleteTags(id)
}


const INDEXEDDB = {
    categories,
    products,
    tags,
    attributes: new ObjectStore("attributes"),
}

export default INDEXEDDB