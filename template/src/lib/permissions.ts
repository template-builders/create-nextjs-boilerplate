import { createAccessControl, Statements } from "better-auth/plugins/access";
import { defaultStatements, adminAc, userAc } from "better-auth/plugins/admin/access";

type ProjectActions = "create" | "update" | "delete" | "read" | "share"

interface CustomStatements extends Statements {
    project: ProjectActions[]
}

export const statements: CustomStatements = {
    ...defaultStatements,
    project: ["create", "update", "delete", "read", "share"]
}

export const accessControl = createAccessControl(statements)

export const userRole = accessControl.newRole({
    ...userAc.statements,
    project: ["read"]
})

export const moderatorRole = accessControl.newRole({
    ...userAc.statements,
    user: ["update", "list", "set-password", "impersonate", "ban", "get"],
    project: ["read", "update", "share"],
    session: ["revoke", "list", "delete"]
})

export const adminRole = accessControl.newRole({
    ...adminAc.statements,
    project: ["create", "update", "delete", "read", "share"]
})