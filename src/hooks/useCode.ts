import { useEffect, useState } from "react";
import { pb } from "../libs/pocketbase";

export function useCode(collectionName: string, prefix: string) {
  const [code, setCode] = useState<string>();

  useEffect(() => {
    pb.collection(collectionName)
      .getList(1, 1, { sort: "-code", skipTotal: true })
      .then((list) => {
        if (list.totalItems < 1) {
          setCode(prefix + "0001");
          return;
        }
        const latestCode = list.items[0].code;

        setCode(
          prefix +
            (Number(latestCode.slice(-4)) + 1).toString().padStart(4, "0")
        );
      });
  }, [collectionName, prefix]);

  return code;
}
