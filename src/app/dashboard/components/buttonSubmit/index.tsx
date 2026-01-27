"use client"

import toast from "react-hot-toast";
import { FiSave } from "react-icons/fi";
import { useFormStatus } from "react-dom";

interface ButtonProps {
  action: (formData: FormData) => Promise<void>;
  name: string;
  disabledManual?: boolean;
}

export function ButtonSubmit(
    { action, name, disabledManual }: ButtonProps
) {
    const { pending } = useFormStatus();
    const isBlocked = pending || disabledManual;

    const handleSubmit = async (formData: FormData) => {
        const customerId = formData.get("customer");

        if (!customerId || customerId === "") {
            toast.error("Selecione um cliente antes de continuar!");
            return; // Para a execução aqui
        }

        const toastId = toast.loading(`Cadastrando ${name.toLowerCase()}...`);
        
        try {
            await action(formData);
            
            toast.success(`${name} cadastrado com sucesso!`, { id: toastId });
            
        } catch (err: any) {
            // Redirecionamento do Next.js é considerado "sucesso"
            if (err?.message === "NEXT_REDIRECT" || err?.digest?.includes("NEXT_REDIRECT")) {
                toast.success(`${name} cadastrado com sucesso!`, { id: toastId });
                return;
            }
            
            // Erros específicos
            const errorMessages: Record<string, string> = {
                "email": "Este e-mail já está cadastrado!",
                "phone": "Este telefone já está cadastrado!",
                "Unique constraint": "Registro duplicado!",
                "validation": "Preencha todos os campos obrigatórios!"
            };
            
            // Procurar por erro específico
            let errorMessage = `Erro ao cadastrar ${name.toLowerCase()}`;
            
            for (const [key, message] of Object.entries(errorMessages)) {
                if (err?.message?.toLowerCase().includes(key.toLowerCase())) {
                    errorMessage = message;
                    break;
                }
            }
            
            console.error("Erro ao cadastrar:", err);
            toast.error(errorMessage, { id: toastId });
        }
    };

    return (
        <button 
            type="submit"
            disabled={isBlocked}
            formAction={handleSubmit}
            className={`
                flex items-center justify-center gap-2 w-full font-bold h-12 rounded-lg mt-4 transition-all
                ${isBlocked 
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed select-none" // Cinza se estiver bloqueado
                    : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-[0.98]" // Azul se estiver liberado
                }
            `}
        >
            <FiSave size={20} />
            {pending ? "Cadastrando..." : `Cadastrar ${name}`}
        </button>
    )
}