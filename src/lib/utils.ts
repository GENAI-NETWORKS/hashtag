import { NextResponse } from 'next/server';

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function apiPaginated<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) {
  return NextResponse.json({
    success: true,
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateTax(subtotal: number, rate = 0.18): number {
  return Math.round(subtotal * rate);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `HT-${timestamp}-${random}`;
}

export function getPaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function getDeliveryEstimate(pincode: string): { days: number; label: string } {
  // Salem pincodes: 636001-636016
  const salemPincodes = ['636001', '636002', '636003', '636004', '636005', '636006',
    '636007', '636008', '636009', '636010', '636011', '636012', '636013', '636014',
    '636015', '636016'];

  if (salemPincodes.includes(pincode)) {
    return { days: 1, label: 'Tomorrow' };
  }
  // Tamil Nadu pincodes: 6xxxxx
  if (pincode.startsWith('6')) {
    return { days: 3, label: '3 days' };
  }
  return { days: 5, label: '5-7 days' };
}
