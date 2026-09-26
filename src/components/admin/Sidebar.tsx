"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/Icon";
import { LogoMark } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";
import type { StaffRole } from "@/lib/auth/session";
import { logout } from "@/app/admin/login/actions";

const LINKS: Array<{ href: string; label: string; icon: IconName }> = [
  { href: "/admin/propiedades", label: "Propiedades", icon: "sale" },
  { href: "/admin/seguros", label: "Seguros", icon: "shield" },
  { href: "/admin/consultas", label: "Consultas", icon: "mail" },
];

export function Sidebar({ email, role }: { email: string; role: StaffRole }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[240px] shrink-0 flex-col border-r border-hair bg-surface">
      <div className="flex items-center gap-2.5 border-b border-hair px-5 py-5">
        <LogoMark size={26} />
        <span className="text-[13px] font-semibold tracking-[0.02em]">Panel MD</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {LINKS.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-[5px] px-3.5 py-2.5 text-[14px] transition-colors",
                active ? "bg-brand-soft text-brand font-medium" : "text-dim hover:bg-band hover:text-ink",
              )}
            >
              <Icon name={link.icon} size={17} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-hair p-4">
        <div className="mb-3 px-1">
          <div className="truncate text-[13px] font-medium text-ink">{email}</div>
          <div className="text-[11.5px] font-light text-faint capitalize">{role}</div>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full cursor-pointer items-center gap-2.5 rounded-[5px] px-3.5 py-2.5 text-[13.5px] text-dim transition-colors hover:bg-band hover:text-ink"
          >
            <Icon name="logout" size={16} />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
