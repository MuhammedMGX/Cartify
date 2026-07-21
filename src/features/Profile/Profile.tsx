
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { User, Mail, Phone, Pencil } from "lucide-react"
import { useAuth } from "../Auth/AuthContext"
import { UpdateUserDataApi } from "./profileApi"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().regex(/^01[0125][0-9]{8}$/, "Invalid Egyptian phone number"),
})

export type ProfileFormValues = z.infer<typeof profileSchema>

interface ProfileProps {
  onSubmit?: (data: ProfileFormValues) => Promise<void> | void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Profile({ onSubmit, open: controlledOpen, onOpenChange }: ProfileProps = {}) {
  const { user, login } = useAuth()
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const [error, setError] = useState("")
  const open = controlledOpen ?? uncontrolledOpen

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
    },
  })

  useEffect(() => {
    reset({
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
    })
  }, [user, reset])

  const handleDialogOpenChange = (next: boolean) => {
    if (onOpenChange) onOpenChange(next)
    if (controlledOpen === undefined) setUncontrolledOpen(next)
  }


  
  const handleFormSubmit = async (data: ProfileFormValues) => {
    try {
      const response = await UpdateUserDataApi({
        name: data.name,
        email: data.email,
        phone: data.phone,
      })

      const nextToken = response?.token ?? localStorage.getItem("token") ?? ""
      const nextUser = {
        ...(user ?? {}),
        name: data.name,
        email: data.email,
        phone: data.phone,
      } as typeof user

      login(nextToken, nextUser as NonNullable<typeof user>)

      await onSubmit?.(data)
      reset({
        name: data.name,
        email: data.email,
        phone: data.phone,
      })
      handleDialogOpenChange(false)
      window.location.reload()
    } catch (error: any) {
        const message =
          error.response?.data?.errors?.msg ||
          error.response?.data?.message ||
          "Something went wrong"

        setError(message)
      }
  }

  const fields = [
    { icon: User, label: "Full name", value: user?.name ?? "—" },
    { icon: Mail, label: "Email", value: user?.email ?? "—" },
    { icon: Phone, label: "Phone", value: user?.phone ?? "—" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Your contact details used for orders and updates.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-muted text-muted-foreground">
              <User className="h-7 w-7" aria-hidden="true" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">{user?.name}</span>
            <span className="text-sm text-muted-foreground">{user?.email}</span>
          </div>
        </div>

        <Separator />

        <dl className="flex flex-col gap-4">
          {fields.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="flex flex-col">
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="text-sm font-medium">{value}</dd>
              </div>
            </div>
          ))}
        </dl>

        <Dialog open={open} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger render={<Button className="w-1/4 ml-auto" />}>
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit information
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit personal information</DialogTitle>
              <DialogDescription>Make changes to your details, then save.</DialogDescription>
              <p className="text-sm text-destructive">{error}</p>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="First name" {...register("name")} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" {...register("phone")} placeholder="+20 1012345678" />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
              </div>
              <DialogFooter>
                <DialogClose render={<Button type="button" variant="outline" />}>
                  Cancel
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>



  )
}

export default Profile
    
    
  