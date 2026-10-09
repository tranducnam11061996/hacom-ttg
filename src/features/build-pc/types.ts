import type { buildData } from "@/data";
export type ComponentGroup = (typeof buildData.groups)[number];
export type SelectedComponent = ComponentGroup["items"][number];
export type PickerProduct = ComponentGroup["picker"]["products"][number];
