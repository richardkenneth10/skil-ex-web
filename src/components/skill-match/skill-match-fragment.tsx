import Constants from "@/utils/constants";
import logger from "@/utils/logger";
import axios from "@/utils/server-axios";
import ClientCookie from "../(main)/client-cookie";
import { Match } from "../home/home-fragment";
import ClientSkillMatchFragment from "./client-skill-match-fragment";

export default async function SkillMatchFragment({
  otherUserId,
  offeredSkillId,
  wantedSkillId,
}: {
  otherUserId: string;
  offeredSkillId: string;
  wantedSkillId: string;
}) {
  const res = await axios.get(
    `/skills/match/?otherUserId=${otherUserId}&offeredSkillId=${offeredSkillId}&wantedSkillId=${wantedSkillId}`
  );
  const match: Match = res.data;
  logger.info(match);

  return (
    <>
      <ClientCookie
        tokensJSONString={res.config.headers[Constants.authTokensHeaderKey]}
      />
      <ClientSkillMatchFragment match={match} />;
    </>
  );
}
