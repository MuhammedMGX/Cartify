import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff } from "lucide-react"
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
import { resetPasswordApi } from "./authApi"
import axios from "axios"
import { useNavigate ,useLocation } from "react-router-dom"



const resetPasswordSchema  = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})
type ResetPasswordValues = z.infer<typeof resetPasswordSchema >

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
const navigate = useNavigate()
const location = useLocation()
const emailFromState = (location.state as { email?: string } | null)?.email ?? ""
const [showPassword, setShowPassword] = useState(false)
const [serverError, setServerError] = useState<string | null>(null)
 const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema ),
    defaultValues: {
      email: emailFromState,
      password: "",
    },
  })

  const onSubmit = async (data: ResetPasswordValues) => {
    setServerError(null) 

    try {
      const result = await resetPasswordApi(data)
      console.log(result)
      navigate("/login")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.message || "Invalid email or password"
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
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Enter your new password below
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
                  readOnly={!!emailFromState}
                />
                {errors.email && (
                  <FieldError>{errors.email.message}</FieldError>
                )}
              </Field>

              
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">New Password</FieldLabel> 
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    aria-invalid={!!errors.password}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <FieldError>{errors.password.message}</FieldError>
                )}
              </Field>


              {serverError && (
                <p className="text-sm text-destructive text-center">
                  {serverError}
                </p>
              )}


              <Field>
                <Button type="submit" disabled={isSubmitting}> {isSubmitting ? "Resetting..." : "Reset Password"} </Button>

              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
