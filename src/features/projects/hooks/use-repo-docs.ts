import { useQuery } from "@tanstack/react-query";
import { repoDocsQuery } from "@/features/projects/api/docs-queries";

export const useRepoDocs = (repo: string) => useQuery(repoDocsQuery(repo));
