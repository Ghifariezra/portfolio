import { useQuery } from "@tanstack/react-query";
import { projectQuery, projectsQuery } from "../api/project-queries";

export const useProjects = () => useQuery(projectsQuery());

export const useProject = (slug: string) => useQuery(projectQuery(slug));
