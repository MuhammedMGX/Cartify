import { useState, useEffect } from "react"
import { Package } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { GetUserOrdersApi } from "./profileApi"

interface OrderItem {
  product: { title: string }
  count: number
  price: number
}

interface Order {
  _id: string
  createdAt: string
  totalOrderPrice: number
  isPaid: boolean
  isDelivered: boolean
  paymentMethodType: string
  cartItems: OrderItem[]
}


function getUserIdFromToken(): string | null {
  const token = localStorage.getItem("token")
  if (!token) return null

  try {
    const payload = token.split(".")[1]
    const decoded = JSON.parse(atob(payload))
    return decoded.id ?? null
  } catch {
    return null
  }
}

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = getUserIdFromToken()
      if (!userId) {
        setError("Could not identify the current user.")
        setIsLoading(false)
        return
      }

      try {
        const result = await GetUserOrdersApi(userId)
        setOrders(result) 
      } catch {
        setError("Failed to load orders.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading orders...</p>
  if (error) return <p className="text-sm text-destructive">{error}</p>

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold">Orders</h2>
        <p className="text-sm text-muted-foreground">
          View your past orders and their status.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-12 text-center">
          <Package className="size-8 text-muted-foreground" />
          <p className="text-sm font-medium">No orders yet</p>
          <p className="text-sm text-muted-foreground">
            Your past orders will show up here.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {order._id.slice(-8)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {order.cartItems.length} item{order.cartItems.length !== 1 ? "s" : ""}
                  </TableCell>
                  <TableCell className="font-medium">
                    {order.totalOrderPrice} EGP
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">
                    {order.paymentMethodType}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant={order.isPaid ? "default" : "outline"}>
                        {order.isPaid ? "Paid" : "Pending"}
                      </Badge>
                      <Badge variant={order.isDelivered ? "default" : "outline"}>
                        {order.isDelivered ? "Delivered" : "In Progress"}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}