import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import InputMask from 'react-input-mask';
import { UsuarioEcommerceEnderecoDto } from '@/api/generated/mCNSistemas.schemas';

const addressSchema = z.object({
  Nome: z.string().min(3, 'Nome é obrigatório'),
  Endereco: z.string().min(3, 'Endereço é obrigatório'),
  Numero: z.string().min(1, 'Número é obrigatório'),
  Complemento: z.string().optional(),
  Bairro: z.string().min(2, 'Bairro é obrigatório'),
  Cidade: z.string().min(2, 'Cidade é obrigatória'),
  UF: z.string().length(2, 'UF deve ter 2 caracteres'),
  CEP: z.string().min(8, 'CEP inválido')
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddressFormData) => Promise<void>;
  address: UsuarioEcommerceEnderecoDto | null;
}

export function AddressModal({ isOpen, onClose, onSubmit, address }: AddressModalProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: address || {
      Nome: '',
      Endereco: '',
      Numero: '',
      Complemento: '',
      Bairro: '',
      Cidade: '',
      UF: '',
      CEP: ''
    }
  });

  // Resetar form quando o endereço mudar
  useEffect(() => {
    if (address) {
      reset(address);
    }
  }, [address, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{address ? 'Editar' : 'Adicionar'} Endereço</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do Endereço</label>
            <input
              {...register('Nome')}
              className="w-full border rounded-lg p-2"
              placeholder="Ex: Casa, Trabalho"
            />
            {errors.Nome && <span className="text-red-500 text-sm">{errors.Nome.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">CEP</label>
            <InputMask
              mask="99999-999"
              {...register('CEP')}
              className="w-full border rounded-lg p-2"
              placeholder="00000-000"
            />
            {errors.CEP && <span className="text-red-500 text-sm">{errors.CEP.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Endereço</label>
              <input
                {...register('Endereco')}
                className="w-full border rounded-lg p-2"
                placeholder="Rua/Avenida"
              />
              {errors.Endereco && <span className="text-red-500 text-sm">{errors.Endereco.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Número</label>
              <input
                {...register('Numero')}
                className="w-full border rounded-lg p-2"
                placeholder="123"
              />
              {errors.Numero && <span className="text-red-500 text-sm">{errors.Numero.message}</span>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Complemento</label>
            <input
              {...register('Complemento')}
              className="w-full border rounded-lg p-2"
              placeholder="Apto 123, Bloco B"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bairro</label>
            <input
              {...register('Bairro')}
              className="w-full border rounded-lg p-2"
              placeholder="Bairro"
            />
            {errors.Bairro && <span className="text-red-500 text-sm">{errors.Bairro.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Cidade</label>
              <input
                {...register('Cidade')}
                className="w-full border rounded-lg p-2"
                placeholder="Cidade"
              />
              {errors.Cidade && <span className="text-red-500 text-sm">{errors.Cidade.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">UF</label>
              <input
                {...register('UF')}
                className="w-full border rounded-lg p-2"
                placeholder="UF"
                maxLength={2}
              />
              {errors.UF && <span className="text-red-500 text-sm">{errors.UF.message}</span>}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 