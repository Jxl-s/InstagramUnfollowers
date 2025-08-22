import { UserNode } from "../model/user";
import { ChangeEntry, ChangeType } from "../model/change-entry";
import { FOLLOWERS_HISTORY_STORAGE_KEY, FOLLOWINGS_HISTORY_STORAGE_KEY, LAST_SCAN_DATE_STORAGE_KEY } from "../constants/constants";

export function detectChanges(
  currentFollowings: readonly UserNode[],
  previousFollowings: readonly UserNode[],
  currentFollowers: readonly UserNode[],
  previousFollowers: readonly UserNode[]
): readonly ChangeEntry[] {
  const changes: ChangeEntry[] = [];
  const now = Date.now();
  const dateStr = new Date().toISOString().split('T')[0];

  // Only detect changes if we have previous data
  if (previousFollowings.length === 0 && previousFollowers.length === 0) {
    return changes;
  }

  // Detect new followings (people you started following)
  const newFollowings = currentFollowings.filter(
    current => !previousFollowings.some(prev => prev.id === current.id)
  );
  newFollowings.forEach(user => {
    changes.push({
      user,
      changeType: "new_following",
      timestamp: now,
      date: dateStr
    });
  });

  // Detect new unfollowings (people you stopped following)
  const newUnfollowings = previousFollowings.filter(
    prev => !currentFollowings.some(current => current.id === prev.id)
  );
  newUnfollowings.forEach(user => {
    changes.push({
      user,
      changeType: "new_unfollowing",
      timestamp: now,
      date: dateStr
    });
  });

  // Detect new followers (people who started following you)
  const newFollowers = currentFollowers.filter(
    current => !previousFollowers.some(prev => prev.id === current.id)
  );
  newFollowers.forEach(user => {
    changes.push({
      user,
      changeType: "new_follower",
      timestamp: now,
      date: dateStr
    });
  });

  // Detect new unfollowers (people who stopped following you)
  const newUnfollowers = previousFollowers.filter(
    prev => !currentFollowers.some(current => current.id === prev.id)
  );
  newUnfollowers.forEach(user => {
    changes.push({
      user,
      changeType: "new_unfollower",
      timestamp: now,
      date: dateStr
    });
  });

  return changes;
}

export function saveScanHistory(
  followers: readonly UserNode[],
  followings: readonly UserNode[]
): void {
  const dateStr = new Date().toISOString().split('T')[0];

  // Save to localStorage
  localStorage.setItem(LAST_SCAN_DATE_STORAGE_KEY, dateStr);
  localStorage.setItem(FOLLOWERS_HISTORY_STORAGE_KEY, JSON.stringify(followers));
  localStorage.setItem(FOLLOWINGS_HISTORY_STORAGE_KEY, JSON.stringify(followings));
}

export function loadPreviousScanData(): {
  followers: readonly UserNode[];
  followings: readonly UserNode[];
  lastScanDate?: string;
} {
  const lastScanDate = localStorage.getItem(LAST_SCAN_DATE_STORAGE_KEY);
  const followersData = localStorage.getItem(FOLLOWERS_HISTORY_STORAGE_KEY);
  const followingsData = localStorage.getItem(FOLLOWINGS_HISTORY_STORAGE_KEY);

  return {
    followers: followersData ? JSON.parse(followersData) : [],
    followings: followingsData ? JSON.parse(followingsData) : [],
    lastScanDate: lastScanDate || undefined
  };
}

export function loadChangeHistory(): readonly ChangeEntry[] {
  const changeHistoryData = localStorage.getItem('iu_change-history');
  return changeHistoryData ? JSON.parse(changeHistoryData) : [];
}

export function saveChangeHistory(changes: readonly ChangeEntry[]): void {
  const existingHistory = loadChangeHistory();
  const updatedHistory = [...existingHistory, ...changes];
  localStorage.setItem('iu_change-history', JSON.stringify(updatedHistory));
}

export function getChangesForDate(
  changeHistory: readonly ChangeEntry[],
  date: string
): readonly ChangeEntry[] {
  return changeHistory.filter(change => change.date === date);
}

export function getAvailableDates(changeHistory: readonly ChangeEntry[]): readonly string[] {
  const dates = new Set(changeHistory.map(change => change.date));
  return Array.from(dates).sort().reverse(); // Most recent first
}

export function getChangeTypeLabel(changeType: ChangeType): string {
  switch (changeType) {
    case "new_follower":
      return "New Follower";
    case "new_unfollower":
      return "New Unfollower";
    case "new_following":
      return "New Following";
    case "new_unfollowing":
      return "New Unfollowing";
    default:
      return changeType;
  }
}

export function getChangeTypeIcon(changeType: ChangeType): string {
  switch (changeType) {
    case "new_follower":
      return "➕";
    case "new_unfollower":
      return "➖";
    case "new_following":
      return "➕";
    case "new_unfollowing":
      return "➖";
    default:
      return "•";
  }
} 