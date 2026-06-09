import { allowedImageHosts, env, trustedOrigins } from "@/lib/env";

export default function AdminSecurityPage() {
  const rows = [
    { label: "Environment", value: env.NODE_ENV },
    { label: "Site URL", value: env.NEXT_PUBLIC_SITE_URL },
    { label: "Trusted origins", value: trustedOrigins().join(", ") },
    { label: "Allowed image hosts", value: allowedImageHosts().join(", ") },
    { label: "Rate limiter", value: "local in-memory fallback" },
    { label: "CSP", value: "report-only" },
    { label: "Secrets", value: "loaded, not displayed" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Security</p>
        <h2 className="font-serif text-3xl font-bold text-slate-950">Production readiness</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Non-secret security status. Rotate leaked credentials outside this dashboard.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{row.label}</p>
            <p className="mt-2 break-words text-sm font-medium text-slate-800">{row.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
