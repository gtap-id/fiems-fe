import { ClientResponseError } from "pocketbase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pb } from "../libs/pocketbase";

// cek apakah client punya token dan valid (sudah login dengan benar)
export function useAuth(): boolean {
  const navigate = useNavigate();

  const [isFinish, setIsFinish] = useState(false);

  useEffect(() => {
    pb.collection("users")
      .authRefresh()
      .catch((err) => {
        if (err instanceof ClientResponseError && err.status === 401) {
          navigate("/login");
        }
      })
      .finally(() => {
        setIsFinish(true);
      });
  }, [navigate]);

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange(async () => {
      if (!pb.authStore.isValid || !pb.authStore.token) {
        navigate("/login");
      }
    }, true);

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  return isFinish;
}
