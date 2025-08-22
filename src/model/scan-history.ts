import { UserNode } from "./user";
import { ChangeEntry } from "./change-entry";

export interface ScanHistoryEntry {
  readonly date: string; // ISO date string
  readonly timestamp: number;
  readonly followers: readonly UserNode[];
  readonly followings: readonly UserNode[];
}

export interface ChangeHistory {
  readonly entries: readonly ChangeEntry[];
  readonly scanHistory: readonly ScanHistoryEntry[];
} 