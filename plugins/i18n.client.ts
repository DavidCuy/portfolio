export default defineNuxtPlugin(() => {
  const { locale, setLocale } = useI18n()

  // Si arranca sin locale o arranca en uno inesperado
  if (locale.value !== 'en') {
    setLocale('en')
  }
})
