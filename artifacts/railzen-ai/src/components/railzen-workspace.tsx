import {
  createContext,
  type ReactNode,
  useContext,
  useState,
} from 'react';

type RailzenWorkspaceContextValue = {
  network: string;
  setNetwork: (network: string) => void;
  period: string;
  setPeriod: (period: string) => void;
};

const RailzenWorkspaceContext =
  createContext<RailzenWorkspaceContextValue | null>(null);

export function RailzenWorkspaceProvider({ children }: { children: ReactNode }) {
  const [network, setNetwork] = useState('Northline Region');
  const [period, setPeriod] = useState('This month');

  return (
    <RailzenWorkspaceContext.Provider
      value={{
        network,
        setNetwork,
        period,
        setPeriod,
      }}
    >
      {children}
    </RailzenWorkspaceContext.Provider>
  );
}

export function useRailzenWorkspace() {
  const context = useContext(RailzenWorkspaceContext);

  if (!context) {
    throw new Error(
      'useRailzenWorkspace must be used inside RailzenWorkspaceProvider',
    );
  }

  return context;
}