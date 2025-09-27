import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <h2 className="text-2xl font-semibold text-muted-foreground">
            Página não encontrada
          </h2>
          <p className="text-muted-foreground max-w-md">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/calendar">
              Ir para o Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              Voltar ao Início
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
