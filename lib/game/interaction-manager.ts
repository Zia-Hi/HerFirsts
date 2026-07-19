import type { Interactable, InteractableId, InteractionHit, Vector2 } from "@/types";

class InteractionManagerService {
  private interactables = new Map<InteractableId, Interactable>();
  private enabled = true;

  register(interactable: Interactable): void {
    this.interactables.set(interactable.id, interactable);
  }

  unregister(interactableId: InteractableId): void {
    this.interactables.delete(interactableId);
  }

  get(interactableId: InteractableId): Interactable | undefined {
    return this.interactables.get(interactableId);
  }

  getAll(): Interactable[] {
    return Array.from(this.interactables.values());
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  clear(): void {
    this.interactables.clear();
  }

  hitTest(position: Vector2): InteractionHit | null {
    if (!this.enabled) {
      return null;
    }

    const candidates = this.getAll()
      .filter((interactable) => interactable.enabled)
      .filter((interactable) => this.isWithinBounds(position, interactable.bounds))
      .sort((a, b) => b.priority - a.priority);

    const hit = candidates[0];
    if (!hit) {
      return null;
    }

    return { interactable: hit, position };
  }

  interact(position: Vector2): InteractionHit | null {
    const hit = this.hitTest(position);
    if (!hit) {
      return null;
    }

    hit.interactable.onInteract(position);
    return hit;
  }

  private isWithinBounds(
    position: Vector2,
    bounds: Interactable["bounds"],
  ): boolean {
    return (
      position.x >= bounds.x &&
      position.x <= bounds.x + bounds.width &&
      position.y >= bounds.y &&
      position.y <= bounds.y + bounds.height
    );
  }
}

export const interactionManager = new InteractionManagerService();
