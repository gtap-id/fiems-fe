import { RecordModel } from "pocketbase";
import { ShipperGroupModel } from "./shipper_groups";

export type CustomerType = "shipper" | "vendor" | "shipping";

export type CustomerModel = RecordModel & {
  id: string;
  type: CustomerType;
  code: string;
  group: string;
  name: string;
  address: string;
  province: string;
  city: string;
  npwp: string;
  telephone: string;
  fax: string;
  email: string;
  top: number;
  currency: string;
  purchasingName: string;
  purchasingEmail: string;
  purchasingTelephone: string;
  purchasingFax: string;
  operationName: string;
  operationEmail: string;
  operationTelephone: string;
  operationFax: string;
  financeName: string;
  financeEmail: string;
  financeTelephone: string;
  financeFax: string;
  status: boolean;
  created: Date;
  updated: Date;
  expand?: {
    group?: ShipperGroupModel;
  };
};
