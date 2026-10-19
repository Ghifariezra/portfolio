import { PageContainer } from "@/components/ui/page-container";
import { CertificationsHighlightSection } from "../components/certifications-highlight-section";
import { ContactSection } from "../components/contact-section";
import { CurrentRoleSection } from "../components/current-role-section";
import { FeaturedProjectsSection } from "../components/featured-projects-section";
import { HeroSection } from "../components/hero-section";
import { SkillsHighlightSection } from "../components/skills-highlight-section";

/** Tiap section memuat datanya sendiri, jadi satu endpoint yang gagal tidak menjatuhkan halaman. */
export function HomePage() {
    return (
        <PageContainer>
            <div className="space-y-16">
                <HeroSection />
                <FeaturedProjectsSection />
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
