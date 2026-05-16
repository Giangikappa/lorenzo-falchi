import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { ShoppingBag } from "lucide-react";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const statusLabel: Record<string, string> = {
    PENDING_PAYMENT: "In attesa pagamento",
    PAID: "Pagato",
    CONFIRMED: "Confermato",
    SHIPPED: "Spedito",
    DELIVERED: "Consegnato",
    CANCELLED: "Annullato",
  };

  const statusColor: Record<string, string> = {
    PENDING_PAYMENT: "bg-stone-100 text-stone-500",
    PAID: "bg-yellow-50 text-yellow-700",
    CONFIRMED: "bg-blue-50 text-blue-700",
    SHIPPED: "bg-purple-50 text-purple-700",
    DELIVERED: "bg-green-50 text-green-700",
    CANCELLED: "bg-red-50 text-red-600",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Ordini</h1>
        <p className="text-sm text-stone-500 mt-1">{orders.length} ordini totali</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-stone-100 flex flex-col items-center justify-center py-20 text-stone-400">
          <ShoppingBag size={36} className="mb-3 opacity-20" />
          <p className="text-sm">Nessun ordine ancora</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-stone-100 p-6 space-y-4">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-medium text-stone-900">{order.name}</span>
                    <span
                      className={`text-[10px] tracking-widest uppercase px-2 py-0.5 ${
                        statusColor[order.status] ?? "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {statusLabel[order.status] ?? order.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400">
                    {order.email}
                    {order.phone && ` · ${order.phone}`}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">{order.address}</p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("it-IT", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="font-serif text-xl text-stone-900">
                    {formatPrice(order.total)}
                  </span>
                  <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                </div>
              </div>

              {/* Items */}
              <div className="border-t border-stone-100 pt-4">
                <table className="w-full text-sm">
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="border-b border-stone-50 last:border-0">
                        <td className="py-2 text-stone-700">{item.productName}</td>
                        <td className="py-2 text-stone-400 text-xs">Misura: {item.size}</td>
                        <td className="py-2 text-stone-400 text-xs text-right">×{item.qty}</td>
                        <td className="py-2 text-stone-700 text-right font-medium">
                          {formatPrice(item.price * item.qty)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {order.note && (
                <div className="bg-stone-50 px-4 py-3 text-sm text-stone-500 border border-stone-100">
                  <span className="text-xs tracking-widest uppercase text-stone-400 block mb-1">Note</span>
                  {order.note}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
