"use client"
import { Input } from "@/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { CustomerDataInfo } from "../../page";
import { FiFileText, FiMessageSquare, FiSend } from "react-icons/fi";

const schema = z.object({
    name: z.string().min(1, "O nome do Ticket é obrigatório"),
    description: z.string().min(1, "Descreva o seu problema...")
})

type FormData = z.infer<typeof schema>

interface FormTicketProps {
    customer: CustomerDataInfo;
}

export function FormTicket({ customer }: FormTicketProps) {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema)
    })

    async function handleRegisterTicket(data: FormData) {
        await api.post("/api/ticket", {
            name: data.name,
            description: data.description,
            customerId: customer.id
        })

        setValue("name", "")
        setValue("description", "")
    }

    return (
        <form 
            className="bg-white mt-6 p-6 md:p-8 rounded-xl border border-gray-100 shadow-lg shadow-gray-100 flex flex-col gap-5" 
            onSubmit={handleSubmit(handleRegisterTicket)}
        >
            <div className="flex flex-col gap-2">
                <label className="font-bold text-gray-700 flex items-center gap-2">
                    <FiFileText size={18} className="text-blue-500" />
                    Nome do Ticket
                </label>

                <Input
                    type="text"
                    name="name"
                    placeholder="Ex: Problema com o banco de dados..."
                    error={errors.name?.message}
                    register={register}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="font-bold text-gray-700 flex items-center gap-2">
                    <FiMessageSquare size={18} className="text-blue-500" />
                    Descreva seu problema
                </label>

                <textarea
                    id="description"
                    placeholder="Forneça o máximo de detalhes possível..."
                    {...register("description")}
                    className="w-full border border-gray-200 rounded-lg h-32 resize-none px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-400"
                ></textarea>
                
                {errors.description?.message && (
                
                <p className="text-red-500 text-sm font-medium mt-1">{errors.description?.message}</p>
                )}
            </div>

            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-lg mt-2 flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-100 active:scale-95 cursor-pointer"
            >
                <FiSend size={18} />
                Abrir Chamado
            </button>
        </form>
    )
}