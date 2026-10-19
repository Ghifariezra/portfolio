import { useQuery } from "@tanstack/react-query";
import {
    certificationsQuery,
    educationQuery,
    experiencesQuery,
    profileQuery,
    skillsQuery,
} from "../api/portfolio-queries";

export const useProfile = () => useQuery(profileQuery());
export const useSkills = () => useQuery(skillsQuery());
export const useExperiences = () => useQuery(experiencesQuery());
export const useEducation = () => useQuery(educationQuery());
export const useCertifications = () => useQuery(certificationsQuery());
