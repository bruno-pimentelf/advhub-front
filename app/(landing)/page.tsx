import HeroSection from "@/components/landing/hero-section";
import ProblemSection from "@/components/landing/problem-section";
import BenefitsSection from "@/components/landing/benefits-section";
import HowItWorks from "@/components/landing/how-it-works";
import TargetAudience from "@/components/landing/target-audience";
import FeaturesSection from "@/components/landing/features-section";
import TestimonialsSection from "@/components/landing/testimonials-section";
import FAQSection from "@/components/landing/faq-section";
import CTASection from "@/components/landing/cta-section";
import ApplicationFormWrapper from "@/components/landing/application-form-wrapper";
import { NotificationsDemo } from "@/components/landing/notifications-demo";
import { StructuredData, FAQStructuredData } from "@/components/seo/structured-data";

export default function Home() {
  return (
    <>
      <StructuredData type="organization" />
      <StructuredData type="software" />
      <StructuredData type="service" />
      <FAQStructuredData />
      <HeroSection />
      <ProblemSection />
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-foreground mb-4">
              Veja o Ailum em ação
            </h2>
            <p className="text-muted-foreground">
              Notificações em tempo real do que está acontecendo na sua clínica
            </p>
          </div>
          <NotificationsDemo />
        </div>
      </section>
      <BenefitsSection />
      <HowItWorks />
      <TargetAudience />
      <FeaturesSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <ApplicationFormWrapper />
    </>
  );
}
