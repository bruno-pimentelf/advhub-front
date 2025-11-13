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
    default: "Advhub - Plataforma de Gestão Jurídica com IA",
    template: "%s | Advhub"
  },
  description: "Plataforma completa para advogados com IA. Automatize atendimento, gestão de contratos, relacionamento com clientes e funis de vendas. Aumente conversões e otimize seu tempo.",
  keywords: [
    "gestão jurídica",
    "software para advogados",
    "automação jurídica",
    "CRM advogados",
    "gestão de contratos",
    "IA para escritórios",
    "atendimento jurídico",
    "funis vendas jurídicos",
    "automação escritório advocacia",
    "tecnologia jurídica"
  ],
  authors: [{ name: "Advhub" }],
  creator: "Advhub",
  publisher: "Advhub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://advhub.com.br'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://advhub.com.br',
    title: 'Advhub - Plataforma de Gestão Jurídica com IA',
    description: 'Plataforma completa para advogados com IA. Automatize atendimento, gestão de contratos, relacionamento com clientes e funis de vendas.',
    siteName: 'Advhub',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Advhub - Plataforma de Gestão Jurídica',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advhub - Plataforma para Advogados com IA',
    description: 'Plataforma completa para advogados com IA. Automatize atendimento, gestão de contratos, relacionamento com clientes e funis de vendas.',
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
