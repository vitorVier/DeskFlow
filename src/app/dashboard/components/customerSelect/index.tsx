"use client"

import Select from 'react-select'

interface Customer {
  id: string;
  name: string;
}

export function CustomerSelect({ customers }: { customers: Customer[] }) {
  const options = customers.map(customer => ({
    value: customer.id,
    label: customer.name
  }));

  return (
    <div className="flex flex-col w-full">
      <label className="mb-1 font-medium text-lg">Cliente</label>
      <Select
        name="customer"
        options={options}
        placeholder="Selecione ou digite o nome..."
        noOptionsMessage={() => "Nenhum cliente encontrado"}
        isSearchable={true}
        styles={{
          control: (base) => ({
            ...base,
            height: '44px',
            borderRadius: '6px',
            borderWidth: '2px',
            borderColor: '#e2e8f0',
          })
        }}
      />
    </div>
  )
}