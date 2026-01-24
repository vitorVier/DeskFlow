interface CardInfoProps {
  label: string;
  value: string | undefined;
}

export function InputClientData({ label, value }: CardInfoProps) {
    return (
        <div className="bg-blue-50/30 p-3 rounded-lg border border-blue-100">
            <span className="block text-[10px] font-bold text-blue-400 uppercase">{label}</span>
            <p className="text-gray-800 font-semibold text-sm md:text-base">
                {value || "Não informado"}
            </p>
        </div>
    )
}