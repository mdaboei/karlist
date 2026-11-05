import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

// GET /api/tasks → لیست همه کارها
export async function GET() {
  try {
    const tasks = await db.task.findMany({
      orderBy: [{ done: 'asc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json(tasks)
  } catch (error) {
    console.error('GET /api/tasks error:', error)
    return NextResponse.json({ error: 'خطا در دریافت کارها' }, { status: 500 })
  }
}

const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'عنوان نمی‌تواند خالی باشد').max(200),
  category: z.enum(['work', 'personal', 'shopping']).default('personal'),
  priority: z.enum(['low', 'normal', 'urgent']).default('normal'),
})

// POST /api/tasks → ساخت کار جدید
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createTaskSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'داده نامعتبر است' },
        { status: 400 }
      )
    }

    const task = await db.task.create({ data: parsed.data })
    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('POST /api/tasks error:', error)
    return NextResponse.json({ error: 'خطا در ساخت کار' }, { status: 500 })
  }
}
