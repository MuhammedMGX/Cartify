
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { KeyRound, Eye, EyeOff } from "lucide-react"
import { UpdateUserPasswordApi } from "./profileApi"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {FieldError} from "@/components/ui/field"
import { DangerZone, NotificationSettings, PrivacySettings } from "./components/placeholdersettings"
import { useAuth } from "../Auth/AuthContext"

const UpdatePasswordSchema = z.object({
  current: z.string().min(6, "Password must be at least 6 characters"),
  next: z.string().min(6, "Password must be at least 6 characters"),
  confirm: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.next === data.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
})
type UpdatePasswordFormValues = z.infer<typeof UpdatePasswordSchema>



export function Settings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      current: "",
      next: "",
      confirm: "",
    },
  })

  const onSubmit = async (data: UpdatePasswordFormValues) => {
    setServerError(null)

    try {
      const result = await UpdateUserPasswordApi({
        currentPassword: data.current,
        password: data.next,
        rePassword: data.confirm,
      })

      if (result?.token) {
        localStorage.setItem("token", result.token)
        window.location.reload()
      }

      console.log("Update password success:", result)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseMessage =
          (error.response?.data as { message?: string; error?: string } | undefined)?.message ||
          (error.response?.data as { message?: string; error?: string } | undefined)?.error ||
          "Something went wrong. Please try again."

        setServerError(responseMessage)
      } else {
        setServerError("Something went wrong. Please try again.")
      }
    }
  }

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <KeyRound className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <CardTitle>Change password</CardTitle>
            <CardDescription>Update the password for your account.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            autoComplete="username"
            value={user?.email ?? ""}
            readOnly
            hidden
          />

          {serverError && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {serverError}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="current">Current password</Label>
            <div className="relative">
              <Input
                id="current"
                type={showCurrentPassword ? "text" : "password"}
                {...register("current")}
                aria-invalid={!!errors.current}
                autoComplete="current-password"
                className="pr-10"
                required
              />
              {errors.current && <FieldError>{errors.current.message}</FieldError>}
              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
                aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="next">New password</Label>
            <div className="relative">
              <Input
                id="next"
                type={showNewPassword ? "text" : "password"}
                {...register("next")}
                aria-invalid={!!errors.next}
                autoComplete="new-password"
                className="pr-10"
                required
              />
              {errors.next && <FieldError>{errors.next.message}</FieldError>}
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
                aria-label={showNewPassword ? "Hide new password" : "Show new password"}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirm">Confirm new password</Label>
            <div className="relative">
              <Input
                id="confirm"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirm")}
                aria-invalid={!!errors.confirm}
                autoComplete="new-password"
                className="pr-10"
                required
              />
              {errors.confirm && <FieldError>{errors.confirm.message}</FieldError>}
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
                aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update password"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>

        <NotificationSettings />
      <PrivacySettings />
      <DangerZone />

</>
  )
}
