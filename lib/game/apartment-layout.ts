import type { RoomDefinition, RoomId } from "@/types";

export const APARTMENT_ROOMS: Record<RoomId, RoomDefinition> = {
  bedroom: {
    id: "bedroom",
    label: "卧室",
    bounds: { x: 2, y: 5, width: 30, height: 45 },
    connections: ["dining", "study"],
    floorColor: "#e8dfd0",
    accentColor: "#8f9d8b",
  },
  study: {
    id: "study",
    label: "书房",
    bounds: { x: 15, y: 53, width: 18, height: 20 },
    connections: ["bedroom", "living"],
    floorColor: "#e8dfd0",
    accentColor: "#8f755c",
  },
  kitchen: {
    id: "kitchen",
    label: "厨房",
    bounds: { x: 35, y: 5, width: 35, height: 35 },
    connections: ["dining", "shower"],
    floorColor: "#e8dfd0",
    accentColor: "#8f9d8b",
  },
  dining: {
    id: "dining",
    label: "餐厅",
    bounds: { x: 35, y: 38, width: 35, height: 22 },
    connections: ["kitchen", "living", "bedroom", "bathroom"],
    floorColor: "#e8dfd0",
    accentColor: "#b8954f",
  },
  living: {
    id: "living",
    label: "客厅",
    bounds: { x: 35, y: 58, width: 40, height: 35 },
    connections: ["dining", "entry", "study"],
    floorColor: "#e8dfd0",
    accentColor: "#d9c28e",
  },
  entry: {
    id: "entry",
    label: "入口",
    bounds: { x: 45, y: 88, width: 20, height: 10 },
    connections: ["living"],
    floorColor: "#d9ccb8",
    accentColor: "#8f755c",
  },
  shower: {
    id: "shower",
    label: "淋浴间",
    bounds: { x: 75, y: 5, width: 23, height: 25 },
    connections: ["kitchen", "bathroom"],
    floorColor: "#cdd6cb",
    accentColor: "#748472",
  },
  bathroom: {
    id: "bathroom",
    label: "浴室",
    bounds: { x: 75, y: 28, width: 23, height: 30 },
    connections: ["dining", "shower", "laundry"],
    floorColor: "#cdd6cb",
    accentColor: "#748472",
  },
  laundry: {
    id: "laundry",
    label: "洗衣房",
    bounds: { x: 75, y: 56, width: 23, height: 42 },
    connections: ["bathroom"],
    floorColor: "#e8dfd0",
    accentColor: "#8f755c",
  },
};

export const SHOWER_REPAIR_ORDER = [
  "rub-nozzle",
  "find-vinegar",
  "soak-head",
  "rinse-head",
] as const;

export const SHOWER_MISSION_OBJECTIVES = {
  intro: "花洒好像出问题了...",
  observe: "仔细观察花洒的情况。",
  inspect: "检查堵塞的出水孔。",
  collect: "去厨房拿白醋和塑料袋。",
  repair: "清洁花洒头。",
  success: "花洒修好了！",
} as const;

export const FAILURE_HINTS = {
  wrongTool: "这个工具好像不太对。",
  wrongOrder: "换个顺序试试看。",
  noGloves: "不用戴手套也可以，但要小心。",
  maxFailures: "深呼吸，重新开始吧。",
  needVinegar: "水垢太顽固了，试试白醋吧！",
} as const;

export const SHOWER_PARTS: Record<string, { name: string; description: string; function: string }> = {
  "shower-head": {
    name: "花洒头",
    description: "主要的出水组件。",
    function: "将水以特定模式喷洒出来供沐浴使用。",
  },
  "water-valve": {
    name: "水阀",
    description: "控制流向花洒的水流。",
    function: "开关水和调节水温。",
  },
  "hose": {
    name: "软管",
    description: "连接花洒头和水管。",
    function: "让花洒头可以自由移动和调整位置。",
  },
  "nozzle": {
    name: "硅胶出水孔",
    description: "花洒头上的小橡胶开口。",
    function: "形成细密的喷水模式。",
  },
};

export const MAX_MISSION_FAILURES = 3;

export function getRoom(id: RoomId): RoomDefinition {
  return APARTMENT_ROOMS[id];
}

export function getConnectedRooms(roomId: RoomId): RoomId[] {
  return APARTMENT_ROOMS[roomId].connections;
}

export function canNavigate(from: RoomId, to: RoomId): boolean {
  return APARTMENT_ROOMS[from].connections.includes(to);
}