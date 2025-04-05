"use client";

import { Provider as ProviderRedux } from "react-redux";
import { store } from "../shared/model/(store)/store";
import { ReactNode } from "react";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return <ProviderRedux store={store}>{children}</ProviderRedux>;
}
