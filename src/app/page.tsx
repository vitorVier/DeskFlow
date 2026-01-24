import Image from "next/image";
import heroImg from "@/assets/hero.svg";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prismaClient from "@/lib/prisma";
import { DashboardCard } from "@/components/dashboard/card";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // Landing Page Ultra Moderna
  if (!session) {
    return (
      <main className="relative min-h-[calc(100vh-80px)] bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        {/* Grid de fundo tecnológico */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size[4rem_4rem] opacity-30 [mask-image[radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />
        
        {/* Efeitos de luz neon */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] animate-pulse [animation-delay:700ms]" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px] animate-pulse [animation-delay:1000ms]" />

        {/* Conteúdo */}
        <div className="relative z-10 min-h-[calc(100vh-80px)] px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-80px)] py-12">
              
              {/* Coluna Esquerda - Texto */}
              <div className="space-y-8">
                {/* Badge futurista */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/50 bg-cyan-500/10 backdrop-blur-xl">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  <span className="text-cyan-300 text-sm font-semibold tracking-wider">SISTEMA INTELIGENTE DE GESTÃO</span>
                </div>

                {/* Título principal */}
                <div className="space-y-4">
                  <h1 className="font-black text-5xl md:text-6xl lg:text-7xl leading-tight">
                    <span className="text-white">Gerencie sua</span>
                    <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 bg-length[200%_auto] animate-[gradient_3s_ease_infinite]">
                      empresa completa
                    </span>
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-xl">
                    Controle atendimentos, clientes e métricas em tempo real. 
                    <span className="text-cyan-400 font-semibold"> Tudo em um só lugar.</span>
                  </p>
                </div>

                {/* Features rápidas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm">
                    <div className="w-10 h-10 rounded-lg bg-linear-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30">
                      <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">Super Rápido</p>
                      <p className="text-xs text-gray-500">Interface otimizada</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm">
                    <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
                      <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">100% Seguro</p>
                      <p className="text-xs text-gray-500">Dados protegidos</p>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link 
                    href="/login"
                    className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-linear-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-lg text-white overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(34,211,238,0.6)]"
                  >
                    <span className="relative z-10">Começar Agora</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </Link>
                </div>

                {/* Social Proof */}
                <div className="flex items-center gap-8 pt-6 border-t border-slate-800/50">
                  <div>
                    <p className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">150+</p>
                    <p className="text-sm text-gray-500">Horas poupadas no mês</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500">15k+</p>
                    <p className="text-sm text-gray-500">Capacidade de Tráfego</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-500">100%</p>
                    <p className="text-sm text-gray-500">NPS / Aprovação Beta</p>
                  </div>
                </div>
              </div>

              {/* Coluna Direita - Imagem */}
              <div className="relative lg:h-150 flex items-center justify-center">
                {/* Imagem com efeito holográfico */}
                <div className="relative group">
                  {/* Borda neon animada */}
                  <div className="absolute -inset-1 bg-linear-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 bg-length[200%_auto] animate-[gradient_3s_ease_infinite]" />
                  
                  <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-3xl p-2 border border-slate-800/50">
                    <Image
                      src={heroImg}
                      alt="Imagem de controle de clientes e atendimentos"
                      width={600}
                      height={600}
                      className="w-full max-w-lg rounded-2xl"
                      priority
                    />
                  </div>

                  {/* Partículas flutuantes */}
                  <div className="absolute top-10 -left-4 w-20 h-20 bg-cyan-500/30 rounded-full blur-2xl animate-[float_6s_ease-in-out_infinite]" />
                  <div className="absolute bottom-10 -right-4 w-24 h-24 bg-purple-500/30 rounded-full blur-2xl animate-[float-delayed_8s_ease-in-out_infinite]" />
                  
                  {/* Card flutuante - Métrica */}
                  <div className="absolute -bottom-6 -left-6 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-emerald-500/30 shadow-2xl animate-[float_4s_ease-in-out_infinite]">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-emerald-500/30">
                        <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-2xl font-black text-emerald-400">+24</p>
                        <p className="text-xs text-gray-400">Tickets hoje</p>
                      </div>
                    </div>
                  </div>

                  {/* Card flutuante - Notificação */}
                  <div className="absolute -top-6 -right-6 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 shadow-2xl animate-[float-delayed_5s_ease-in-out_infinite]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Novo cliente</p>
                        <p className="text-xs text-gray-400">Há 2 minutos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
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