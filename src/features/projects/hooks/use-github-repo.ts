import { useQuery } from "@tanstack/react-query";
import { githubRepoQuery } from "@/features/projects/api/github-queries";

export const useGithubRepo = (repo: string) => useQuery(githubRepoQuery(repo));
