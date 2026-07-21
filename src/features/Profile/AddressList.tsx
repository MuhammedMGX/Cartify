import { useState, useEffect } from "react"
import { Trash2, MapPin } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { AddressForm, type AddressFormValues } from "./AddressForm"
import { AddAddressApi, GetAddressApi, RemoveAddressApi } from "./profileApi"

interface Address extends AddressFormValues {
  _id: string
}

export function AddressList() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null) 

  const fetchAddresses = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await GetAddressApi()
      setAddresses(result.data) 
    } catch {
      setError("Failed to load addresses.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [])

  const handleAddAddress = async (data: AddressFormValues) => {
    await AddAddressApi(data)
    await fetchAddresses() 
  }

  const handleRemove = async (id: string) => {
    setRemovingId(id)
    try {
      await RemoveAddressApi(id)
      setAddresses((prev) => prev.filter((address) => address._id !== id))
    } catch {
      setError("Failed to remove address.")
    } finally {
      setRemovingId(null)
    }
  }

  return (

    
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Addresses</h2>
          <p className="text-sm text-muted-foreground">
            Manage the addresses you deliver to.
          </p>
        </div>
        <AddressForm
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleAddAddress}
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading addresses...</p>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : addresses.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-12 text-center">
          <MapPin className="size-8 text-muted-foreground" />
          <p className="text-sm font-medium">No addresses yet</p>
          <p className="text-sm text-muted-foreground">
            Add an address to speed up checkout.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {addresses.map((address) => (
                <TableRow key={address._id}>
                  <TableCell className="font-medium">{address.name}</TableCell>
                  <TableCell className="text-muted-foreground">{address.details}</TableCell>
                  <TableCell className="text-muted-foreground">{address.city}</TableCell>
                  <TableCell className="text-muted-foreground">{address.phone}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleRemove(address._id)}
                      disabled={removingId === address._id}
                      aria-label="Remove address"
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
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