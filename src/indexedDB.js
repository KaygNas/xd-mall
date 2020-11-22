const DBNAME = "xdMall"
const VERSION = 3

class ObjectStore {
    static indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
    static database = null

    constructor(objectStoreName) {
        this.objectStoreName = objectStoreName
    }

    upgrade(db) {
        db.deleteObjectStore("products")
        db.deleteObjectStore("categories")
        db.deleteObjectStore("attributes")
        db.deleteObjectStore("tags")
        db.createObjectStore("products", { keyPath: "id", autoIncrement: true })
        db.createObjectStore("categories", { keyPath: "id", autoIncrement: true })
        db.createObjectStore("attributes", { keyPath: "id", autoIncrement: true })
        db.createObjectStore("tags", { keyPath: "id", autoIncrement: true })
    }

    open() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DBNAME, VERSION)
            request.onupgradeneeded = e => {
                const db = e.target.result
                this.upgrade(db)
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

    async getAll(keyRange) {
        const objectStore = await this.getObjectStore("readonly")
        const res = await new Promise((resolve, reject) => {
            const request = objectStore.getAll(keyRange)
            request.onsuccess = e => resolve(e.target.result)
            request.onerror = e => reject(e.target.result)
        })
        return res;
    }

    async get(id) {
        const objectStore = await this.getObjectStore("readonly")
        id = typeof id === "number" ? id : Number(id)
        const res = await new Promise((resolve, reject) => {
            const request = objectStore.get(Number(id))
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
}

console.log("ObjectStore", ObjectStore.prototype, ObjectStore.indexedDB, ObjectStore.database)

const INDEXEDDB = {
    products: new ObjectStore("products"),
    categories: new ObjectStore("categories"),
    attributes: new ObjectStore("attributes"),
    tags: new ObjectStore("tags"),
}

export default INDEXEDDB