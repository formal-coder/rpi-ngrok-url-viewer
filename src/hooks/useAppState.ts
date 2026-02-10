import { useState, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
interface AppStateInfo {
  current: AppStateStatus;
  previous: AppStateStatus | null;
  isActive: boolean;
  isBackground: boolean;
}
export function useAppState(): AppStateInfo {
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const [state, setState] = useState<AppStateInfo>({
    current: AppState.currentState,
    previous: null,
    isActive: AppState.currentState === 'active',
    isBackground: AppState.currentState === 'background',
  });
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      setState({
        current: nextState,
        previous: appState.current,
        isActive: nextState === 'active',
        isBackground: nextState === 'background',
      });
      appState.current = nextState;
    });
    return () => {
      subscription.remove();
    };
  }, []);
  return state;
}
