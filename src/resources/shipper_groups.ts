import { RecordModel } from "pocketbase";

export type ShipperGroupModel = RecordModel & {
  id: string;
  code: string;
  name: string;
  description?: string;
  status: boolean;
  created: Date;
  updated: Date;
};
