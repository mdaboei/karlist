'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { Category, Priority, Task } from '@/lib/types'

/**
 * این هوک تمام ارتباط اپ با سرور را مدیریت می‌کند.
 * الگوی کار ساده است: fetch به API ← دریافت JSON ← آپدیت state
 */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // خواندن لیست کارها از سرور
  const fetchTasks = useCallback(async () => {
    try {
      setError(null)
      const res = await fetch('/api/tasks')
      if (!res.ok) throw new Error('خطا در دریافت اطلاعات از سرور')
      const data = await res.json()
      setTasks(data)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'خطای ناشناخته'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  // ساخت کار جدید
  const addTask = useCallback(
    async (title: string, category: Category, priority: Priority) => {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, priority }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error ?? 'ساخت کار ناموفق بود')
      }
      const newTask: Task = await res.json()
      setTasks((prev) => [newTask, ...prev])
      toast.success('کار اضافه شد')
    },
    []
  )

  // تغییر وضعیت انجام‌شده / یا ویرایش
  const updateTask = useCallback(async (id: string, data: Partial<Task>) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('ویرایش ناموفق بود')
    const updated: Task = await res.json()
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
  }, [])

  // حذف کار
  const deleteTask = useCallback(async (id: string) => {
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('حذف ناموفق بود')
    setTasks((prev) => prev.filter((t) => t.id !== id))
    toast.success('کار حذف شد')
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return { tasks, loading, error, addTask, updateTask, deleteTask, refresh: fetchTasks }
}
