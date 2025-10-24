import { TokenModel } from "../../DB/models/Token.model.js";
import * as DBservice from "../../DB/db.service.js"

export const deleteallExpired = async () => {
  const now = new Date();

  const result = await DBservice.deleteMany({
    model: TokenModel,
    filter: { expiresAt: { $lte: now } },
  });

  console.log(`[Cron] Deleted ${result.deletedCount} expired tokens at ${now.toISOString()}`);
};