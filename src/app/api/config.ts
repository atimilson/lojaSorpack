export const cacheConfig = {
  auth: {
    revalidate: 21600 // 6 horas
  },
  products: {
    revalidate: 3600 // 1 hora
  },
  banners: {
    revalidate: 7200 // 2 horas
  }
}; 