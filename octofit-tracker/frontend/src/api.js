import { useEffect, useState } from 'react'

export function normalizeCollection(payload) {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== 'object') return []

  for (const key of ['results', 'items', 'content', 'data']) {
    if (Array.isArray(payload[key])) return payload[key]
    if (payload[key] && typeof payload[key] === 'object') {
      return normalizeCollection(payload[key])
    }
  }

  return []
}

export function useCollection(endpoint) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadRecords() {
      setLoading(true)
      setError('')
      try {
        const response = await fetch(endpoint, { signal: controller.signal })
        if (!response.ok) throw new Error(`Request failed (${response.status})`)
        const payload = await response.json()
        setRecords(normalizeCollection(payload))
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Could not load data')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadRecords()
    return () => controller.abort()
  }, [endpoint, reloadCount])

  return {
    records,
    loading,
    error,
    reload: () => setReloadCount((count) => count + 1),
  }
}

export function displayReference(value) {
  if (value && typeof value === 'object') {
    return value.displayName || value.username || value.name || value._id || '--'
  }
  return value || '--'
}

export function formatDate(value) {
  if (!value) return '--'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? '--'
    : new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}