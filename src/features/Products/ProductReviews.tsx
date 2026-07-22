import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Star, Pencil, Trash2, MessageSquarePlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "../Auth/AuthContext"
import {
  createReviewForProduct,
  deleteReviewForProduct,
  getReviewForProduct,
  updateReviewForProduct,
} from "./productsApi"
import type { ProductReview } from "./product.types"

export type ReviewInput = { review: string; rating: number }

// ADDED: was commented out and unused — now actually formats the review date
function formatDate(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}

// ADDED: was commented out and unused — now drives the avatar circle
function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}


function isReviewOwnedBy(review: ProductReview, userId?: string) {
  return Boolean(userId) && review.user._id === userId
}

/* ------------------------------- Star rating ------------------------------ */

function StarRating({
  value,
  onChange,
  size = 18,
}: {
  value: number
  onChange?: (value: number) => void
  size?: number
}) {
  const [hover, setHover] = useState(0)
  const interactive = Boolean(onChange)
  const active = hover || value

  return (
    <div className="flex items-center gap-0.5" role={interactive ? "radiogroup" : undefined} aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= active
        const icon = (
          <Star
            style={{ width: size, height: size }}
            className={cn(filled ? "fill-primary text-primary" : "fill-transparent text-muted-foreground/40")}
            aria-hidden="true"
          />
        )

        if (!interactive) return <span key={star}>{icon}</span>

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === value}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            className="rounded p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange?.(star)}
          >
            {icon}
          </button>
        )
      })}
    </div>
  )
}

/* ----------------------------- Write / edit form -------------------------- */

function ReviewFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initial,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: ReviewInput) => Promise<void>
  initial: ProductReview | null
}) {
  const [rating, setRating] = useState(0)
  const [text, setText] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setRating(initial?.rating ?? 0)
    setText(initial?.review ?? "")
    setError(null)
  }, [open, initial])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating < 1) return setError("Please select a star rating.")
    if (text.trim().length < 3) return setError("Please write at least a few words.")

    setSaving(true)
    setError(null)
    try {
      await onSubmit({ rating, review: text.trim() })
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit your review" : "Write a review"}</DialogTitle>
          <DialogDescription>Share your experience to help other shoppers.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Your rating</Label>
            <StarRating value={rating} onChange={setRating} size={26} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="review-text">Your review</Label>
            <Textarea
              id="review-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What did you like or dislike?"
              rows={4}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : initial ? "Save changes" : "Post review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/* ----------------------------- Review card -------------------------------- */

// ADDED: extracted from the big render block below for readability —
// same markup as before, just given a name and its own props
function ReviewCard({
  review,
  isOwner,
  canEdit,
  onEdit,
  onDelete,
}: {
  review: ProductReview
  isOwner: boolean
  canEdit: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <Card className={isOwner ? "border-primary/40" : undefined}>
      <CardContent className="flex flex-col gap-3 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
              {getInitials(review.user.name)}
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {review.user.name}
                {isOwner && <span className="ml-2 text-xs text-primary">You</span>}
              </span>
              <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
            </div>
          </div>

          {isOwner && canEdit && (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit} aria-label="Edit your review">
                <Pencil className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={onDelete}
                aria-label="Delete your review"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          )}
        </div>

        <StarRating value={review.rating} size={16} />
        <p className="text-sm leading-relaxed text-muted-foreground">{review.review}</p>
      </CardContent>
    </Card>
  )
}

/* ----------------------------- Product reviews ---------------------------- */

export function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<ProductReview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<ProductReview | null>(null)
  const [pendingDelete, setPendingDelete] = useState<ProductReview | null>(null)
  const [deleting, setDeleting] = useState(false)

  const { token, user } = useAuth()

  const loadReviews = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const result = await getReviewForProduct(productId)
      setReviews(Array.isArray(result) ? result : [result])
    } catch {
      setLoadError("Couldn't load reviews. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [productId])

  useEffect(() => {
    loadReviews()
  }, [loadReviews])

  const myReview = reviews.find((review) => isReviewOwnedBy(review, user?._id)) ?? null
  const reviewCount = reviews.length
  const averageRating = reviewCount
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
    : 0

  function openAddDialog() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEditDialog(review: ProductReview) {
    setEditing(review)
    setFormOpen(true)
  }

  async function handleSubmit(input: ReviewInput) {
    if (!token) {
      setLoadError("Please log in to submit a review.")
      return
    }

    if (editing) {
      const updated = await updateReviewForProduct(productId, editing._id, input)
      setReviews((prev) => prev.map((review) => (review._id === updated._id ? updated : review)))
    } else {
      const created = await createReviewForProduct(productId, input)
      setReviews((prev) => [created, ...prev.filter((review) => review._id !== created._id)])
    }
  }

  async function confirmDelete() {
    if (!pendingDelete || !token) return
    setDeleting(true)
    try {
      await deleteReviewForProduct(productId, pendingDelete._id)
      setReviews((prev) => prev.filter((review) => review._id !== pendingDelete._id))
      setPendingDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <section aria-labelledby="reviews-heading" className="flex flex-col gap-6 mt-15">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 id="reviews-heading" className="text-xl font-semibold tracking-tight">
            Customer reviews
          </h2>
          {reviewCount > 0 ? (
            <div className="flex items-center gap-2">
              <StarRating value={Math.round(averageRating)} />
              <span className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)} out of 5 · {reviewCount} review{reviewCount > 1 ? "s" : ""}
              </span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No reviews yet.</p>
          )}
        </div>

        {token && !myReview && (
          <Button onClick={openAddDialog} className="gap-2">
            <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
            Write a review
          </Button>
        )}
      </div>

      {loadError && (
        <div className="flex items-center justify-between gap-4 rounded-md border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">{loadError}</p>
          <Button variant="outline" size="sm" onClick={loadReviews}>
            Retry
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col gap-4">
          {[0, 1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="flex flex-col gap-3 py-5">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && reviewCount === 0 && (
        <p className="text-sm text-muted-foreground">No review yet. Write one to share your experience.</p>
      )}

      {!isLoading && reviewCount > 0 && (
        <ul className="flex flex-col gap-5">
          {reviews.map((review) => (
            <li key={review._id} >
              <ReviewCard
                review={review}
                isOwner={isReviewOwnedBy(review, user?._id)}
                canEdit={Boolean(token)}
                onEdit={() => openEditDialog(review)}
                onDelete={() => setPendingDelete(review)}
              />
            </li>
          ))}
        </ul>
      )}

      <ReviewFormDialog open={formOpen} onOpenChange={setFormOpen} onSubmit={handleSubmit} initial={editing} />

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your review?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove your review. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                confirmDelete()
              }}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}