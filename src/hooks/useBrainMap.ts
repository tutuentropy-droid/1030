import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  brainRegions,
  getBrainRegionsByExperiment,
  type BrainRegion,
} from "@/data/brainRegions";

const STORAGE_KEYS = {
  completedExperiments: "neuro_museum_completed_experiments",
  unlockedRegions: "neuro_museum_unlocked_regions",
  newlyUnlocked: "neuro_museum_newly_unlocked",
};

function safeRead<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export interface UseBrainMapReturn {
  completedExperiments: string[];
  unlockedRegions: string[];
  newlyUnlockedRegions: BrainRegion[];
  isExperimentCompleted: (id: string) => boolean;
  isRegionUnlocked: (id: string) => boolean;
  completeExperiment: (experimentId: string) => BrainRegion[];
  clearNewlyUnlocked: () => void;
  completionStats: {
    completedExperiments: number;
    totalExperiments: number;
    unlockedRegions: number;
    totalRegions: number;
  };
  resetProgress: () => void;
}

export function useBrainMap(): UseBrainMapReturn {
  const [completedExperiments, setCompletedExperiments] = useState<string[]>(
    () => safeRead<string[]>(STORAGE_KEYS.completedExperiments, [])
  );

  const [unlockedRegions, setUnlockedRegions] = useState<string[]>(() =>
    safeRead<string[]>(STORAGE_KEYS.unlockedRegions, [])
  );

  const [newlyUnlockedRegionIds, setNewlyUnlockedRegionIds] = useState<string[]>(
    () => safeRead<string[]>(STORAGE_KEYS.newlyUnlocked, [])
  );

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem(
      STORAGE_KEYS.completedExperiments,
      JSON.stringify(completedExperiments)
    );
  }, [completedExperiments, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem(
      STORAGE_KEYS.unlockedRegions,
      JSON.stringify(unlockedRegions)
    );
  }, [unlockedRegions, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem(
      STORAGE_KEYS.newlyUnlocked,
      JSON.stringify(newlyUnlockedRegionIds)
    );
  }, [newlyUnlockedRegionIds, isInitialized]);

  const isExperimentCompleted = useCallback(
    (id: string) => completedExperiments.includes(id),
    [completedExperiments]
  );

  const isRegionUnlocked = useCallback(
    (id: string) => unlockedRegions.includes(id),
    [unlockedRegions]
  );

  const unlockedRef = useRef<string[]>(unlockedRegions);
  const completedRef = useRef<string[]>(completedExperiments);

  useEffect(() => {
    unlockedRef.current = unlockedRegions;
  }, [unlockedRegions]);

  useEffect(() => {
    completedRef.current = completedExperiments;
  }, [completedExperiments]);

  const completeExperiment = useCallback(
    (experimentId: string): BrainRegion[] => {
      const isAlreadyDone = completedRef.current.includes(experimentId);

      if (!isAlreadyDone) {
        setCompletedExperiments((prev) =>
          prev.includes(experimentId) ? prev : [...prev, experimentId]
        );
      }

      const relatedRegions = getBrainRegionsByExperiment(experimentId);
      const newlyUnlocked = isAlreadyDone
        ? []
        : relatedRegions.filter((r) => !unlockedRef.current.includes(r.id));

      if (newlyUnlocked.length > 0) {
        setUnlockedRegions((prev) => {
          const ids = new Set(prev);
          newlyUnlocked.forEach((r) => ids.add(r.id));
          return Array.from(ids);
        });
        setNewlyUnlockedRegionIds(newlyUnlocked.map((r) => r.id));
      }

      return newlyUnlocked;
    },
    []
  );

  const clearNewlyUnlocked = useCallback(() => {
    setNewlyUnlockedRegionIds([]);
  }, []);

  const completionStats = useMemo(
    () => ({
      completedExperiments: completedExperiments.length,
      totalExperiments: 5,
      unlockedRegions: unlockedRegions.length,
      totalRegions: brainRegions.length,
    }),
    [completedExperiments.length, unlockedRegions.length]
  );

  const resetProgress = useCallback(() => {
    setCompletedExperiments([]);
    setUnlockedRegions([]);
    setNewlyUnlockedRegionIds([]);
  }, []);

  const newlyUnlockedRegions = useMemo(
    () => brainRegions.filter((r) => newlyUnlockedRegionIds.includes(r.id)),
    [newlyUnlockedRegionIds]
  );

  return {
    completedExperiments,
    unlockedRegions,
    newlyUnlockedRegions,
    isExperimentCompleted,
    isRegionUnlocked,
    completeExperiment,
    clearNewlyUnlocked,
    completionStats,
    resetProgress,
  };
}
