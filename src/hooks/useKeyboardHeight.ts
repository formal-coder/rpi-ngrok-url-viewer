import { useState, useEffect } from 'react';
import { Keyboard, Platform, KeyboardEvent } from 'react-native';
interface KeyboardState {
  isVisible: boolean;
  height: number;
}
export function useKeyboardHeight(): KeyboardState {
  const [keyboardState, setKeyboardState] = useState<KeyboardState>({
    isVisible: false,
    height: 0,
  });
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const handleKeyboardShow = (event: KeyboardEvent) => {
      setKeyboardState({
        isVisible: true,
        height: event.endCoordinates.height,
      });
    };
    const handleKeyboardHide = () => {
      setKeyboardState({
        isVisible: false,
        height: 0,
      });
    };
    const showSubscription = Keyboard.addListener(showEvent, handleKeyboardShow);
    const hideSubscription = Keyboard.addListener(hideEvent, handleKeyboardHide);
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  return keyboardState;
}
