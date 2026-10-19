import { PageContainer } from "@/components/ui/page-container";
import { CertificationsSection } from "../components/certifications-section";
import { EducationSection } from "../components/education-section";
import { ExperienceSection } from "../components/experience-section";
import { ProfileHeader } from "../components/profile-header";
import { SkillsSection } from "../components/skills-section";

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
