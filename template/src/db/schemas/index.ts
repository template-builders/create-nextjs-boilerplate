import * as authTables from "./auth"
import * as planTables from "./usage"
import * as relationSchemas from "./relations"

export const schemaTables = {
    ...authTables,
    ...planTables,
    ...relationSchemas
}