// Utilitários para formatação de datas

export type FirestoreTimestamp = {
  _seconds: number
  _nanoseconds: number
}

export type DateValue = string | Date | FirestoreTimestamp | null | undefined

/**
 * Formata uma data do Firestore para string localizada
 * @param dateValue - Valor da data (pode ser string, Date, ou objeto Firestore)
 * @param locale - Locale para formatação (padrão: 'pt-BR')
 * @param options - Opções de formatação
 * @returns String formatada da data
 */
export const formatFirestoreDate = (
  dateValue: DateValue,
  locale: string = 'pt-BR',
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!dateValue) return 'Não informado'
  
  let date: Date
  
  // Se já é uma string ISO, usar diretamente
  if (typeof dateValue === 'string') {
    date = new Date(dateValue)
  }
  // Se é um objeto do Firestore com _seconds
  else if (dateValue && typeof dateValue === 'object' && '_seconds' in dateValue) {
    date = new Date(dateValue._seconds * 1000)
  }
  // Se é um objeto Date válido
  else if (dateValue instanceof Date) {
    date = dateValue
  }
  else {
    return 'Data inválida'
  }
  
  // Verificar se a data é válida
  if (isNaN(date.getTime())) {
    return 'Data inválida'
  }
  
  // Formatar com opções padrão se não fornecidas
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options
  }
  
  return date.toLocaleDateString(locale, defaultOptions)
}

/**
 * Formata uma data do Firestore para string com hora
 * @param dateValue - Valor da data
 * @param locale - Locale para formatação
 * @returns String formatada da data com hora
 */
export const formatFirestoreDateTime = (
  dateValue: DateValue,
  locale: string = 'pt-BR'
): string => {
  return formatFirestoreDate(dateValue, locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Converte uma data do Firestore para objeto Date do JavaScript
 * @param dateValue - Valor da data
 * @returns Objeto Date ou null se inválido
 */
export const firestoreDateToDate = (dateValue: DateValue): Date | null => {
  if (!dateValue) return null
  
  if (typeof dateValue === 'string') {
    return new Date(dateValue)
  }
  
  if (dateValue && typeof dateValue === 'object' && '_seconds' in dateValue) {
    return new Date(dateValue._seconds * 1000)
  }
  
  if (dateValue instanceof Date) {
    return dateValue
  }
  
  return null
}
