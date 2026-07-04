import { prisma } from "@/lib/db";
import Link from "next/link";
import { Package, Bell, Users, Tag } from "lucide-react";

export default async function AdminDashboard() {
  const [products, preorders, leads, coupons] = await Promise.all([
    prisma.product.count(),
    prisma.preorder.count(),
    prisma.lead.count(),
    prisma.coupon.count({ where: { active: true } }),
  ]);

  const recentLeads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const recentPreorders = await prisma.preorder.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { product: { select: { name: true } } },
  });

  const stats = [
    { label: "Prodotti", value: products, icon: Package, href: "/admin/products", color: "text-blue-400" },
    { label: "Pre-ordini", value: preorders, icon: Bell, href: "/admin/preorders", color: "text-gold" },
    { label: "Contatti", value: leads, icon: Users, href: "/admin/leads", color: "text-green-400" },
    { label: "Coupon attivi", value: coupons, icon: Tag, href: "/admin/coupons", color: "text-purple-400" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900 mb-1">Dashboard</h1>
        <p className="text-sm text-stone-500">Benvenuto nel pannello di Lorenzo Falchi</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white p-6 hover:shadow-sm transition-shadow group"
          >
            <div className={`${s.color} mb-3`}>
              <s.icon size={22} />
            </div>
            <p className="text-3xl font-semibold text-stone-900 mb-1">{s.value}</p>
            <p className="text-xs tracking-widest uppercase text-stone-400">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent leads */}
        <div className="bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-stone-900">Ultimi Contatti</h2>
            <Link href="/admin/leads" className="text-xs text-gold hover:underline">
              Vedi tutti
            </Link>
          </div>
          <div className="space-y-4">
            {recentLeads.length === 0 ? (
              <p className="text-sm text-stone-400">Nessun contatto ancora.</p>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-start justify-between py-3 border-b border-stone-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-stone-900">{lead.firstName} {lead.lastName}</p>
                    <p className="text-xs text-stone-400">{lead.email}</p>
                  </div>
                  <p className="text-xs text-stone-400">
                    {new Date(lead.createdAt).toLocaleDateString("it-IT")}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent preorders */}
        <div className="bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-stone-900">Ultimi Pre-ordini</h2>
            <Link href="/admin/preorders" className="text-xs text-gold hover:underline">
              Vedi tutti
            </Link>
          </div>
          <div className="space-y-4">
            {recentPreorders.length === 0 ? (
              <p className="text-sm text-stone-400">Nessun pre-ordine ancora.</p>
            ) : (
              recentPreorders.map((po) => (
                <div key={po.id} className="flex items-start justify-between py-3 border-b border-stone-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-stone-900">{po.firstName} {po.lastName}</p>
                    <p className="text-xs text-stone-400">{po.product.name}</p>
                  </div>
                  <p className="text-xs text-stone-400">
                    {new Date(po.createdAt).toLocaleDateString("it-IT")}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-4 flex-wrap">
        <Link href="/admin/products/new" className="btn-primary">
          + Nuovo prodotto
        </Link>
        <Link href="/" target="_blank" className="btn-outline">
          Vedi sito →
        </Link>
      </div>
    </div>
  );
}
