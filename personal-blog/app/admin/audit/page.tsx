import { prisma } from "@/lib/prisma";

export default async function AdminAuditPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Security</p>
        <h2 className="font-serif text-3xl font-bold text-slate-950">Audit log</h2>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
            <tr>
              <th className="px-5 py-4">Action</th>
              <th className="px-5 py-4">Actor</th>
              <th className="px-5 py-4">Target</th>
              <th className="px-5 py-4">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-5 py-4 font-medium text-slate-800">{log.action}</td>
                <td className="px-5 py-4 text-slate-600">{log.actorId ?? "system"}</td>
                <td className="px-5 py-4 text-slate-600">{log.target}</td>
                <td className="px-5 py-4 text-slate-500">{log.createdAt.toISOString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && <div className="px-6 py-16 text-center text-sm text-slate-500">No audit events yet.</div>}
      </div>
    </div>
  );
}
