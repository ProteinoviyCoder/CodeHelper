"use client";

import { FC, memo, ReactNode, useEffect, useState } from "react";
import { useLazyUserLoginByTokenQuery } from "../api/authProviderEndpoints";
import { useAppDispatch, useAppSelector } from "@/shared/model/hooks";
import { actionSetUserData } from "@/entities/user/model/userSlice";
import { Loader } from "@/shared/ui/loader/loader";

type AuthProviderInitialProps = {
  children: ReactNode;
};

const AuthProviderInitial: FC<AuthProviderInitialProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { userData, isAuth } = useAppSelector((state) => state.user);

  const [handleTryAuthUser, { data, isLoading }] =
    useLazyUserLoginByTokenQuery();

  const [timeoutReached, setTimeoutReached] = useState<boolean>(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    if (userData) return;
    if (isAuth) return;

    timeout = setTimeout(() => {
      setTimeoutReached(true);
    }, 7000);
    handleTryAuthUser();

    return () => {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
    };
  }, []);

  useEffect(() => {
    if (data) {
      dispatch(actionSetUserData(data));
    }
  }, [data]);

  if (isLoading && !timeoutReached) {
    return <Loader></Loader>;
  }

  return <>{children}</>;
};

export const AuthProvider = memo(AuthProviderInitial);
