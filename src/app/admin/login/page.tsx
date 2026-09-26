import { redirect } from "next/navigation";
import { getStaffSession } from "@/lib/auth/session";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Ingresar · Panel MD" };

export default async function LoginPage() {
  // Si ya hay sesión, no tiene sentido mostrar el login de nuevo.
  const session = await getStaffSession();
  if (session) redirect("/admin/propiedades");

  return (
    <main className="flex min-h-screen items-center justify-center bg-band px-6">
      <LoginForm />
    </main>
  );
}
