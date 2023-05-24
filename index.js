const express = require('express')
const uuid = require('uuid')
const port = 3010
const app = express()
app.use(express.json())


const orders = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params
    
    const index = orders.findIndex(purchaseOrder => purchaseOrder.id == id)
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
    console.log(`${method}, ${url}`)

    next()
}




app.get('/orders', checkUrl, (request, response) => {



    return response.json(orders)
})



app.post('/orders', checkUrl, (request, response) => {
    const { order, ClientName, Price } = request.body

    const purchaseOrder = { id: uuid.v4(), order, ClientName, Price, status: "Em preparação" }

    orders.push(purchaseOrder)



    return response.status(201).json(purchaseOrder)
})

app.put('/orders/:id', checkOrderId, checkUrl, (request, response) => {

    const { order, ClientName, Price } = request.body
    const index = request.orderIndex
    const id = request.orderId
    const status = orders[index].status

    const updatedOrder = { id, order, ClientName, Price, status }
   //if (index < 0) {
      //  return response.status(404).json({ message: "Order not found" })
   // }

    orders[index] = updatedOrder


    return response.json(updatedOrder)
});

app.delete('/orders/:id', checkOrderId, checkUrl, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json()
});

app.patch('/orders/:id', checkOrderId, checkUrl, (request, response) => {
    
    const index = request.orderIndex
    const purchaseOrder = orders[index]

    purchaseOrder.status = "Pedido Pronto"



    return response.json(purchaseOrder)
})

app.get('/orders/:id', checkOrderId, checkUrl, (request, response) =>{
    const index = request.orderIndex
    const purchaseOrder = orders[index]

    return response.json(purchaseOrder)
})



app.listen(3010, () => {
    console.log('🚀Server started on port 3010')
})