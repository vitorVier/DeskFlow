"use client"

import { Input } from "@/components/input"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { FiCheckCircle, FiSearch, FiX } from "react-icons/fi"
import { useState } from "react"
import { FormTicket } from "./components/formTicket"
import { api } from "@/lib/api"
import toast from "react-hot-toast"

const schema = z.object({
    email: z.string().email("Digite o email do cliente para localizar.").min(1, "O campo e-mail é obrigatório!")
})

type FormData = z.infer<typeof schema>;

export interface CustomerDataInfo {
    id: string;
    name: string;
}

export default function OpenTicket() {
    const [ customer, setCustomer ] = useState<CustomerDataInfo | null>(null);

    const { register, handleSubmit, setValue, setError, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema)
    })

    function handleClearCustomer() {
        setCustomer(null);
        setValue("email", "")
    }

    async function handleSearchCustomer(data: FormData) {
        const response = await api.get("/api/customer", {
            params: { 
                email: data.email 
            }
        })

        if(response.data === null) {
            setError("email", { type: "custom", message: "Ops, o cliente não foi encontrado!" })
            toast.error("E-mail não cadastrado na base de dados!");
            return;
        }

        setCustomer({
            id: response.data.id,
            name: response.data.name
        })
    }

    return (
        <div className="w-full max-w-2xl mx-auto px-4">
            <h1 className="font-extrabold text-4xl text-center mt-16 text-gray-800">
                Abrir Ticket
            </h1>

            <p className="text-gray-500 text-center mt-2 mb-8">
                Localize o cliente e descreva o problema abaixo.
            </p>

            <main className="flex flex-col mb-10">
                {customer ? (
                    <div className="flex items-center justify-between py-4 px-6 rounded-xl border border-green-100 bg-green-50/50 animate-in fade-in duration-300">
                        <div className="flex items-center gap-3">
                        <FiCheckCircle size={22} className="text-green-600" />
                        <p className="text-gray-700">
                            <strong>Cliente:</strong> {customer.name}
                        </p>
                        </div>
                        <button 
                        className="bg-white p-2 rounded-full shadow-sm hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all cursor-pointer border border-gray-100" 
                        onClick={handleClearCustomer}
                        >
                        <FiX size={20} />
                        </button>
                    </div>
                ) : (
                    <form 
                        className="p-1.5 rounded-xl border border-gray-200 bg-white shadow-sm flex items-center gap-2 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all" 
                        onSubmit={handleSubmit(handleSearchCustomer)}
                    >
                        <div className="flex-1">
                            <Input 
                                type="email"
                                name="email"
                                placeholder="Busque pelo e-mail do cliente..."
                                error={errors.email?.message}
                                register={register}
                            />
                        </div>

                        <button className="bg-gray-900 text-white p-3 rounded-lg hover:bg-gray-800 transition-all cursor-pointer">
                            <FiSearch size={22} />
                        </button>
                    </form>
                )}

                {customer !== null && (
                    <div className="animate-in slide-in-from-top-4 duration-500">
                        <FormTicket customer={customer} />
                    </div>
                )}
            </main>
        </div>
    )
}