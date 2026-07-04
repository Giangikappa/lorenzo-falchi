import { prisma } from "@/lib/db";

export default async function AdminPreordersPage() {
  const preorders = await prisma.preorder.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: { select: { name: true, slug: true } } },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Pre-ordini</h1>
        <p className="text-sm text-stone-500 mt-1">
          {preorders.length} richieste di pre-ordine
        </p>
      </div>

      <div className="bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100">
              {["Nome", "Email", "Telefono", "Prodotto", "Note", "Data"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-400 font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preorders.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-stone-400 text-sm">
                  Nessun pre-ordine ancora.
                </td>
              </tr>
            )}
            {preorders.map((po) => (
              <tr key={po.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                <td className="px-4 py-3 font-medium text-stone-900">{po.firstName} {po.lastName}</td>
                <td className="px-4 py-3">
                  <a href={`mailto:${po.email}`} className="text-gold hover:underline">
                    {po.email}
                  </a>
                </td>
                <td className="px-4 py-3 text-stone-500">
                  {po.phone ? (
                    <a href={`tel:${po.phone}`} className="hover:text-stone-900">
                      {po.phone}
                    </a>
                  ) : (
                    <span className="text-stone-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`/products/${po.product.slug}`}
                    target="_blank"
                    className="text-gold hover:underline"
                  >
                    {po.product.name}
                  </a>
                </td>
                <td className="px-4 py-3 text-stone-500 max-w-xs">
                  <p className="truncate">{po.note ?? "—"}</p>
                </td>
                <td className="px-4 py-3 text-stone-400 text-xs">
                  {new Date(po.createdAt).toLocaleDateString("it-IT", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
