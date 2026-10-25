import { useQuery } from "@tanstack/react-query";
import { postmanCollectionQuery } from "@/features/projects/api/postman-queries";

export const usePostmanCollection = (repo: string) => useQuery(postmanCollectionQuery(repo));
