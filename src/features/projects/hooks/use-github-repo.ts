import { useQuery } from "@tanstack/react-query";
import { githubRepoQuery } from "../api/github-queries";

export const useGithubRepo = (repo: string) => useQuery(githubRepoQuery(repo));
