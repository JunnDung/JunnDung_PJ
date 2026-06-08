import { prisma } from "@/lib/prisma";

export default async function AdminNewsletterPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Newsletter</p>
          <h2 className="font-serif text-3xl font-bold text-slate-950">Subscribers</h2>
        </div>
        <p className="text-sm text-slate-500">{subscribers.length} total subscribers</p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
            <tr>
              <th className="px-5 py-4">Email</th>
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id}>
                <td className="px-5 py-4 font-medium text-slate-800">{subscriber.email}</td>
                <td className="px-5 py-4 text-slate-600">{subscriber.name ?? "—"}</td>
                <td className="px-5 py-4 text-slate-600">
                  {subscriber.unsubscribedAt ? "Unsubscribed" : subscriber.verifiedAt ? "Verified" : "Subscribed"}
                </td>
                <td className="px-5 py-4 text-slate-500">{subscriber.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {subscribers.length === 0 && (
          <div className="px-6 py-16 text-center">
            <h3 className="font-serif text-2xl font-bold text-slate-900">No subscribers yet</h3>
            <p className="mt-2 text-sm text-slate-500">Newsletter signups will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
