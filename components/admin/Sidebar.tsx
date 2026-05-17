"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Bell,
  Users,
  Tag,
  Mail,
  ShoppingBag,
  LogOut,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/categories", label: "Categorie", icon: FolderOpen },
  { href: "/admin/products", label: "Prodotti", icon: Package },
  { href: "/admin/orders", label: "Ordini", icon: ShoppingBag },
  { href: "/admin/preorders", label: "Pre-ordini", icon: Bell },
  { href: "/admin/leads", label: "Contatti", icon: Users },
  { href: "/admin/coupons", label: "Coupon", icon: Tag },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.href = "/admin/login";
  };

  return (
    <aside className="w-60 bg-stone-900 min-h-screen flex flex-col py-8 px-4 flex-shrink-0">
      <div className="px-2 mb-10">
        <p className="font-serif text-lg text-white tracking-widest">
          LORENZO <span className="text-gold">FALCHI</span>
        </p>
        <p className="text-[10px] text-stone-500 tracking-widest uppercase mt-1">
          Admin
        </p>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {links.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 text-sm rounded transition-colors",
              isActive(href, exact)
                ? "bg-stone-800 text-white"
                : "text-stone-400 hover:text-white hover:bg-stone-800/50"
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 text-sm text-stone-500 hover:text-red-400 transition-colors mt-4"
      >
        <LogOut size={16} />
        Esci
      </button>
    </aside>
  );
}
