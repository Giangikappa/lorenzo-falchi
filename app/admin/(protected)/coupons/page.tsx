import { prisma } from "@/lib/db";
import CouponManager from "@/components/admin/CouponManager";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Coupon</h1>
        <p className="text-sm text-stone-500 mt-1">
          Gestisci i codici sconto
        </p>
      </div>

      <CouponManager initialCoupons={coupons} />
    </div>
  );
}
