"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/input"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { FiMail, FiMapPin, FiPhone, FiSave, FiUser } from "react-icons/fi"
import { ButtonSubmit } from "@/app/dashboard/components/buttonSubmit"

const schema = z.object({
    name: z.string().min(1, "O campo nome é obrigatório!"),
    email: z.string().email("Digite um email válido!").min(1, "O campo nome é obrigatório!"),
    phone: z.string().refine( (value) => {
        return /^(?:\(\d{2}\)\s?)?\d{9}$/.test(value) || /^\d{2}\s\d{9}$/.test(value) || /^\d{11}$/.test(value)
    }, {
        message: "O número de telefone deve estar (DD) 999999999"
    }),
    address: z.string()
})

type CustomerFormData = z.infer<typeof schema>

export function NewCustomerForm({ userId }: { userId: string }) {
    const { register, trigger, getValues, formState: { errors } } = useForm<CustomerFormData>({
        resolver: zodResolver(schema)
    })

    const router = useRouter();

    async function handleRegisterCustomer(formData: FormData) {
        const isValid = await trigger();
        if (!isValid) return;
        const data = getValues();

        try {
            await api.post("/api/customer", {
                name: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address,
                userId: userId
            })

            router.refresh();
            router.replace("/dashboard/customer");
        } catch(err) {
            throw err;
        }
    }

    return (
        <form className="flex flex-col gap-6 mt-2">
            <div className="flex flex-col gap-2">
                <label className="text-gray-700 font-bold flex items-center gap-2">
                    <FiUser size={18} className="text-blue-500" />
                    Nome completo
                </label>
                <Input 
                    type="text"
                    name="name"
                    placeholder="Digite o nome completo..."
                    error={errors.name?.message}
                    register={register}
                />
            </div>

            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-gray-700 font-bold flex items-center gap-2">
                        <FiPhone size={18} className="text-blue-500" />
                        Telefone
                    </label>
                    <Input 
                        type="text"
                        name="phone"
                        placeholder="Ex: (DD) 91234-5678"
                        error={errors.phone?.message}
                        register={register}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-gray-700 font-bold flex items-center gap-2">
                        <FiMail size={18} className="text-blue-500" />
                        E-mail
                    </label>
                    <Input 
                        type="email"
                        name="email"
                        placeholder="email@exemplo.com"
                        error={errors.email?.message}
                        register={register}
                    />
                </div>
            </section>

            <div className="flex flex-col gap-2">
                <label className="text-gray-700 font-bold flex items-center gap-2">
                    <FiMapPin size={18} className="text-blue-500" />
                    Endereço (Opcional)
                </label>
                <Input 
                    type="text"
                    name="address"
                    placeholder="Rua, número, bairro e cidade..."
                    error={errors.address?.message}
                    register={register}
                />
            </div>

            <ButtonSubmit 
                name={'cliente'}
                action={handleRegisterCustomer}
            />
        </form>
    )
}