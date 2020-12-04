import { useState, useRef, useEffect, useReducer, useCallback } from "react"
import { commonAction as ca } from "./utils"

export function useProductCollection({ property, propertyID }) {
    const originProductsCollection = useRef([])
    const [productsCollection, setProductsCollection] = useState([])
    const [pages, turnPage] = usePages("products", { index: property, key: propertyID })

    const diffUpdateProductsCollection = ({ property, propertyID }) => {
        //获取 originProductsCollection 中有, 而 productsCollection 没有的 products, 即移除的
        const removedProducts = ca.getDiffFrom(originProductsCollection.current, productsCollection, "id")
        //获取 productsCollection 中有, 而 originProductsCollection 没有的 products, 即新添加的
        const addedProducts = ca.getDiffFrom(productsCollection, originProductsCollection.current, "id")
        removedProducts.forEach(product => {
            const newProduct = ca.removeProductProperty({ property, propertyID, product })
            ca.updateData({ type: "products", id: product.id, data: newProduct })
        })
        addedProducts.forEach(product => {
            const newProduct = ca.insertProductProperty({ property, propertyID, product })
            ca.updateData({ type: "products", id: product.id, data: newProduct })
        })
    }

    useEffect(() => {
        propertyID
            && ca.getAllItemsData({
                type: "products",
                options: { index: property, key: propertyID, page: pages.curPage },
            }, (res) => {
                setProductsCollection(res)
                originProductsCollection.current = res
            })
    }, [pages.curPage])

    return [
        productsCollection,
        setProductsCollection,
        diffUpdateProductsCollection,
        pages,
        turnPage,
    ]
}


export function usePages(type, options) {
    const [pages, setPages] = useState({ curPage: 1, perPage: 3, totalPages: 1 })
    useEffect(() => {
        getPages()
    }, [])

    const getPages = () => {
        ca.getItemsQuantity({ type, options }, (res) => {
            const totalPages = Math.ceil(res / pages.perPage)
            setPages({ ...pages, totalPages })
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