import { PageContainer } from "@/components/ui/page-container";
import { CertificationsHighlightSection } from "@/features/home/components/certifications-highlight-section";
import { ContactSection } from "@/features/home/components/contact-section";
import { ContributionsHighlightSection } from "@/features/home/components/contributions-highlight-section";
import { CurrentRoleSection } from "@/features/home/components/current-role-section";
import { FeaturedProjectsSection } from "@/features/home/components/featured-projects-section";
import { HeroSection } from "@/features/home/components/hero-section";
import { SkillsHighlightSection } from "@/features/home/components/skills-highlight-section";

/** Tiap section memuat datanya sendiri, jadi satu endpoint yang gagal tidak menjatuhkan halaman. */
export function HomePage() {
    return (
        <PageContainer>
            <div className="space-y-16">
                <HeroSection />
                <FeaturedProjectsSection />
                <ContributionsHighlightSection />
                <SkillsHighlightSection />
                <div className="grid gap-10 md:grid-cols-2">
                    <CurrentRoleSection />
                    <CertificationsHighlightSection />
                </div>
                <ContactSection />
            </div>
        </PageContainer>
    );
}
