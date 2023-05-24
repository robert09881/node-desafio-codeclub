const express = require('express')
const uuid = require('uuid')
const port = 3010
const app = express()
app.use(express.json())


const orders = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params
    
    const index = orders.findIndex(purchaseOrder => purchaseOrder.id === id)
    if (index < 0) {
        return response.status(404).json({ error: "order not found"})
    } 

    request.orderIndex = index
    request.orderId = id

    next()
}

const checkUrl = (request, response, next) => {
    const method = request.method
    const url = request.url
    console.log(`method used: ${method}, and Url used: ${url}`)

    next()
}




app.get('/orders', (request, response) => {



    return response.json(orders)
})



app.post('/orders', (request, response) => {
    const { order, ClientName, Price } = request.body

    const purchaseOrder = { id: uuid.v4(), order, ClientName, Price, status: "Em preparação" }

    orders.push(purchaseOrder)



    return response.status(201).json(purchaseOrder)
})

app.put('/orders/:id', checkOrderId, (request, response) => {

    const { id } = request.params
    const { ClientName, order, Price } = request.body

    const updatedOrder = { id, ClientName, order, Price, status: "Em preparação" }

    const index = request.orderIndex



    if (index < 0) {
        return response.status(404).json({ message: "Order not found" })
    }

    orders[index] = updatedOrder


    return response.json(updatedOrder)
})

app.delete('/orders/:id', checkOrderId, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json()
})

app.patch('/orders/:id', checkOrderId, (request, response) => {
    const index = request.orderIndex
    const purchaseOrder = orders[index]

    purchaseOrder.status = "Pedido Pronto"



    return response.json(purchaseOrder)
})

app.get('/orders/:id', checkOrderId, (request, response) =>{
    const index = request.orderIndex
    const purchaseOrder = orders[index]

    return response.json(purchaseOrder)
})



app.listen(3010, () => {
    console.log('🚀Server started on port 3010')
})