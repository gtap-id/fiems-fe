import { PropsWithChildren } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function AuthGuard(props: PropsWithChildren) {
  const isAuthFinish = useAuth();

  return isAuthFinish ? props.children : false;
}
