import { create } from "zustand";
import type { KnowledgeCard, KnowledgeState } from "@/types";

const SHOWER_KNOWLEDGE_CARD: Omit<KnowledgeCard, "id" | "unlockedAt"> = {
  missionId: "shower",
  title: "花洒维修技能卡",
  problem: "花洒出水孔堵、水流变小、分叉乱喷",
  cause: "自来水水垢堵住出水硅胶孔",
  tools: ["白醋", "塑料袋"],
  repairSteps: [
    "用手指搓洗每个硅胶出水嘴，软垢在搓洗后将脱落",
    "若发现堵塞严重：将白醋导入塑料袋，将花洒头拆下放进塑料袋浸泡，静置30分钟，拿水冲干净即可",
  ],
  safetyTips: [
    "白醋有刺激性气味，请保持通风",
    "清洗后用清水充分冲洗花洒",
  ],
  tips: [
    "白醋与水的比例约为1:1",
    "浸泡时间根据堵塞程度调整",
  ],
};

const WIFI_KNOWLEDGE_CARD: Omit<KnowledgeCard, "id" | "unlockedAt"> = {
  missionId: "wifi",
  title: "WiFi连接技能卡",
  problem: "WiFi已连接但无法上网",
  cause: "网线插错接口（插在LAN口而非WAN口）",
  tools: ["网线"],
  repairSteps: [
    "检查路由器背面的网线接口",
    "蓝色口为WAN口，用于连接宽带网线",
    "黄色口为LAN口，用于连接电脑或机顶盒",
    "将网线从LAN口拔出，插入WAN口",
    "等待路由器重新连接即可",
  ],
  safetyTips: [
    "插拔网线时动作要轻",
    "确保路由器已通电",
  ],
  tips: [
    "通常WAN口为蓝色，LAN口为黄色",
    "更换接口后等待1-2分钟让路由器重新连接",
  ],
};

const LIGHTING_KNOWLEDGE_CARD: Omit<KnowledgeCard, "id" | "unlockedAt"> = {
  missionId: "lighting",
  title: "LED吸顶灯维修技能卡",
  problem: "客厅吸顶灯突然不亮",
  cause: "单颗LED灯珠短路导致整块灯板断路保护",
  tools: ["人字梯", "数显测电笔", "十字螺丝刀", "小零件收纳盒", "全新LED灯珠板"],
  repairSteps: [
    "检查配电箱，确认照明回路空开未跳闸后手动拉下断电",
    "准备人字梯、测电笔、十字螺丝刀、收纳盒和新LED灯珠板",
    "测试测电笔功能，确保工具正常",
    "登梯拆卸灯罩，用测电笔验电确认断电",
    "观察灯珠表面，确认故障位置",
    "拔开连接线，拧下螺丝，拆除旧灯珠板",
    "安装新灯珠板，拧紧螺丝，插紧连接线",
    "装回灯罩，恢复供电，测试灯光",
  ],
  safetyTips: [
    "维修前务必关闭电源",
    "使用测电笔双重确认断电",
    "梯子放置要平稳",
    "更换灯珠板时注意极性",
  ],
  tips: [
    "换灯珠板时注意对齐螺丝孔位",
    "螺丝要收入收纳盒，防止丢失",
  ],
};

const HOTEL_KNOWLEDGE_CARD: Omit<KnowledgeCard, "id" | "unlockedAt"> = {
  missionId: "hotel",
  title: "防偷拍检查技能卡",
  problem: "入住酒店时担心房间存在偷拍设备",
  cause: "不法分子可能在酒店房间安装隐蔽摄像头",
  tools: ["手机"],
  repairSteps: [
    "关闭房间主灯，拉上窗帘，保持房间较暗",
    "打开手机相机，缓慢移动镜头检查各个角落",
    "重点检查：插座面板、电视、空调、烟雾报警器、浴室等",
    "如发现红色发光点、异常小孔等可疑设备，保留现场",
    "联系酒店前台，如怀疑涉及偷拍可报警处理",
  ],
  safetyTips: [
    "不建议自行拆卸或破坏疑似偷拍设备",
    "保留现场、拍照记录，由专业人员处理",
    "入住时选择正规酒店",
  ],
  tips: [
    "较暗环境能帮助观察设备发出的微弱光点",
    "但不是所有偷拍设备都会发光，不能仅依赖这一方法",
    "烟雾报警器等设备若有异常小孔正对床铺需特别警惕",
  ],
};

const initialState: KnowledgeState = {
  cards: [],
  notebookOpen: false,
  activeCardId: null,
};

interface KnowledgeStoreActions {
  unlockShowerCard: () => KnowledgeCard;
  unlockWifiCard: () => KnowledgeCard;
  unlockLightingCard: () => KnowledgeCard;
  unlockHotelCard: () => KnowledgeCard;
  openNotebook: (cardId?: string) => void;
  closeNotebook: () => void;
  hasCard: (missionId: string) => boolean;
  getCardByMission: (missionId: string) => KnowledgeCard | undefined;
  getSnapshot: () => KnowledgeCard[];
  hydrate: (cards: KnowledgeCard[]) => void;
}

export const useKnowledgeStore = create<KnowledgeState & KnowledgeStoreActions>((set, get) => ({
  ...initialState,

  unlockShowerCard: () => {
    const existing = get().cards.find((c) => c.missionId === "shower");
    if (existing) return existing;

    const card: KnowledgeCard = {
      ...SHOWER_KNOWLEDGE_CARD,
      id: `knowledge-shower-${Date.now()}`,
      unlockedAt: Date.now(),
    };

    set((state) => ({ cards: [...state.cards, card] }));
    return card;
  },

  unlockWifiCard: () => {
    const existing = get().cards.find((c) => c.missionId === "wifi");
    if (existing) return existing;

    const card: KnowledgeCard = {
      ...WIFI_KNOWLEDGE_CARD,
      id: `knowledge-wifi-${Date.now()}`,
      unlockedAt: Date.now(),
    };

    set((state) => ({ cards: [...state.cards, card] }));
    return card;
  },

  unlockLightingCard: () => {
    const existing = get().cards.find((c) => c.missionId === "lighting");
    if (existing) return existing;

    const card: KnowledgeCard = {
      ...LIGHTING_KNOWLEDGE_CARD,
      id: `knowledge-lighting-${Date.now()}`,
      unlockedAt: Date.now(),
    };

    set((state) => ({ cards: [...state.cards, card] }));
    return card;
  },

  unlockHotelCard: () => {
    const existing = get().cards.find((c) => c.missionId === "hotel");
    if (existing) return existing;

    const card: KnowledgeCard = {
      ...HOTEL_KNOWLEDGE_CARD,
      id: `knowledge-hotel-${Date.now()}`,
      unlockedAt: Date.now(),
    };

    set((state) => ({ cards: [...state.cards, card] }));
    return card;
  },

  openNotebook: (cardId) =>
    set((state) => ({
      notebookOpen: true,
      activeCardId: cardId ?? null,
    })),

  closeNotebook: () => set({ notebookOpen: false, activeCardId: null }),

  hasCard: (missionId) => get().cards.some((c) => c.missionId === missionId),

  getCardByMission: (missionId) => get().cards.find((c) => c.missionId === missionId),

  getSnapshot: () => get().cards,

  hydrate: (cards) => set({ cards }),
}));

export { SHOWER_KNOWLEDGE_CARD };
