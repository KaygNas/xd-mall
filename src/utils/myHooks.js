import { useState, useRef, useEffect, useReducer, useCallback } from "react"
import { commonAction as ca } from "./utils"

export function useProductCollection({ propertyType, property }) {
    const originProductsCollection = useRef([])
    const cachedProductsCollection = useRef([])
    const [productsCollection, setProductsCollection] = useState([])
    const [pages, turnPage] = usePages("products", { index: propertyType, key: property.id })
    const cachedDataLengthNeeded = pages.curPage * pages.perPage
    const [allDataLoaded, setAllDataLoaded] = useState(false)

    const diffUpdateProductsCollection = ({ propertyType, property }) => {
        //获取 originProductsCollection 中有, 而 productsCollection 没有的 products, 即移除的
        const removedProducts = ca.getDiffFrom(originProductsCollection.current, cachedProductsCollection.current, "id")
        //获取 productsCollection 中有, 而 originProductsCollection 没有的 products, 即新添加的
        const addedProducts = ca.getDiffFrom(cachedProductsCollection.current, originProductsCollection.current, "id")
        removedProducts.forEach(product => {
            const newProduct = ca.removeProductProperty({ propertyType, property, product })
            ca.updateData({ type: "products", id: product.id, data: newProduct })
        })
        addedProducts.forEach(product => {
            const newProduct = ca.insertProductProperty({ propertyType, property, product })
            ca.updateData({ type: "products", id: product.id, data: newProduct })
        })
    }

    function responseFromCache() {
        return cachedProductsCollection.current.slice(cachedDataLengthNeeded - pages.perPage, cachedDataLengthNeeded)
    }

    function getProductsCollection(callback) {
        const resopnseData = responseFromCache()
        if (resopnseData.length < pages.perPage && !allDataLoaded) {
            property.id && ca.getAllItemsData({
                type: "products",
                options: { index: propertyType, key: property.id, page: pages.curPage },
            }, (res) => {
                res.length < pages.perPage && setAllDataLoaded(true)
                originProductsCollection.current.push(...res)
                cachedProductsCollection.current.push(...res)
                const data = responseFromCache()
                callback && callback(data)
            })
        } else {
            const data = responseFromCache()
            callback && callback(data)
        }
    }

    function editProductsInCache(data) {
        cachedProductsCollection.current.splice(cachedDataLengthNeeded - pages.perPage, pages.perPage, ...data)
        const res = responseFromCache()
        setProductsCollection(res)
    }


    useEffect(() => {
        getProductsCollection((res) => {
            editProductsInCache(res)
        })
    }, [pages.curPage, property.id])

    return [
        productsCollection,
        editProductsInCache,
        diffUpdateProductsCollection,
        pages,
        turnPage,
    ]
}


export function usePages(type, options = {}) {
    //TODO: 在 edit 编辑增删项目时应同时更新
    const [pages, setPages] = useState({ curPage: 1, perPage: 3, totalPages: 1, totalItems: 0 })
    useEffect(() => {
        getPages()
    }, [options.index, options.key])

    const getPages = () => {
        ca.getItemsQuantity({ type, options }, (res) => {
            const totalItems = res
            const totalPages = Math.ceil(totalItems / pages.perPage)
            setPages({ ...pages, totalPages, totalItems })
        })
    }

    const turnPage = (action, callback) => {
        let curPage = pages.curPage
        let totalPages = pages.totalPages
        switch (action) {
            case "first":
                curPage = 1
                break
            case "pre":
                curPage = curPage > 1 ? curPage - 1 : 1
                break
            case "next":
                curPage = curPage < totalPages ? curPage + 1 : totalPages
                break
            case "last":
                curPage = totalPages
                break
            default:
        }
        const newPages = { ...pages, curPage }
        callback && callback(newPages)
        setPages(newPages)
    }
    return [pages, turnPage]
}