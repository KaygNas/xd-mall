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

    getAllStatus: (data) => {
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

    insertProductProperty: ({ property, propertyData, product }) => {
        if (product[property].some(item => item.id === propertyData.id)) {
            return product
        }

        const newProperty = [...product[property], propertyData]
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

