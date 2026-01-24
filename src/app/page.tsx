import Image from "next/image";
import heroImg from "@/assets/hero.svg";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prismaClient from "@/lib/prisma";
import { DashboardCard } from "@/components/dashboard/card";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <main className="relative min-h-[calc(100vh-80px)] bg-black overflow-hidden">
        {/* Grid de fundo tecnológico */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-size[4rem_4rem] [mask:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />
        
        {/* Efeitos de luz neon */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] animate-pulse [animation-delay:700ms]" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px] animate-pulse [animation-delay:1000ms]" />

        {/* Conteúdo */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
          {/* Badge futurista */}
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/50 bg-cyan-500/10 backdrop-blur-xl">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-cyan-300 text-sm font-semibold tracking-wider">SISTEMA INTELIGENTE</span>
          </div>

          {/* Título principal */}
          <h2 className="font-light text-2xl md:text-3xl mb-3 text-gray-400 tracking-wide">
            Gerencie sua empresa
          </h2>
          <h1 className="font-black text-5xl md:text-7xl lg:text-8xl mb-12 text-center">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 bg-length[200%_auto] animate-[gradient_3s_ease_infinite]">
              Atendimentos, clientes
            </span>
          </h1>

          {/* Imagem com efeito holográfico */}
          <div className="relative group mb-12">
            {/* Borda neon animada */}
            <div className="absolute -inset-1 bg-linear-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 bg-length[200%_auto] animate-[gradient_3s_ease_infinite]" />
            
            <div className="relative bg-black rounded-3xl p-2">
              <Image
                src={heroImg}
                alt="Imagem de controle de clientes e atendimentos"
                width={600}
                height={600}
                className="max-w-sm md:max-w-xl rounded-2xl"
                priority
              />
            </div>

            {/* Partículas flutuantes */}
            <div className="absolute top-10 -left-4 w-20 h-20 bg-cyan-500/30 rounded-full blur-2xl animate-[float_6s_ease-in-out_infinite]" />
            <div className="absolute bottom-10 -right-4 w-24 h-24 bg-purple-500/30 rounded-full blur-2xl animate-[float-delayed_8s_ease-in-out_infinite]" />
          </div>

          {/* CTA Button */}
          <Link 
            href="/login"
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-linear-to-r from-cyan-500 to-blue-600 rounded-2xl font-bold text-lg text-white overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(34,211,238,0.6)]"
          >
            <span className="relative z-10">Começar Agora</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            
            {/* Efeito de brilho ao hover */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </Link>

          {/* Linha decorativa */}
          <div className="mt-16 flex items-center gap-4">
            <div className="h-px w-12 bg-linear-to-r from-transparent to-cyan-500/50" />
            <span className="text-gray-500 text-sm tracking-widest">TECNOLOGIA DO FUTURO</span>
            <div className="h-px w-12 bg-linear-to-l from-transparent to-cyan-500/50" />
          </div>
        </div>
      </main>
    );
  }

  // Dashboard para usuários logados
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [openTickets, closedToday, totalCustomers] = await Promise.all([
    prismaClient.ticket.count({ 
      where: { status: "ABERTO" } 
    }),
    prismaClient.ticket.count({ 
      where: { 
        status: "FECHADO",
        updated_at: { gte: today } 
      } 
    }),
    prismaClient.customer.count()
  ]);

  return (
    <main className="relative min-h-[calc(100vh-80px)] bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Grid de fundo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size[4rem_4rem] opacity-20" />
      
      {/* Efeitos de luz */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />

      <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col justify-center min-h-[calc(100vh-80px)]">
        <div className="max-w-6xl mx-auto w-full">
          {/* Header */}
          <header className="mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/50 bg-emerald-500/10 backdrop-blur-xl mb-4">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-300 text-xs font-bold uppercase tracking-wider">Sistema Online</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tight">
              <span className="text-white">Olá, </span>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600">
                {session.user.name}
              </span>
            </h1>
            <p className="text-gray-400 text-lg">Aqui está o que está acontecendo na sua empresa hoje.</p>
          </header>

          {/* Grid de KPIs */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <DashboardCard label="Tickets Abertos" value={openTickets} color="red" />
            <DashboardCard label="Fechados Hoje" value={closedToday} color="green" />
            <DashboardCard label="Total Clientes" value={totalCustomers} color="blue" />
          </section>

          {/* Ações Rápidas */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-cyan-500/50 via-blue-500/50 to-purple-600/50 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition duration-1000" />
            
            <div className="relative flex flex-col sm:flex-row items-center gap-6 p-8 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/50">
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-white font-bold text-2xl mb-2">Pronto para começar?</h3>
                <p className="text-gray-400">Gerencie seus chamados ou adicione novos clientes agora mesmo.</p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  href="/dashboard" 
                  className="group/btn relative px-8 py-4 bg-linear-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]"
                >
                  <span className="relative z-10">Acessar Tickets</span>
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                </Link>
                
                <Link 
                  href="/dashboard/customer" 
                  className="px-8 py-4 bg-slate-800 text-gray-200 rounded-xl font-bold border border-slate-700 hover:bg-slate-700 hover:border-slate-600 transition-all"
                >
                  Novo Cliente
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}