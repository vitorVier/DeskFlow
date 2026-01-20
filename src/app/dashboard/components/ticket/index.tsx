import { FiFile, FiTrash2 } from "react-icons/fi";

export function TicketItem() {
    return (
        <>
            <tr className="border-b-2 border-b-slate-200 h-16 last:border-b-0 bg-slate-100 hover:bg-gray-200 duration-300">
                <td className="text-left pl-1">
                    Mercado Silva
                </td>

                <td className="text-left hidden sm:table-cell">
                    01/04/2025
                </td>

                <td className="text-left">
                    <span className="bg-green-500 px-2 py-1 rounded">ABERTO</span>
                </td>

                <td className="text-right pr-2">
                    <button className="mr-2 cursor-pointer">
                        <FiTrash2 size={24} color="#EF4444" />
                    </button>

                    <button className="cursor-pointer">
                        <FiFile size={24} color="#3B82F6" />
                    </button>
                </td>
            </tr>
        </>
    )
}