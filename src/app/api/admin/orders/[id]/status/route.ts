import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH /api/admin/orders/[id]/status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = getAuthFromRequest(req);
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, note } = body;

    const validStatuses = ['PENDING', 'DESIGN_CONFIRMED', 'PRINTING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: parseInt(id) } });
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: { status },
      });

      await tx.orderStatusHistory.create({
        data: { orderId: order.id, status, note: note || null },
      });

      return updatedOrder;
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[ADMIN ORDER STATUS]', error);
    return NextResponse.json({ success: false, error: 'Failed to update status' }, { status: 500 });
  }
}
