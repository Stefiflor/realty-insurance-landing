import type { ReactNode } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { requireStaff } from "@/lib/auth/session";

/**
 * Guardia de todo `/admin` menos `/admin/login` (que vive fuera de este grupo
 * de rutas). Sin sesión, `requireStaff` redirige antes de renderizar nada.
 */
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await requireStaff();

  return (
    <div className="flex min-h-screen bg-band">
      <Sidebar email={session.email} role={session.role} />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
