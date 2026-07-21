
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Bell, ShieldCheck, Trash2, type LucideIcon } from "lucide-react"

type ToggleItem = {
  id: string
  label: string
  description: string
  defaultChecked?: boolean
}

function ToggleGroup({ items }: { items: ToggleItem[] }) {
  const [state, setState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(items.map((i) => [i.id, Boolean(i.defaultChecked)])),
  )

  return (
    <div className="flex flex-col">
      {items.map((item, index) => (
        <div key={item.id}>
          {index > 0 && <Separator />}
          <div className="flex items-center justify-between gap-4 py-4">
            <div className="flex flex-col gap-0.5">
              <Label htmlFor={item.id} className="text-sm font-medium">
                {item.label}
              </Label>
              <span className="text-xs text-muted-foreground">{item.description}</span>
            </div>
            <Switch
              id={item.id}
              checked={state[item.id]}
              onCheckedChange={(checked) => setState((prev) => ({ ...prev, [item.id]: checked }))}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function NotificationSettings() {
  return (
    <SectionCard icon={Bell} title="Notifications" description="Choose what updates you want to receive.">
      <ToggleGroup
        items={[
          {
            id: "order-updates",
            label: "Order updates",
            description: "Shipping, delivery, and order status changes.",
            defaultChecked: true,
          },
          {
            id: "promotions",
            label: "Promotions & offers",
            description: "Deals, discounts, and seasonal sales.",
          },
          {
            id: "product-news",
            label: "Product news",
            description: "New arrivals and restock alerts.",
            defaultChecked: true,
          },
        ]}
      />
    </SectionCard>
  )
}

export function PrivacySettings() {
  return (
    <SectionCard icon={ShieldCheck} title="Privacy & security" description="Manage how your data is used.">
      <ToggleGroup
        items={[
          {
            id: "two-factor",
            label: "Two-factor authentication",
            description: "Add an extra layer of security at sign-in.",
          },
          {
            id: "personalized-ads",
            label: "Personalized recommendations",
            description: "Use your activity to tailor product suggestions.",
            defaultChecked: true,
          },
        ]}
      />
    </SectionCard>
  )
}

export function DangerZone() {
  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive">
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <CardTitle>Delete account</CardTitle>
            <CardDescription>Permanently remove your account and all associated data.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
        <Button variant="destructive" className="w-full sm:w-auto">
          Delete account
        </Button>
      </CardContent>
    </Card>
  )
}
