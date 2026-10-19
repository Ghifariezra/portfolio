import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { STALE_TIME } from "@/config/cache";
import { fetchPublic } from "@/lib/api";
import { certificationSchema } from "../schemas/certification.schema";
import { educationSchema } from "../schemas/education.schema";
import { experienceSchema } from "../schemas/experience.schema";
import { profileSchema } from "../schemas/profile.schema";
import { skillSchema } from "../schemas/skill.schema";

// Belum dipakai halaman mana pun; disiapkan untuk Home.

export const portfolioKeys = {
    profile: ["portfolio", "profile"] as const,
    skills: ["portfolio", "skills"] as const,
    experiences: ["portfolio", "experiences"] as const,
    education: ["portfolio", "education"] as const,
    certifications: ["portfolio", "certifications"] as const,
};

export const profileQuery = () =>
    queryOptions({
        queryKey: portfolioKeys.profile,
        queryFn: ({ signal }) => fetchPublic("/profile", profileSchema, signal),
        staleTime: STALE_TIME.PORTFOLIO,
    });

export const skillsQuery = () =>
    queryOptions({
        queryKey: portfolioKeys.skills,
        queryFn: ({ signal }) => fetchPublic("/skills", z.array(skillSchema), signal),
        staleTime: STALE_TIME.PORTFOLIO,
    });

export const experiencesQuery = () =>
    queryOptions({
        queryKey: portfolioKeys.experiences,
        queryFn: ({ signal }) => fetchPublic("/experiences", z.array(experienceSchema), signal),
        staleTime: STALE_TIME.PORTFOLIO,
    });

export const educationQuery = () =>
    queryOptions({
        queryKey: portfolioKeys.education,
        queryFn: ({ signal }) => fetchPublic("/education", z.array(educationSchema), signal),
        staleTime: STALE_TIME.PORTFOLIO,
    });

export const certificationsQuery = () =>
    queryOptions({
        queryKey: portfolioKeys.certifications,
        queryFn: ({ signal }) => fetchPublic("/certifications", z.array(certificationSchema), signal),
        staleTime: STALE_TIME.PORTFOLIO,
    });
