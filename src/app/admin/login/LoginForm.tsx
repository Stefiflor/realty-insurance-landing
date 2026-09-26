"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { LogoMark } from "@/components/ui/Logo";
import { Field, Input, FormError } from "@/components/admin/FormControls";
import { login, type LoginState } from "./actions";

const INITIAL_STATE: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, INITIAL_STATE);

  return (
    <div className="w-full max-w-[380px] rounded-md border border-hair-strong bg-surface p-8 shadow-xl">
      <div className="mb-7 flex flex-col items-center text-center">
        <LogoMark size={40} className="mb-4" />
        <h1 className="m-0 text-[20px] font-medium tracking-[-0.01em]">Panel de administración</h1>
        <p className="m-0 mt-1.5 text-[13.5px] font-light text-dim">
          Sólo para el equipo de MD Estudio Inmobiliario.
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <FormError message={state.error} />

        <Field label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </Field>

        <Field label="Contraseña" htmlFor="password">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </Field>

        <Button type="submit" variant="primary" size="md" className="mt-2 w-full" disabled={pending}>
          <Icon name="lock" size={15} />
          {pending ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
}
