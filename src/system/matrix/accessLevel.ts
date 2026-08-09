/**
 * How much access a Runner has on a given `MatrixNode` — see CONTEXT.md's **Access Level**
 * glossary entry. `public` needs no hacking test at all; `user`/`security`/`admin` each add their
 * own offset (+0/+3/+6) to the displayed hacking threshold; `none` means no access of any kind.
 */
export enum AccessLevel {
  none = "none",
  public = "public",
  user = "user",
  security = "security",
  admin = "admin",
}

export const AccessLevelLabels: Record<AccessLevel, string> = {
  [AccessLevel.none]: "None",
  [AccessLevel.public]: "Public",
  [AccessLevel.user]: "User",
  [AccessLevel.security]: "Security",
  [AccessLevel.admin]: "Admin",
}
