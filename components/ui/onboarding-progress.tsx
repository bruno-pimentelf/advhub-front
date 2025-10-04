import { cn } from "@/lib/utils"
import { LoadingSpinner } from "./loading-spinner"
import { Progress } from "./progress"

interface OnboardingProgressProps {
  currentStep: string
  isLoading: boolean
  className?: string
}

// Mapear os steps para um progresso visual
const getStepProgress = (step: string): number => {
  if (step.includes("Firebase")) return 10
  if (step.includes("Processando")) return 20
  if (step.includes("Criando perfil")) return 30
  if (step.includes("Criando clínica")) return 45
  if (step.includes("Configurando funil")) return 60
  if (step.includes("Criando estágios")) {
    // Extrair progresso dos estágios (1/5, 2/5, etc.)
    const match = step.match(/\((\d+)\/(\d+)\)/)
    if (match) {
      const current = parseInt(match[1])
      const total = parseInt(match[2])
      return 60 + (current / total) * 25 // 60% a 85%
    }
    return 70
  }
  if (step.includes("Finalizando")) return 90
  if (step.includes("Redirecionando")) return 100
  return 5 // Progresso mínimo quando não há step específico
}

export function OnboardingProgress({ 
  currentStep, 
  isLoading, 
  className 
}: OnboardingProgressProps) {
  // Mostrar o loading se estiver carregando OU se tiver um step atual
  if (!isLoading && !currentStep) return null

  const progress = getStepProgress(currentStep)

  return (
    <div className={cn(
      "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center",
      className
    )}>
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <div className="text-center w-full">
            <h3 className="font-semibold text-gray-900 mb-2">
              Configurando sua conta
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {currentStep || "Configurando sua conta..."}
            </p>
            <div className="w-full">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-gray-500 mt-2 text-center">
                {progress}% concluído
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
