import emailjs from '@emailjs/browser'

// Configurações do EmailJS - Substitua pelos seus valores
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_advhub'
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_advhub_form'
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'ejp3Lo6DsFVQgYOit'

// Inicializar EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY)

export interface FormSubmissionData {
  name: string
  email: string
  phone: string
  clinicName: string
  specialties: string
  monthlyAppointments: string
  hasSecretary: string
  paidMedia: string
  monthlyInvestment: string
  monthlyRevenue: string
  mainChallenges: string
  improvements: string
  whySelected: string
}

export const sendApplicationEmail = async (formData: FormSubmissionData): Promise<boolean> => {
  try {
    // Preparar dados para o template
    const templateParams = {
      to_email: 'contato@advhub.com.br',
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      clinic_name: formData.clinicName,
      specialties: formData.specialties,
      monthly_appointments: formData.monthlyAppointments,
      has_secretary: formData.hasSecretary,
      paid_media: formData.paidMedia,
      monthly_investment: formData.monthlyInvestment,
      monthly_revenue: formData.monthlyRevenue,
      main_challenges: formData.mainChallenges,
      improvements: formData.improvements,
      why_selected: formData.whySelected,
      submission_date: new Date().toLocaleString('pt-BR')
    }

    // Enviar email
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    )

    console.log('Email enviado com sucesso:', response)
    return true
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return false
  }
}

