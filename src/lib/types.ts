// تایپ‌های مشترک بین فرانت و بک‌اند

export type Category = 'work' | 'personal' | 'shopping'
export type Priority = 'low' | 'normal' | 'urgent'

export interface Task {
  id: string
  title: string
  category: string
  priority: string
  done: boolean
  createdAt: string
  updatedAt: string
}

// برچسب‌های فارسی
export const CATEGORY_LABELS: Record<Category, string> = {
  work: 'کاری',
  personal: 'شخصی',
  shopping: 'خرید',
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'کم',
  normal: 'معمولی',
  urgent: 'فوری',
}

// رنگ اولویت‌ها
export const PRIORITY_STYLES: Record<Priority, string> = {
  low: 'bg-stone-400',
  normal: 'bg-amber-500',
  urgent: 'bg-red-500',
}

export const CATEGORY_ICONS: Record<Category, string> = {
  work: '💼',
  personal: '🏡',
  shopping: '🛒',
}
