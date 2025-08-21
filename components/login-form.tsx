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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
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
                <CardTitle className="text-center">Entre na sua conta</CardTitle>
                <CardDescription className="text-center">
                  Digite seu email abaixo para entrar na sua conta
                </CardDescription>
              </AnimatedGroup>
            </div>
          </CardHeader>
          <CardContent>
            <form>
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
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="miguel@ailum.com"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Senha</Label>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Esqueceu sua senha?
                      </a>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      required 
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button 
                      type="submit" 
                      className="w-full"
                    >
                      Entrar
                    </Button>
                  </div>
                </div>
              </AnimatedGroup>
            </form>
          </CardContent>
        </Card>
      </AnimatedGroup>
    </div>
  )
}
