"use client"

import toast from "react-hot-toast";
import { FiSave } from "react-icons/fi";
import { useFormStatus } from "react-dom";

interface ButtonProps {
  action: (formData: FormData) => Promise<void>;
  name: string;
}

export function ButtonSubmit(
    { action, name }: ButtonProps
) {
    const { pending } = useFormStatus();

    return (
        <button 
            type="submit"
            disabled={pending}
            formAction={async (formData: FormData) => {
                try {
                    await action(formData);
                    toast.success(`${name} criado com sucesso!`);
                } catch (err: any) {
                    if (err.message === "NEXT_REDIRECT") {
                        toast.success(`${name} cadastrado com sucesso!`);
                        return; 
                    }
                    
                    toast.error(`Erro ao criar o ${name.toLowerCase()}.`);
                }
            }}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-lg mt-4 transition-all shadow-md shadow-blue-100 active:scale-[0.98] cursor-pointer"
        >
            <FiSave size={20} />
            {pending ? "Cadastrando..." : `Cadastrar ${name}`}
        </button>
    )
}