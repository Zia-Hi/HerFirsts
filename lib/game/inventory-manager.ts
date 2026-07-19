import { useInventoryStore } from "@/store/inventory-store";
import { TOOLBOX_TOOLS, getTool, isRequiredForShower } from "./tools";
import type { InventoryItem, ToolId } from "@/types";

class InventoryManagerService {
  pickUp(toolId: ToolId): boolean {
    return useInventoryStore.getState().pickUpTool(toolId);
  }

  putDown(): void {
    useInventoryStore.getState().putDownTool();
  }

  select(toolId: ToolId | null): void {
    useInventoryStore.getState().selectHeldItem(toolId);
  }

  has(toolId: ToolId): boolean {
    return useInventoryStore.getState().hasTool(toolId);
  }

  openToolbox(): void {
    useInventoryStore.getState().openToolbox();
  }

  closeToolbox(): void {
    useInventoryStore.getState().closeToolbox();
  }

  getHeldItem(): ToolId | null {
    return useInventoryStore.getState().heldItem;
  }

  getItems(): InventoryItem[] {
    return useInventoryStore.getState().items;
  }

  getAvailableToolboxTools(): ToolId[] {
    const collected = useInventoryStore.getState().items;
    return TOOLBOX_TOOLS.filter((t) => !collected.some((item) => item.id === t));
  }

  canPickTool(toolId: ToolId): boolean {
    return !useInventoryStore.getState().items.some((item) => item.id === toolId);
  }

  isRequiredForCurrentMission(toolId: ToolId): boolean {
    return isRequiredForShower(toolId);
  }

  getToolInfo(toolId: ToolId) {
    return getTool(toolId);
  }

  clear(): void {
    useInventoryStore.getState().clearInventory();
  }
}

export const inventoryManager = new InventoryManagerService();
