export interface KnowledgeCard {
  id: string;
  missionId: string;
  title: string;
  problem: string;
  cause: string;
  tools: string[];
  repairSteps: string[];
  safetyTips: string[];
  tips: string[];
  unlockedAt: number;
}

export interface KnowledgeState {
  cards: KnowledgeCard[];
  notebookOpen: boolean;
  activeCardId: string | null;
}
