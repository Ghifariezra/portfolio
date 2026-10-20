import { PageContainer } from "@/components/ui/page-container";
import { CertificationsSection } from "@/features/portfolio/components/certifications-section";
import { EducationSection } from "@/features/portfolio/components/education-section";
import { ExperienceSection } from "@/features/portfolio/components/experience-section";
import { ProfileHeader } from "@/features/portfolio/components/profile-header";
import { SkillsSection } from "@/features/portfolio/components/skills-section";

/** Tiap section memuat datanya sendiri, jadi satu endpoint yang gagal tidak menjatuhkan halaman. */
export function AboutPage() {
    return (
        <PageContainer>
            <div className="space-y-14">
                <ProfileHeader />
                <SkillsSection />
                <ExperienceSection />
                <EducationSection />
                <CertificationsSection />
            </div>
        </PageContainer>
    );
}
