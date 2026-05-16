import { prisma } from "@/lib/db";

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Contatti</h1>
        <p className="text-sm text-stone-500 mt-1">
          {leads.length} richieste di gioielli personalizzati
        </p>
      </div>

      <div className="bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100">
              {["Nome", "Email", "Telefono", "Messaggio", "Fonte", "Data"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-400 font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-stone-400 text-sm">
                  Nessun contatto ancora.
                </td>
              </tr>
            )}
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                <td className="px-4 py-3 font-medium text-stone-900">{lead.name}</td>
                <td className="px-4 py-3">
                  <a href={`mailto:${lead.email}`} className="text-gold hover:underline">
                    {lead.email}
                  </a>
                </td>
                <td className="px-4 py-3 text-stone-500">
                  {lead.phone ? (
                    <a href={`tel:${lead.phone}`} className="hover:text-stone-900">
                      {lead.phone}
                    </a>
                  ) : (
                    <span className="text-stone-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-stone-500 max-w-xs">
                  <p className="truncate">{lead.message ?? "—"}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[10px] tracking-widest uppercase bg-stone-100 text-stone-500 px-2 py-1">
                    {lead.source}
                  </span>
                </td>
                <td className="px-4 py-3 text-stone-400 text-xs">
                  {new Date(lead.createdAt).toLocaleDateString("it-IT", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
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
