import { useEffect } from "react"
import { useMatches } from "react-router-dom"

export function RouteTitle() {
  const matches = useMatches()

  useEffect(() => {
    const current = [...matches].reverse().find(
      (match) => (match.handle as { title?: string } | undefined)?.title
    )
    const title = (current?.handle as { title?: string } | undefined)?.title

    document.title = title ? `${title} | Cartify` : "Cartify"
  }, [matches])

  return null
}