"use client";

import { createContext, useContext, useState, type ReactNode, type ComponentProps } from "react";
import { Picker } from "./Picker";
import type { PickerGroup } from "./types";

const PickerContext = createContext<(id: string) => void>(() => {});
export function BuildPickerProvider({ groups, children }: { groups: PickerGroup[]; children: ReactNode }) {
  const [groupId, setGroupId] = useState<string | null>(null);
  const group = groups.find((item) => item.id === groupId);
  return <PickerContext.Provider value={setGroupId}>
    {children}
    {group && <Picker key={group.id} group={group} onClose={() => setGroupId(null)} />}
  </PickerContext.Provider>;
}

export function PickerTrigger({ groupId, ...props }: ComponentProps<"button"> & { groupId: string }) {
  const choose = useContext(PickerContext);
  return <button {...props} type="button" onClick={() => choose(groupId)} />;
}
