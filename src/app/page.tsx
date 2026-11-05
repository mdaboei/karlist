'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import {
  CheckCircle2,
  Download,
  ListTodo,
  Loader2,
  Moon,
  Pencil,
  Plus,
  RefreshCw,
  Sun,
  Trash2,
  WifiOff,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { useTasks } from '@/hooks/use-tasks'
import {
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  PRIORITY_STYLES,
  type Category,
  type Priority,
  type Task,
} from '@/lib/types'

type StatusFilter = 'all' | 'active' | 'done'

const CATEGORIES: Category[] = ['personal', 'work', 'shopping']
const PRIORITIES: Priority[] = ['low', 'normal', 'urgent']

const STATUS_LABELS: Record<StatusFilter, string> = {
  all: 'همه',
  active: 'انجام‌نشده',
  done: 'انجام‌شده',
}

export default function Home() {
  const { tasks, loading, error, addTask, updateTask, deleteTask, refresh } = useTasks()

  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState<Category>('personal')
  const [newPriority, setNewPriority] = useState<Priority>('normal')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all')
  const [submitting, setSubmitting] = useState(false)

  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)

  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [todayLabel, setTodayLabel] = useState('')

  useEffect(() => {
    setMounted(true)
    setTodayLabel(
      new Intl.DateTimeFormat('fa-IR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }).format(new Date())
    )
  }, [])

  // آمار برای فوتر
  const stats = useMemo(() => {
    const total = tasks.length
    const done = tasks.filter((t) => t.done).length
    return { total, done, remaining: total - done, percent: total ? Math.round((done / total) * 100) : 0 }
  }, [tasks])

  const visibleTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (statusFilter === 'active' && t.done) return false
      if (statusFilter === 'done' && !t.done) return false
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false
      return true
    })
  }, [tasks, statusFilter, categoryFilter])

  async function handleAdd() {
    const title = newTitle.trim()
    if (!title) {
      toast.error('اول بنویس قراره چیکار کنی 🙂')
      return
    }
    setSubmitting(true)
    try {
      await addTask(title, newCategory, newPriority)
      setNewTitle('')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'خطا در ارتباط با سرور')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleToggle(task: Task) {
    try {
      await updateTask(task.id, { done: !task.done })
    } catch {
      toast.error('تغییر وضعیت ناموفق بود')
    }
  }

  function openEdit(task: Task) {
    setEditingTask(task)
    setEditTitle(task.title)
  }

  async function handleSaveEdit() {
    if (!editingTask) return
    const title = editTitle.trim()
    if (!title) {
      toast.error('عنوان نمی‌تواند خالی باشد')
      return
    }
    try {
      await updateTask(editingTask.id, { title })
      setEditingTask(null)
      toast.success('ویرایش شد')
    } catch {
      toast.error('ویرایش ناموفق بود')
    }
  }

  async function handleConfirmDelete() {
    if (!deletingTask) return
    try {
      await deleteTask(deletingTask.id)
    } catch {
      toast.error('حذف ناموفق بود')
    } finally {
      setDeletingTask(null)
    }
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-teal-100/60 via-stone-100 to-stone-200 flex justify-center dark:from-teal-950/30 dark:via-stone-950 dark:to-stone-900">
      {/* قاب اپ — روی موبایل تمام‌صفحه است، روی دسکتاپ شبیه گوشی */}
      <div className="flex h-dvh w-full max-w-md flex-col bg-background md:my-[3dvh] md:h-[94dvh] md:rounded-[2rem] md:border md:shadow-2xl overflow-hidden">
        {/* ─── هدر ─── */}
        <header className="flex items-center gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3 border-b bg-card/50">
          <Image
            src="/icon-192.png"
            alt="آیکون کارلیست"
            width={44}
            height={44}
            priority
            className="rounded-xl"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold leading-tight">کارلیست</h1>
            <p className="text-xs text-muted-foreground">
              {mounted ? todayLabel : '\u00A0'}
            </p>
          </div>
          <a
            href="/karlist-source.zip"
            download
            className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent"
            aria-label="دانلود سورس پروژه (ZIP)"
            title="دانلود سورس پروژه (ZIP)"
          >
            <Download className="size-5" />
          </a>
          <Button
            variant="ghost"
            size="icon"
            className="size-10 rounded-full"
            aria-label="تغییر تم روشن و تاریک"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {mounted && theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
        </header>

        {/* ─── فرم افزودن ─── */}
        <section className="px-4 py-3 border-b bg-card/30" aria-label="افزودن کار جدید">
          <div className="flex gap-2">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && handleAdd()}
              placeholder="قراره چیکار کنی؟"
              className="h-12 rounded-xl text-base"
              aria-label="عنوان کار جدید"
              maxLength={200}
            />
            <Button
              onClick={handleAdd}
              disabled={submitting}
              className="h-12 w-12 shrink-0 rounded-xl"
              aria-label="افزودن کار"
            >
              {submitting ? <Loader2 className="size-5 animate-spin" /> : <Plus className="size-5" />}
            </Button>
          </div>

          {/* انتخاب دسته‌بندی و اولویت */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setNewCategory(c)}
                aria-pressed={newCategory === c}
                className={`min-h-9 rounded-full px-3 text-xs font-medium transition-all ${
                  newCategory === c
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/70'
                }`}
              >
                {CATEGORY_ICONS[c]} {CATEGORY_LABELS[c]}
              </button>
            ))}
            <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
            {PRIORITIES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setNewPriority(p)}
                aria-pressed={newPriority === p}
                className={`flex min-h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-all ${
                  newPriority === p
                    ? 'bg-secondary text-secondary-foreground shadow-sm'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                }`}
              >
                <span className={`size-2 rounded-full ${PRIORITY_STYLES[p]}`} aria-hidden="true" />
                {PRIORITY_LABELS[p]}
              </button>
            ))}
          </div>
        </section>

        {/* ─── فیلترها ─── */}
        <nav
          className="flex items-center justify-between gap-2 px-4 py-2.5 border-b"
          aria-label="فیلتر کارها"
        >
          <div className="flex rounded-xl bg-muted p-1" role="group">
            {(Object.keys(STATUS_LABELS) as StatusFilter[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                aria-pressed={statusFilter === s}
                className={`min-h-8 rounded-lg px-3 text-xs font-medium transition-all ${
                  statusFilter === s
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            {(['all', 'work', 'personal', 'shopping'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategoryFilter(c)}
                aria-pressed={categoryFilter === c}
                aria-label={c === 'all' ? 'همه دسته‌ها' : `دسته ${CATEGORY_LABELS[c]}`}
                className={`min-h-8 min-w-8 rounded-lg px-2 text-xs font-medium transition-all ${
                  categoryFilter === c
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {c === 'all' ? '≫' : CATEGORY_ICONS[c]}
              </button>
            ))}
          </div>
        </nav>

        {/* ─── لیست کارها ─── */}
        <main className="app-scroll flex-1 overflow-y-auto px-4 py-3" aria-label="لیست کارها">
          {loading ? (
            <div className="space-y-2.5" role="status" aria-label="در حال بارگذاری">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl border p-3.5">
                  <Skeleton className="size-6 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <WifiOff className="size-10 text-muted-foreground" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button variant="outline" size="sm" onClick={refresh} className="min-h-10">
                <RefreshCw className="size-4" />
                تلاش دوباره
              </Button>
            </div>
          ) : visibleTasks.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <Image
                src="/empty-illustration.png"
                alt="لیست خالی"
                width={150}
                height={150}
                className="opacity-90"
              />
              <p className="text-sm font-medium">
                {tasks.length === 0 ? 'هنوز کاری نداری!' : 'چیزی با این فیلتر پیدا نشد'}
              </p>
              <p className="text-xs text-muted-foreground">
                {tasks.length === 0
                  ? 'اولین کارت رو از فرم بالا اضافه کن ✨'
                  : 'فیلتر دیگه‌ای رو امتحان کن'}
              </p>
            </div>
          ) : (
            <ul className="space-y-2.5">
              <AnimatePresence initial={false}>
                {visibleTasks.map((task) => (
                  <motion.li
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.18 }}
                  >
                    <div
                      className={`group flex items-center gap-3 rounded-2xl border bg-card p-3.5 shadow-sm transition-colors ${
                        task.done ? 'opacity-70' : ''
                      }`}
                    >
                      <Checkbox
                        checked={task.done}
                        onCheckedChange={() => handleToggle(task)}
                        aria-label={task.done ? `علامت‌زدن ${task.title} به‌عنوان انجام‌نشده` : `انجام ${task.title}`}
                        className="size-6 shrink-0 rounded-full data-[state=checked]:rounded-full data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate text-sm font-medium ${
                            task.done ? 'task-done-title text-muted-foreground' : ''
                          }`}
                        >
                          {task.title}
                        </p>
                        <div className="mt-1 flex items-center gap-2.5 text-[11px] text-muted-foreground">
                          <span>
                            {CATEGORY_ICONS[task.category as Category] ?? '📋'}{' '}
                            {CATEGORY_LABELS[task.category as Category] ?? task.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <span
                              className={`size-1.5 rounded-full ${
                                PRIORITY_STYLES[task.priority as Priority] ?? 'bg-stone-400'
                              }`}
                              aria-hidden="true"
                            />
                            {PRIORITY_LABELS[task.priority as Priority] ?? task.priority}
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-9 rounded-full"
                          aria-label={`ویرایش ${task.title}`}
                          onClick={() => openEdit(task)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-9 rounded-full text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          aria-label={`حذف ${task.title}`}
                          onClick={() => setDeletingTask(task)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </main>

        {/* ─── فوتر چسبان ─── */}
        <footer className="border-t bg-card/50 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
              {stats.done.toLocaleString('fa-IR')} از {stats.total.toLocaleString('fa-IR')} انجام شد
            </span>
            <span className="flex items-center gap-1.5">
              <ListTodo className="size-4" aria-hidden="true" />
              {stats.remaining.toLocaleString('fa-IR')} کار باقی مونده
            </span>
          </div>
          <Progress value={stats.percent} className="mt-2.5 h-2" aria-label="پیشرفت کارها" />
        </footer>
      </div>

      {/* ─── دیالوگ ویرایش ─── */}
      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent className="max-w-sm rounded-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>ویرایش کار</DialogTitle>
            <DialogDescription>عنوان جدید رو بنویس و ذخیره کن.</DialogDescription>
          </DialogHeader>
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
            className="h-11 rounded-xl"
            aria-label="عنوان جدید"
            autoFocus
            maxLength={200}
          />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditingTask(null)} className="min-h-10 flex-1">
              انصراف
            </Button>
            <Button onClick={handleSaveEdit} className="min-h-10 flex-1">
              ذخیره
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── تایید حذف ─── */}
      <AlertDialog open={!!deletingTask} onOpenChange={(open) => !open && setDeletingTask(null)}>
        <AlertDialogContent className="max-w-sm rounded-2xl" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>حذف کار؟</AlertDialogTitle>
            <AlertDialogDescription>
              «{deletingTask?.title}» برای همیشه حذف می‌شه و برگشتی نداره.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="min-h-10 flex-1">انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="min-h-10 flex-1 bg-red-500 text-white hover:bg-red-600"
            >
              حذف کن
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
