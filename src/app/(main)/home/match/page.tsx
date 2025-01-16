import SkillMatchFragment from "@/components/skill-match/skill-match-fragment";
import { use } from "react";

export default function SkillMatchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { otherUserId, offeredSkillId, wantedSkillId } = use(searchParams);

  return (
    <SkillMatchFragment
      otherUserId={otherUserId}
      offeredSkillId={offeredSkillId}
      wantedSkillId={wantedSkillId}
    />
  );
}
