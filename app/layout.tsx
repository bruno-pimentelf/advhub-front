import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { AuthWrapper } from "@/components/auth/auth-wrapper";
import { GoogleTag } from "@/components/analytics/google-tag";
import { ReduxProvider } from "@/components/providers/redux-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Roboto({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ailum CRM - Sistema de Gestão para Clínicas Médicas",
    template: "%s | Ailum CRM"
  },
  description: "CRM completo para clínicas médicas com IA. Gerencie pacientes, agendamentos, funis de vendas e marketing digital. Aumente sua receita mantendo o atendimento humano.",
  keywords: [
    "CRM clínicas médicas",
    "sistema gestão clínica",
    "agendamento online",
    "marketing digital clínicas",
    "funnels vendas medicina",
    "IA para clínicas",
    "gestão pacientes",
    "software clínica médica",
    "automação marketing saúde",
    "CRM saúde"
  ],
  authors: [{ name: "Ailum CRM" }],
  creator: "Ailum CRM",
  publisher: "Ailum CRM",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ailumcrm.com.br'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://ailumcrm.com.br',
    title: 'Ailum CRM - Sistema de Gestão para Clínicas Médicas',
    description: 'CRM completo para clínicas médicas com IA. Gerencie pacientes, agendamentos, funis de vendas e marketing digital.',
    siteName: 'Ailum CRM',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ailum CRM - Sistema de Gestão para Clínicas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ailum CRM - Sistema de Gestão para Clínicas Médicas',
    description: 'CRM completo para clínicas médicas com IA. Gerencie pacientes, agendamentos, funis de vendas e marketing digital.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <GoogleTag />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <AuthProvider>
            <AuthWrapper>
              {children}
            </AuthWrapper>
          </AuthProvider>
        </ReduxProvider>
        <Toaster />
      </body>
    </html>
  );
}
