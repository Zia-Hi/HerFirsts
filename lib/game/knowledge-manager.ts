import { useKnowledgeStore } from "@/store/knowledge-store";
import type { KnowledgeCard } from "@/types";

class KnowledgeManagerService {
  unlockShowerCard(): KnowledgeCard {
    return useKnowledgeStore.getState().unlockShowerCard();
  }

  openNotebook(cardId?: string): void {
    useKnowledgeStore.getState().openNotebook(cardId);
  }

  closeNotebook(): void {
    useKnowledgeStore.getState().closeNotebook();
  }

  hasCard(missionId: string): boolean {
    return useKnowledgeStore.getState().hasCard(missionId);
  }

  getCardByMission(missionId: string): KnowledgeCard | undefined {
    return useKnowledgeStore.getState().getCardByMission(missionId);
  }

  getAllCards(): KnowledgeCard[] {
    return useKnowledgeStore.getState().cards;
  }

  isNotebookOpen(): boolean {
    return useKnowledgeStore.getState().notebookOpen;
  }
}

export const knowledgeManager = new KnowledgeManagerService();
