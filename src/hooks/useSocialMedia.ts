'use client'

import { useAuth } from '@/contexts/AuthContext';
import { useGetApiEmpresaRedesocial } from '@/api/generated/mCNSistemas';
import type { RedeSocialDto } from '@/api/generated/mCNSistemas.schemas';

export function useSocialMedia() {
  const { isLoading: isAuthLoading, error: authError } = useAuth();

  const {
    data: socialMedia,
    error,
    isLoading,
  } = useGetApiEmpresaRedesocial({ empresa: 1 }, {
    swr: {
      enabled: !isAuthLoading && !authError,
    }
  });

  const getSocialMediaUrl = (type: string) => {
    console.log('socialMedia', socialMedia , socialMedia === undefined);
    if (!Array.isArray(socialMedia)) {
      return '';
    }
    const social = socialMedia?.find(s => 
      s.RedeSocial?.toUpperCase() === type.toUpperCase()
    );
    return social?.URL || '';
  };

  return {
    socialMedia: socialMedia || [],
    isLoading,
    error: error ? 'Erro ao carregar informações de contato' : null,
    getSocialMediaUrl
  };
} 