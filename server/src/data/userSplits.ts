import { NUM_USER_SPLITS } from "../config";
import { UserSplit } from "../types";

const userSplits: UserSplit[] = [];

for (let u = 0; u < NUM_USER_SPLITS; u++) {
  userSplits.push({
    id: `${u}`,
    user: u,
    firstSection: u * 3,
  });
}

export default userSplits;
