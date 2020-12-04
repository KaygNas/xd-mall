import INDEXEDDB from "./indexedDB"

export const commonAction = {
    addItem: ({ items, item }, callback) => {
        //拦截相同的选项,首先比较其id,否则则比较其本身 
        if (item.id) {
            if (items.some(val => val.id === item.id)) {
                //TODO: noti 已存在
                return
            }
        } else {
            if (items.some(val => val === item)) {
                //TODO: noti 已存在
                return
            }
        }
        const newItems = [...items, item]
        callback && callback(newItems)
    },

    removeItem: ({ index, items }, callback) => {
        const newItems = [
            ...items.slice(0, index),
            ...items.slice(index + 1),
        ]
        callback && callback(newItems)
    },

    updateData: async ({ type, id, data }, callback) => {
        id = Number(id)
        if (!Number.isNaN(id)) {
            id = await INDEXEDDB[type].put(data)
        } else {
            id = await INDEXEDDB[type].add(data)
        }
        callback && callback(id)
        return id
    },

    getItemData: async ({ type, id }, callback) => {
        id = Number(id)
        if (!Number.isNaN(id)) {
            const res = await INDEXEDDB[type].get(id)
            callback && callback(res)
            return res
        }
        else {
            console.warn('item ID should be a number')
        }
    },

    getAllItemsData: async ({ type, options }, callback) => {
        const res = await INDEXEDDB[type].getAll(options)
        callback && callback(res)
        return res
    },

    deleteData: async ({ type, id }, callback) => {
        id = Number(id)
        if (!Number.isNaN(id)) {
            const res = await INDEXEDDB[type].delete(id)
            callback && callback(res)
        }
        else {
            console.warn('item ID should be a number')
        }
    },

    getLocaleISOTime: ({ zoneoff }) => {
        return new Date(Date.now() + zoneoff * 3600 * 1000)
            .toISOString().replace(/(:\d+\.\w+)$/, "");
    },

    getAllStatus: async (type, status) => {
        const res = []
        for (const item of Object.values(status)) {
            const qty = await INDEXEDDB[type].count({ index: "status", key: item.status })
            res.push({ ...item, itemQty: qty })
        }
        const total = res.reduce((acc, cur) => acc + cur.itemQty, 0)
        res[0].itemQty = total
        return res;
    },

    joinWithParent: (categories, id) => {
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
    },

    searchItemsData: async ({ type, keywords }, callback) => {
        const res = await INDEXEDDB[type].search(keywords)
        callback && callback(res)
        return res
    },

    removeProductProperty: ({ property, propertyID, product }) => {
        const propertyIndex = product[property].findIndex(item => item.id === propertyID)
        const newProperty = [
            ...product[property].slice(0, propertyIndex),
            ...product[property].slice(propertyIndex + 1),
        ]
        return { ...product, [property]: newProperty }
    },

    insertProductProperty: ({ property, propertyID, product }) => {
        if (product[property].some(item => item.id === propertyID)) {
            return product
        }

        const newProperty = [...product[property], { id: propertyID }]
        return { ...product, [property]: newProperty }
    },

    getDiffFrom: (orgin, current, identifier) => {
        return orgin.filter(originItem => {
            return current.every(item => item[identifier] !== originItem[identifier])
        })
    },

    getItemsQuantity: async ({ type, options }, callback) => {
        const res = await INDEXEDDB[type].count(options)
        callback && callback(res)
        return res
    },
}

