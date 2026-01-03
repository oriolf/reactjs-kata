import type { Session } from "./Session";

export type User = {
  id: number;
  email: string;
  roles: string[];
  sessions: Session[];
};
