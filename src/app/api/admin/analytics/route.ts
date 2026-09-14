import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/analytics
export async function GET(req: NextRequest) {
  try {
    const payload = getAuthFromRequest(req);
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);
    const startOf30Days = new Date(now);
    startOf30Days.setDate(now.getDate() - 30);

    const [
      ordersToday,
      revenueTodayData,
      ordersThisWeek,
      revenueWeekData,
      totalOrders,
      totalRevenueData,
      ordersByStatusData,
      topProductsData,
      revenueByDay,
    ] = await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: startOfToday }, status: { not: 'CANCELLED' } } }),
      prisma.order.aggregate({ where: { createdAt: { gte: startOfToday }, status: { not: 'CANCELLED' } }, _sum: { total: true } }),
      prisma.order.count({ where: { createdAt: { gte: startOfWeek }, status: { not: 'CANCELLED' } } }),
      prisma.order.aggregate({ where: { createdAt: { gte: startOfWeek }, status: { not: 'CANCELLED' } }, _sum: { total: true } }),
      prisma.order.count({ where: { status: { not: 'CANCELLED' } } }),
      prisma.order.aggregate({ where: { status: { not: 'CANCELLED' } }, _sum: { total: true } }),
      prisma.order.groupBy({ by: ['status'], _count: { id: true } }),
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true, totalPrice: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
      // Revenue last 7 days
      prisma.$queryRaw<Array<{ date: string; revenue: number; orders: number }>>`
        SELECT 
          DATE(createdAt) as date,
          SUM(total) as revenue,
          COUNT(id) as orders
        FROM \`Order\`
        WHERE createdAt >= ${startOfWeek} AND status != 'CANCELLED'
        GROUP BY DATE(createdAt)
        ORDER BY date ASC
      `,
    ]);

    // Get top product details
    const topProductIds = topProductsData.map((p) => p.productId);
    const topProductDetails = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true, images: true, basePrice: true },
    });

    const topProducts = topProductsData.map((p) => ({
      product: topProductDetails.find((pd) => pd.id === p.productId),
      orderCount: p._sum.quantity || 0,
      revenue: Number(p._sum.totalPrice || 0),
    }));

    const ordersByStatus = Object.fromEntries(
      ordersByStatusData.map((s) => [s.status, s._count.id])
    );

    return NextResponse.json({
      success: true,
      data: {
        ordersToday,
        revenueToday: Number(revenueTodayData._sum.total || 0),
        ordersThisWeek,
        revenueThisWeek: Number(revenueWeekData._sum.total || 0),
        totalOrders,
        totalRevenue: Number(totalRevenueData._sum.total || 0),
        ordersByStatus,
        topProducts,
        revenueByDay: revenueByDay.map((r) => ({
          date: r.date,
          revenue: Number(r.revenue),
          orders: Number(r.orders),
        })),
      },
    });
  } catch (error) {
    console.error('[ADMIN ANALYTICS]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
