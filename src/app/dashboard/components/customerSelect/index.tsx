"use client"

import { useMemo, useState } from 'react';
import Select from 'react-select';

interface Customer {
  id: string;
  name: string;
}

export function CustomerSelect({ customers }: { customers: Customer[] }) {
  // 1. Guardamos o ID selecionado para enviar no formulário
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");

  // 2. Usamos useMemo para a lista não "piscar" ou travar o filtro
  const options = useMemo(() => 
    customers.map(customer => ({
      value: customer.id,
      label: customer.name
    })), [customers]);

  return (
    <div className="flex flex-col w-full gap-2">
      <label className="font-bold text-gray-700 text-lg">Cliente</label>
      
      {/* 3. Input escondido para o seu handleRegisterTicket receber o ID com o nome "customer" */}
      <input type="hidden" name="customer" value={selectedCustomerId} />

      <Select
        instanceId="customer-select-unique-id" // 4. Essencial para Next.js 14/15/16
        options={options}
        placeholder="Procure pelo nome do cliente..."
        noOptionsMessage={() => "Nenhum cliente encontrado"}
        isSearchable={true} 
        isClearable={true}
        onChange={(opt) => setSelectedCustomerId(opt?.value || "")} // Atualiza o input hidden
        
        styles={{
          control: (base, state) => ({
            ...base,
            height: '48px',
            borderRadius: '8px',
            borderWidth: '1px',
            borderColor: state.isFocused ? '#3b82f6' : '#e5e7eb',
            boxShadow: state.isFocused ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : 'none',
            '&:hover': { borderColor: '#3b82f6' }
          }),
          menu: (base) => ({
            ...base,
            borderRadius: '8px',
            zIndex: 50 // Garante que a lista apareça sobre outros elementos
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
            color: state.isSelected ? 'white' : '#374151',
            cursor: 'pointer',
          }),
        }}
      />
    </div>
  )
}