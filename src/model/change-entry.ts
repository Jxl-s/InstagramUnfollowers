import { UserNode } from "./user";

export type ChangeType = "new_follower" | "new_unfollower" | "new_following" | "new_unfollowing";

export interface ChangeEntry {
  readonly user: UserNode;
  readonly changeType: ChangeType;
  readonly timestamp: number;
  readonly date: string; // ISO date string for easier filtering
} 