// src/redis/keys/invite.keys.ts
export const adminInviteKey = (token: string) =>
  `admin_invite:${token}`;
