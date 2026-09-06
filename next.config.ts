import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next genera su propio CLAUDE.md / AGENTS.md al arrancar. Lo apagamos:
  // el CLAUDE.md de este repo está escrito a mano y documenta las decisiones
  // del proyecto, no la versión de Next.
  agentRules: false,
};

export default nextConfig;
