import { useState, useRef, useEffect } from "react"
import { commonAction as ca } from "./utils"

export function useProductCollection({ property, propertyID }) {
    const originProductsCollection = useRef([])
    const [productsCollection, setProductsCollection] = useState([])

    const diffUpdateProductsCollection = () => {
        //获取 originProductsCollection 中有, 而 productsCollection 没有的 products, 即移除的
        const removedProducts = ca.getDiffFrom(originProductsCollection.current, productsCollection, "id")
        //获取 productsCollection 中有, 而 originProductsCollection 没有的 products, 即新添加的
        const addedProducts = ca.getDiffFrom(productsCollection, originProductsCollection.current, "id")
        removedProducts.forEach(product => {
            const newProduct = ca.removeProductProperty({ property, propertyID, product })
            ca.updateData({ type: "products", id: product.id, data: newProduct })
        })
        addedProducts.forEach(product => {
            ca.updateData({ type: "products", id: product.id, data: product })
        })
    }

    useEffect(() => {
        ca.getAllItemsData({
            type: "products",
            filter: { [property]: propertyID },
        }, (res) => {
            setProductsCollection(res)
            originProductsCollection.current = res
        })
    }, [])

    return [
        productsCollection,
        setProductsCollection,
        diffUpdateProductsCollection,
    ]
}
