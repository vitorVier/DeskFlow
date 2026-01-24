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

    return (
        <button 
            type="submit"
            // disabled={pending}
            disabled={isBlocked}
            formAction={async (formData: FormData) => {
                try {
                    await action(formData);
                    toast.success(`${name} criado com sucesso!`);
                } catch (err: any) {
                    if (err.message === "NEXT_REDIRECT") {
                        toast.success(`${name} cadastrado com sucesso!`);
                        return; 
                    }
                    
                    toast(`Verifique se o e-mail do cliente já está na sua base de dados`);
                    toast.error(`Erro ao criar o ${name.toLowerCase()}.`);
                }
            }}
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