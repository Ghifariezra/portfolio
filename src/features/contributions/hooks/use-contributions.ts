import { useQuery } from "@tanstack/react-query";
import { closedIssuesQuery } from "@/features/contributions/api/contribution-queries";
import { toContributionView } from "@/features/contributions/lib/contribution-helpers";

/** Issue closed yang saya kerjakan, sudah dikelompokkan per repo beserta ringkasannya. */
export const useContributions = () => useQuery({ ...closedIssuesQuery(), select: toContributionView });
