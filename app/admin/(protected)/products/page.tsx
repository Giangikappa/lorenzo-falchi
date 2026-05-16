import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice, parseImages } from "@/lib/utils";
import { Pencil, Plus, Eye } from "lucide-react";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import Image from "next/image";

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  SOLD_OUT: "bg-red-100 text-red-700",
  PRE_ORDER: "bg-yellow-100 text-yellow-700",
  DRAFT: "bg-stone-100 text-stone-500",
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Disponibile",
  SOLD_OUT: "Sold out",
  PRE_ORDER: "Pre-ordine",
  DRAFT: "Bozza",
};

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true, variants: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Prodotti</h1>
          <p className="text-sm text-stone-500 mt-1">{products.length} prodotti totali</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary gap-2">
          <Plus size={16} />
          Nuovo prodotto
        </Link>
      </div>

      <div className="bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100">
              <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-400 font-normal w-12" />
              <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-400 font-normal">Prodotto</th>
              <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-400 font-normal hidden md:table-cell">Categoria</th>
              <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-400 font-normal">Prezzo</th>
              <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-400 font-normal hidden lg:table-cell">Stock tot.</th>
              <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-400 font-normal">Stato</th>
              <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-400 font-normal w-28">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-stone-400 text-sm">
                  Nessun prodotto. <Link href="/admin/products/new" className="text-gold hover:underline">Crea il primo</Link>
                </td>
              </tr>
            )}
            {products.map((product) => {
              const images = parseImages(product.images);
              const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);

              return (
                <tr key={product.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                  {/* Thumb */}
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 bg-stone-100 relative flex-shrink-0">
                      {images[0] && (
                        <Image src={images[0]} alt="" fill className="object-cover" />
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <p className="font-medium text-stone-900">{product.name}</p>
                    {product.isLimited && (
                      <span className="text-[10px] tracking-widest uppercase text-gold">Ed. Limitata</span>
                    )}
                  </td>

                  <td className="px-4 py-3 hidden md:table-cell text-stone-500">
                    {product.category.name}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      {product.salePrice ? (
                        <>
                          <span className="text-gold font-medium">{formatPrice(product.salePrice)}</span>
                          <span className="text-xs text-stone-400 line-through">{formatPrice(product.price)}</span>
                        </>
                      ) : (
                        <span>{formatPrice(product.price)}</span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 hidden lg:table-cell text-stone-600">
                    {totalStock === 0 ? (
                      <span className="text-red-500 text-xs">Esaurito</span>
                    ) : (
                      <span>{totalStock} pz</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <span className={`text-[10px] tracking-widest uppercase px-2 py-1 ${STATUS_COLORS[product.status]}`}>
                      {STATUS_LABELS[product.status]}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/products/${product.slug}`} target="_blank" className="text-stone-400 hover:text-stone-900 transition-colors">
                        <Eye size={15} />
                      </Link>
                      <Link href={`/admin/products/${product.id}/edit`} className="text-stone-400 hover:text-stone-900 transition-colors">
                        <Pencil size={15} />
                      </Link>
                      <DeleteProductButton productId={product.id} productName={product.name} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
