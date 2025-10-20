import * as authTables from "./auth"
import * as planTables from "./plan"

export const schemaTables = {
    ...authTables,
    ...planTables
}