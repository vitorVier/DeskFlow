export function CardCustomer() {
    return (
        <article className="flex flex-col bg-gray-100 border-2 border-gray-300 p-2 rounded-lg gap-2 hover:scale-105 duration-300">
            <h2>
                <a className="font-bold">Nome:</a> Teste Cliente
            </h2>

            <p>
                <a className="font-bold">Email:</a> teste@teste.com
            </p>

            <p>
                <a className="font-bold">Telefone:</a> (55) 55912345678
            </p>

            <button className="bg-red-500 px-4 py-1 rounded text-white mt-2 self-start cursor-pointer hover:font-medium">
                Deletar
            </button>
        </article>
    )
}