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
import { verifyCodeApi } from "./authApi"
import axios from "axios"
import { useNavigate, useLocation } from "react-router-dom" // CHANGED: added useLocation



const VerifyResetCodeSchema = z.object({
  code: z.string().length(6, "Code must be 6 digits").regex(/^\d+$/, "Code must contain only numbers"),
})
type VerifyResetCodeFormValues = z.infer<typeof VerifyResetCodeSchema>

export function VerifyResetCodeForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
const navigate = useNavigate()
const location = useLocation() 
const emailFromState = (location.state as { email?: string } | null)?.email ?? "" 

const [serverError, setServerError] = useState<string | null>(null)
 const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyResetCodeFormValues>({
    resolver: zodResolver(VerifyResetCodeSchema),
    defaultValues: {
      code: "",
    },
  })

const onSubmit = async (data: VerifyResetCodeFormValues) => {
  setServerError(null)

  try {

    const result = await verifyCodeApi(data)
    console.log(result)
    navigate("/resetPassword", { state: { email: emailFromState } })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      setServerError(
        error.response?.data?.message || "Invalid verification code. Please try again."
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
          <CardTitle>Verify Code</CardTitle>
          <CardDescription>
            Enter the verification code you received
            {emailFromState && ` at ${emailFromState}`} 
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="code">Verification Code</FieldLabel>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  maxLength={6} 
                  required
                  {...register("code")}
                  aria-invalid={!!errors.code}
                />
                {errors.code && (
                  <FieldError>{errors.code.message}</FieldError>
                )}
              </Field>

              {serverError && (
                <p className="text-sm text-destructive text-center">
                  {serverError}
                </p>
              )}

              <Field>
                <Button type="submit" disabled={isSubmitting}> {isSubmitting ? "Verifying..." : "Verify Code"} </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}