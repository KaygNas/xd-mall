import INDEXEDDB from "./indexedDB"

const addItem = ({ type, data, item }, callback) => {
    //拦截相同的选项,首先比较其id,否则则比较其本身 
    if (item.id) {
        if (data[type].some(val => val.id === item.id)) return;
    } else {
        if (data[type].some(val => val === item)) return;
    }
    const newData = { ...data }
    newData[type].push(item);
    callback && callback(newData)
}

const removeItem = ({ type, id, data }, callback) => {
    const newData = { ...data }
    newData[type].splice(id, 1)
    callback && callback(newData)
}

const updateData = async ({ type, id, data }, callback) => {
    id = Number(id)
    if (!Number.isNaN(id)) {
        id = await INDEXEDDB[type].put(data)
    } else {
        id = await INDEXEDDB[type].add(data)
    }
    callback && callback(id)
}

const getItemData = async ({ type, id }, callback) => {
    id = Number(id)
    if (!Number.isNaN(id)) {
        const res = await INDEXEDDB[type].get(id)
        callback && callback(res)
    }
    else {
        console.warn('item ID should be a number')
    }
}

const getAllItemsData = async ({ type, filter }, callback) => {
    const res = await INDEXEDDB[type].getAll(filter)
    callback && callback(res)
}

const deleteData = async ({ type, id }, callback) => {
    id = Number(id)
    if (!Number.isNaN(id)) {
        const res = await INDEXEDDB[type].delete(id)
        callback && callback(res)
    }
    else {
        console.warn('item ID should be a number')
    }
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

