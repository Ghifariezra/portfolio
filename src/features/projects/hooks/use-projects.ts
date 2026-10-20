import { useQuery } from "@tanstack/react-query";
import { projectQuery, projectsQuery } from "@/features/projects/api/project-queries";

export const useProjects = () => useQuery(projectsQuery());

export const useProject = (slug: string) => useQuery(projectQuery(slug));
