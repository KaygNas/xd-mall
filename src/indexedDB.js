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
        const notInDB = objectStoreNames
            .some(name => !db.objectStoreNames.contains(name))
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

    async getAll(filter) {
        const objectStore = await this.getObjectStore("readonly")
        const index = filter && Object.keys(filter)[0]
        const key = filter && filter[index]
        const keyRange = key && IDBKeyRange.only(key)
        const objecStoreIndex = index ? objectStore.index(index) : objectStore
        const res = await new Promise((resolve, reject) => {
            const request = objecStoreIndex.getAll(keyRange)
            request.onsuccess = e => resolve(e.target.result)
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

    async count(filter) {
        const objectStore = await this.getObjectStore("readonly")
        const index = filter && Object.keys(filter)[0]
        const key = filter && filter[index]
        const keyRange = key && IDBKeyRange.only(key)
        const objecStoreIndex = index ? objectStore.index(index) : objectStore
        const res = await new Promise((resolve, reject) => {
            const request = objecStoreIndex.count(keyRange)
            request.onsuccess = e => resolve(e.target.result)
            request.onerror = e => reject(e.target.result)
        })
        return res;
    }
}

const categories = new ObjectStore("categories")
const getAllCategories = ObjectStore.prototype.getAll.bind(categories)
const formateCategoriesDetail = async function (categories) {
    for (let category of categories) {
        category.children = await getAllCategories({ parentID: category.id })
        category.productsQuantity = await products.count({ categories: category.id })
    }
    return categories
}

categories.getAll = async function (filter) {
    let res = await getAllCategories(filter)
    res = await formateCategoriesDetail(res)
    return res
}

const products = new ObjectStore("products")
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
const addProduct = ObjectStore.prototype.add.bind(products)
const putProduct = ObjectStore.prototype.put.bind(products)
const getProduct = ObjectStore.prototype.get.bind(products)
const getAllProducts = ObjectStore.prototype.getAll.bind(products)

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

products.getAll = async function (filter) {
    let res = await getAllProducts(filter)
    for (let i in res) {
        res[i] = await formateProductDetail(res[i])
    }
    return res
}

const tags = new ObjectStore("tags")
const getAllTags = ObjectStore.prototype.getAll.bind(tags)
const formateTagsDetail = async function (tags) {
    for (let tag of tags) {
        tag.productsQuantity = await products.count({ tags: tag.id })
    }
    return tags
}
tags.getAll = async function () {
    let res = await getAllTags()
    res = await formateTagsDetail(res)
    return res
}


const INDEXEDDB = {
    categories,
    products,
    tags,
    attributes: new ObjectStore("attributes"),
}

export default INDEXEDDB