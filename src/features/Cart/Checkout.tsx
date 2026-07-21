import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate , useLocation } from "react-router-dom"
import { cashPaymentApi, OnlinePaymentApi } from "./cartApi"
import { useAppSelector } from "@/store/hooks"


const checkoutSchema  = z.object({
    details: z.string().trim().min(5, "Address details must be at least 5 characters").max(200, "Address details is too long"),
    phone: z.string().regex(/^01[0125][0-9]{8}$/, "Invalid Egyptian phone number"),
    city: z.string().trim().min(2, "City is required").max(50, "City name is too long"),
    postalCode: z.string().regex(/^\d{5}$/, "Postal code must be 5 digits"),
})
type CheckoutFormValues = z.infer<typeof checkoutSchema >


export function Checkout({
  className,
  ...props
}: React.ComponentProps<"div">) {
const { cartId } = useAppSelector((state) => state.cartReducer) 
const navigate = useNavigate()
const [serverError, setServerError] = useState<string | null>(null)
const [paymentType, setPaymentType] = useState<"online" | "cash" | null>(null);
 const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema ),
    defaultValues: {
    details: "",
    phone: "",
    city: "",
    postalCode: "",
  },
  })

   let {state} = useLocation()
 useEffect(() => {
  setPaymentType(state.type)
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
 }, [])


  const onSubmit = async (data: CheckoutFormValues) => {
    setServerError(null) 
    console.log("Form submitted:", data)
    if (!cartId) {
    setServerError("Cart not found");
    return;
  }

    try {

        if (paymentType === "online") {
            await OnlinePaymentApi(data , cartId)
       
        }else if(paymentType === "cash"){
            await cashPaymentApi(data , cartId)
            navigate("/", {
            state: {
                success: "Order placed successfully!",
            },
            });
        }

        
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.message || "Registration failed. Please try again."
        )
      } else {
        setServerError("Something went wrong. Please try again.")
      }
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>

          <CardTitle>{paymentType === "online"
            ? "Complete Your Online Payment"
            : "Complete Your Cash Order"}
            </CardTitle>

          <CardDescription>Enter your shipping address to complete your order.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup>

            <Field>
                <FieldLabel htmlFor="details">Details</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  required
                  {...register("details")}
                  aria-invalid={!!errors.details}
                />
                {errors.details && (
                  <FieldError>{errors.details.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input
                  id="phone"
                  type="tel"
                  required
                  {...register("phone")}
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && (
                  <FieldError>{errors.phone.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="city">City</FieldLabel>
                <Input
                  id="city"
                  type="text"
                  required
                  {...register("city")}
                  aria-invalid={!!errors.city}
                />
                {errors.city && (
                  <FieldError>{errors.city.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="postalCode">Postal Code</FieldLabel>
                <Input
                  id="postalCode"
                  type="text"
                  required
                  {...register("postalCode")}
                  aria-invalid={!!errors.postalCode}
                />
                {errors.postalCode && (
                  <FieldError>{errors.postalCode.message}</FieldError>
                )}
              </Field>


              {serverError && (
                <p className="text-sm text-destructive text-center">
                  {serverError}
                </p>
              )}

              
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                   {paymentType === "online" ? "Pay Now" : "Place Order"}
                </Button>

              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}