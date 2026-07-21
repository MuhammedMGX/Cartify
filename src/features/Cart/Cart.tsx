import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Plus, Minus } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { getCart, removeFromCart, updateCartQuantity, applyCoupon, clearCart } from './cartSlice'
import { Link } from 'react-router-dom'
import { Spinner } from '@/components/Spinner'

export default function Cart() {
  const dispatch = useAppDispatch()
  const { cart, isLoading  } = useAppSelector((state) => state.cartReducer) 

  const [couponCode, setCouponCode] = useState('') 
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online' | null>(null) 
  const [couponError, setCouponError] = useState<string | null>(null) 

  useEffect(() => {
    dispatch(getCart())
  }, [dispatch])
    useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, []);

  if (isLoading && !cart) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Spinner />
        </div>
      </div>
    )
  }

  const items = cart?.products ?? []
  const isEmpty = items.length === 0


  const handleIncrement = (productId: string, currentCount: number) => {
    dispatch(updateCartQuantity({ productId, count: currentCount + 1 }))
  }

  const handleDecrement = (productId: string, currentCount: number) => {
    if (currentCount <= 1) return
    dispatch(updateCartQuantity({ productId, count: currentCount - 1 }))
  }

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId))
  }
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponError(null)
    try {
      await dispatch(applyCoupon(couponCode)).unwrap()
    } catch {
      setCouponError('Invalid or expired coupon code.')
    }
  }

  const handleClearCart = () => {
    dispatch(clearCart())
    setPaymentMethod(null)
    setCouponCode("")
  }



  const subtotal = items.reduce(
    (sum: number, item: any) => sum + item.price * item.count,
    0
  )
  const total = cart?.totalCartPrice ?? subtotal

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

            <div className="flex items-center justify-between">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Shopping Cart
          </h1>
          {!isEmpty && (
              <Button
                variant="outline"
                onClick={handleClearCart}
                className="border-destructive text-destructive hover:bg-destructive/10"
              >
                Clear Cart
              </Button>
            )}
        </div>


        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {isEmpty ? (
              <div className="rounded-lg border border-border bg-card p-8 text-center">
                <p className="text-foreground/60">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item: any) => (
                  <div
                    key={item._id}
                    className="flex gap-4 rounded-lg border border-border bg-card p-4"
                  >
                    {item.product?.imageCover && (
                      <img
                        src={item.product.imageCover}
                        alt={item.product.title}
                        className="h-24 w-24 rounded object-cover"
                      />
                    )}

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{item.product?.title}</h3>
                        <p className="text-sm text-foreground/60">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDecrement(item.product.id, item.count)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold text-foreground">
                          {item.count}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleIncrement(item.product.id, item.count)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <p className="font-semibold text-foreground">
                        ${(item.price * item.count).toFixed(2)}
                      </p>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveItem(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: Coupon & Checkout */}
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Apply Coupon</h2>
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={isLoading}
                  className="border-border"
                />
                <Button onClick={handleApplyCoupon} disabled={isLoading} className="w-full">
                  {isLoading ? 'Applying...' : 'Apply Coupon'}
                </Button>
                {couponError && (
                  <p className="text-sm text-destructive">{couponError}</p>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Order Summary</h2>
              <div className="space-y-2 border-b border-border pb-4">
                <div className="flex justify-between text-foreground/80">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between pt-4 text-lg font-bold text-foreground">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Payment Method</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-2 rounded border border-border p-3 cursor-pointer hover:bg-accent/10">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                    className="h-4 w-4"
                  />
                  <span className="text-foreground">Cash on Delivery</span>
                </label>
                <label className="flex items-center gap-2 rounded border border-border p-3 cursor-pointer hover:bg-accent/10">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="h-4 w-4"
                  />
                  <span className="text-foreground">Online Payment</span>
                </label>
              </div>
            </div>



              <Link to="/checkout" state={{type:paymentMethod}}>
                <Button
                  disabled={isLoading || isEmpty || !paymentMethod}
                  size="lg"
                  className="w-full"
                >
                  {isLoading ? 'Processing...' : 'Proceed to Checkout'}
                </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// state={{type:"Cash on Delivery"}}