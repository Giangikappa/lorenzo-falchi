import { prisma } from "@/lib/db";
import { Mail, Users } from "lucide-react";

export default async function NewsletterPage() {
  const subscribers = await prisma.newsletter.findMany({
    orderBy: { createdAt: "desc" },
  });

  const active = subscribers.filter((s) => s.active);
  const inactive = subscribers.filter((s) => !s.active);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Newsletter</h1>
        <p className="text-sm text-stone-500 mt-1">Iscritti alla newsletter</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 border border-stone-100">
          <p className="text-xs text-stone-500 tracking-widest uppercase mb-1">Totale iscritti</p>
          <p className="text-3xl font-light text-stone-900">{subscribers.length}</p>
        </div>
        <div className="bg-white p-5 border border-stone-100">
          <p className="text-xs text-stone-500 tracking-widest uppercase mb-1">Attivi</p>
          <p className="text-3xl font-light text-gold">{active.length}</p>
        </div>
        <div className="bg-white p-5 border border-stone-100">
          <p className="text-xs text-stone-500 tracking-widest uppercase mb-1">Disiscritti</p>
          <p className="text-3xl font-light text-stone-400">{inactive.length}</p>
        </div>
      </div>

      {/* List */}
      <div className="bg-white border border-stone-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div className="flex items-center gap-2 text-sm font-medium text-stone-700">
            <Users size={16} />
            Lista iscritti
          </div>
          {subscribers.length > 0 && (
            <a
              href={`data:text/csv;charset=utf-8,Email,Stato,Data%0A${subscribers
                .map(
                  (s) =>
                    `${s.email},${s.active ? "Attivo" : "Disiscritto"},${new Date(
                      s.createdAt
                    ).toLocaleDateString("it-IT")}`
                )
                .join("%0A")}`}
              download="newsletter.csv"
              className="text-xs text-stone-500 hover:text-gold transition-colors border border-stone-200 px-3 py-1.5"
            >
              Esporta CSV
            </a>
          )}
        </div>

        {subscribers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400">
            <Mail size={32} className="mb-3 opacity-30" />
            <p className="text-sm">Nessun iscritto ancora</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 text-left">
                <th className="px-6 py-3 text-xs tracking-widest uppercase text-stone-400 font-normal">Email</th>
                <th className="px-6 py-3 text-xs tracking-widest uppercase text-stone-400 font-normal">Stato</th>
                <th className="px-6 py-3 text-xs tracking-widest uppercase text-stone-400 font-normal">Data iscrizione</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-3.5 text-stone-700">{s.email}</td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`inline-block text-[10px] tracking-widest uppercase px-2 py-0.5 ${
                        s.active
                          ? "bg-green-50 text-green-700"
                          : "bg-stone-100 text-stone-400"
                      }`}
                    >
                      {s.active ? "Attivo" : "Disiscritto"}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-stone-500">
                    {new Date(s.createdAt).toLocaleDateString("it-IT", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
