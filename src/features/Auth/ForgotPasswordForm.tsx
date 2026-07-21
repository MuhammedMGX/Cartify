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
import { useState } from "react"
import { forgotPasswordApi } from "./authApi"
import axios from "axios"
import { useNavigate } from "react-router-dom"



const ForgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
})
type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>

export function ForgetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
const navigate = useNavigate()

const [serverError, setServerError] = useState<string | null>(null)
 const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

const onSubmit = async (data: ForgotPasswordFormValues) => {
  setServerError(null)

  try {
    const result = await forgotPasswordApi(data)
    console.log(result)
    navigate("/verifyResetCode", { state: { email: data.email } })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      setServerError(
        error.response?.data?.message || "Invalid email address. Please try again."
      )
    } else {
      setServerError("Something went wrong. Please try again.")
    }
  }
}

  return (
    <div className={cn("flex w-full max-w-sm flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email below to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register("email")}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <FieldError>{errors.email.message}</FieldError>
                )}
              </Field>
              

              {serverError && (
                <p className="text-sm text-destructive text-center">
                  {serverError}
                </p>
              )}


              <Field>
                <Button type="submit" disabled={isSubmitting}> {isSubmitting ? "Sending reset link..." : "Send Reset Link"} </Button>
              
                
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
