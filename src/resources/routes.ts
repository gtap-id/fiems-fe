import { RecordModel } from "pocketbase";

export type RouteModel = RecordModel & {
  id: string;
  code: string;
  province: string;
  city: string;
  startDescription: string;
  endDescription: string;
  status: boolean;
  created: Date;
  updated: Date;
};
