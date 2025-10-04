'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/landing/logo"
import { AnimatedGroup } from "@/components/ui/animated-group"
import { useState } from "react"
import { useAuth as useAuthContext } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useOnboarding } from "@/hooks/use-onboarding"
import { OnboardingProgress } from "@/components/ui/onboarding-progress"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    clinicaName: ""
  })
  const { signUp } = useAuthContext()
  const router = useRouter()
  const { completeOnboarding, isLoading, currentStep } = useOnboarding()
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validar senhas
      if (formData.password !== formData.confirmPassword) {
        throw new Error("As senhas não coincidem")
      }

      if (formData.password.length < 6) {
        throw new Error("A senha deve ter pelo menos 6 caracteres")
      }

      // Iniciar processo completo
      setIsProcessing(true)

      // 1. Criar conta no Firebase
      setIsCreatingAccount(true)
      await signUp(formData.email, formData.password)
      toast.success("Conta criada com sucesso!")

      // 2. Aguardar um pouco para o Firebase processar
      setIsCreatingAccount(false)
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 3. Executar onboarding completo
      await completeOnboarding({
        name: formData.name,
        email: formData.email,
        clinicaName: formData.clinicaName
      })

      toast.success("Onboarding completo! Redirecionando...")
      
      // 4. Redirecionar para dashboard
      setTimeout(() => {
        router.push('/calendar')
      }, 2000)

    } catch (error: any) {
      console.error('Erro no signup:', error)
      toast.error(error.message || "Erro ao criar conta")
      setIsProcessing(false)
    } finally {
      setIsCreatingAccount(false)
    }
  }

  return (
    <>
      <OnboardingProgress 
        currentStep={isCreatingAccount ? "Criando conta no Firebase..." : currentStep}
        isLoading={isProcessing || isLoading || isCreatingAccount}
      />
      <div className={cn("flex flex-col gap-6", className)} {...props}>
      <AnimatedGroup 
        variants={{
          container: {
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
              },
            },
          },
          item: {
            hidden: { 
              opacity: 0, 
              y: 30, 
              scale: 0.95,
              filter: 'blur(4px)'
            },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
              transition: {
                type: 'spring',
                stiffness: 300,
                damping: 25,
                duration: 0.6,
              },
            },
          },
        }}
        className="w-full"
      >
        <Card className="backdrop-blur-sm bg-white/90 border-white/20 shadow-2xl">
          <CardHeader>
            <div className="flex flex-col gap-2">
              <div className="flex justify-center mb-4">
                <AnimatedGroup 
                  variants={{
                    container: {
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: { delay: 0.3, duration: 0.8 }
                      },
                    },
                    item: {
                      hidden: { 
                        opacity: 0, 
                        scale: 0.8,
                        rotate: -10
                      },
                      visible: {
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                        transition: {
                          type: 'spring',
                          stiffness: 400,
                          damping: 15,
                        },
                      },
                    },
                  }}
                >
                  <Logo />
                </AnimatedGroup>
              </div>
              <AnimatedGroup 
                variants={{
                  container: {
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { delay: 0.5, staggerChildren: 0.1 }
                    },
                  },
                  item: {
                    hidden: { 
                      opacity: 0, 
                      y: 20,
                      filter: 'blur(2px)'
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: 'blur(0px)',
                      transition: {
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                      },
                    },
                  },
                }}
              >
                <CardTitle className="text-center">Crie sua conta</CardTitle>
                <CardDescription className="text-center">
                  Preencha os dados abaixo para começar a usar o Ailum CRM
                </CardDescription>
              </AnimatedGroup>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <AnimatedGroup 
                variants={{
                  container: {
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { delay: 0.7, staggerChildren: 0.15 }
                    },
                  },
                  item: {
                    hidden: { 
                      opacity: 0, 
                      x: -20,
                      scale: 0.98
                    },
                    visible: {
                      opacity: 1,
                      x: 0,
                      scale: 1,
                      transition: {
                        type: 'spring',
                        stiffness: 250,
                        damping: 20,
                      },
                    },
                  },
                }}
              >
                <div className="flex flex-col gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Dr. João Silva"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="joao@clinica.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="clinicaName">Nome da clínica</Label>
                    <Input
                      id="clinicaName"
                      type="text"
                      placeholder="Clínica Dr. João Silva"
                      value={formData.clinicaName}
                      onChange={(e) => handleInputChange('clinicaName', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="password">Senha</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required 
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="confirmPassword">Confirmar senha</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      placeholder="Digite a senha novamente"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      required 
                    />
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isProcessing || isLoading || isCreatingAccount}
                    >
                      {isCreatingAccount ? "Criando conta..." : 
                       isLoading ? (currentStep || "Configurando...") : 
                       isProcessing ? "Processando..." :
                       "Criar conta"}
                    </Button>
                    
                    <div className="text-center text-sm text-gray-600">
                      Já tem uma conta?{" "}
                      <a
                        href="/login"
                        className="underline underline-offset-4 hover:text-primary"
                      >
                        Faça login
                      </a>
                    </div>
                  </div>
                </div>
              </AnimatedGroup>
            </form>
          </CardContent>
        </Card>
      </AnimatedGroup>
      </div>
    </>
  )
}
