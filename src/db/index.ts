import { account } from "./schemas/account";
import { session } from "./schemas/session";
import { user } from "./schemas/user";
import { verification } from "./schemas/verification";

export const db = {
    user,
    account,
    session,
    verification
}