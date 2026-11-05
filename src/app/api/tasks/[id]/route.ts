import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  category: z.enum(['work', 'personal', 'shopping']).optional(),
  priority: z.enum(['low', 'normal', 'urgent']).optional(),
  done: z.boolean().optional(),
})

// PATCH /api/tasks/:id → ویرایش کار (مثلاً تیک زدن انجام‌شده)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const parsed = updateTaskSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'داده نامعتبر است' }, { status: 400 })
    }

    const existing = await db.task.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'کار پیدا نشد' }, { status: 404 })
    }

    const task = await db.task.update({ where: { id }, data: parsed.data })
    return NextResponse.json(task)
  } catch (error) {
    console.error('PATCH /api/tasks/[id] error:', error)
    return NextResponse.json({ error: 'خطا در ویرایش کار' }, { status: 500 })
  }
}

// DELETE /api/tasks/:id → حذف کار
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await db.task.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'کار پیدا نشد' }, { status: 404 })
    }

    await db.task.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/tasks/[id] error:', error)
    return NextResponse.json({ error: 'خطا در حذف کار' }, { status: 500 })
  }
}
