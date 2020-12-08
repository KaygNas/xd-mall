import { useState, useRef, useEffect, useReducer, useCallback } from "react"
import { commonAction as ca } from "./utils"

export function useProductCollection({ propertyType, property }) {
    const originProductsCollection = useRef([])
    const cachedProductsCollection = useRef([])
    const [productsCollection, setProductsCollection] = useState([])
    const [pages, turnPage] = usePages("products", { index: propertyType, key: property.id })
    const cachedDataLengthNeeded = pages.curPage * pages.perPage
    //控制数据的请求
    const [allDataLoaded, setAllDataLoaded] = useState(false)
    //上方的 pages 表示的是本地的数据, 而下方的 page 表示的是下一个应该请求的数据页数
    const [curPageInData, setCurPageInData] = useState(1)

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

    function getProductsCollection() {
        const res = responseFromCache()

        if (res.length < pages.perPage && !allDataLoaded) {
            property.id && ca.getAllItemsData({
                type: "products",
                options: { index: propertyType, key: property.id, page: curPageInData },
            }, (res) => {
                pages.curPage === pages.totalPages && setAllDataLoaded(true)
                setCurPageInData(curPageInData + 1)
                originProductsCollection.current.push(...res)
                cachedProductsCollection.current.push(...res)
                setProductsCollection(responseFromCache())
            })
        } else {
            setProductsCollection(res)
        }
    }

    function editProductsInCache(data) {
        // 更新 cache 里的数据
        if (data) {
            cachedProductsCollection.current.splice(cachedDataLengthNeeded - pages.perPage, pages.perPage, ...data)

            if (pages.curPage === pages.totalPages) {
                const ItemsOnLastPage = pages.totalItems - (pages.totalPages - 1) * pages.perPage
                data.length > ItemsOnLastPage && turnPage({ type: "editItems", text: "add" })
                data.length < ItemsOnLastPage && turnPage({ type: "editItems", text: "remove" })
            } else {
                data.length > pages.perPage && turnPage({ type: "editItems", text: "add" })
                data.length < pages.perPage && turnPage({ type: "editItems", text: "remove" })
            }
        }

        getProductsCollection()
    }


    useEffect(() => {
        getProductsCollection()
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

    const calcTotalPages = (totalItems) => {
        return Math.ceil(totalItems / pages.perPage)
    }

    const getPages = () => {
        ca.getItemsQuantity({ type, options }, (res) => {
            const totalItems = res
            const totalPages = calcTotalPages(totalItems)
            setPages({ ...pages, totalPages, totalItems })
        })
    }

    const turnPage = (action = {}, callback) => {

        let newPages = {}
        if (action.type === "turnPage") {
            let curPage = pages.curPage
            let totalPages = pages.totalPages

            switch (action.text) {
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

            newPages = { ...pages, curPage }

        } else if (action.type === "editItems") {

            let totalItems = pages.totalItems

            switch (action.text) {
                case "add":
                    totalItems++
                    break
                case "remove":
                    totalItems--
                    break
                default:
            }
            const totalPages = calcTotalPages(totalItems)
            newPages = { ...pages, totalPages, totalItems }

        }

        callback && callback(newPages)
        setPages(newPages)
    }

    return [pages, turnPage]
}