import { api, useUserLogoutMutation } from "@/shared/api/apiSlice";
import { useAppDispatch } from "../hooks";
import { actionLogoutUser } from "@/entities/user/model/userSlice";
import { useRouter } from "next/navigation";
import { actionClearGroupsState } from "@/features/modulesPageComponents/model/moduleGroupsSlice";

export function useLogout() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [handleUserLogout] = useUserLogoutMutation();

  const handleLogout = async () => {
    api.util.resetApiState();
    dispatch(actionLogoutUser());
    dispatch(actionClearGroupsState());

    await handleUserLogout();

    router.push("/signin");
    router.refresh();
  };

  return handleLogout;
}
