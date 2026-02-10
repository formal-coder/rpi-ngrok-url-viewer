Example usages of custom hooks in current directory:

```js
function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText, 300);
useEffect(() => {
    if (debouncedSearch) {
      // This only fires 300ms after the user stops typing
      searchAPI(debouncedSearch);
    }
  }, [debouncedSearch]);
  return (
    <TextInput
      value={searchText}
      onChangeText={setSearchText}
      placeholder="Search..."
    />
  );
}
```

Why It Works: The hook delays updating the returned value until the user stops changing it for the specified delay. Type "react native" and instead of 12 API calls, you get 1.

Pro Tip: Use 300ms for search inputs, 500ms for filter changes, and 1000ms for auto-save features.


```js
function ChatInput() {
  const { isVisible, height } = useKeyboardHeight();
return (
    <View style={{ paddingBottom: isVisible ? height : 0 }}>
      <TextInput placeholder="Type a message..." />
      <Button title="Send" />
    </View>
  );
}
```
Why It Works: iOS and Android fire different keyboard events (keyboardWillShow vs keyboardDidShow). This hook handles both platforms automatically and gives you reactive values you can use directly in your styles.

Pro Tip: Combine this with KeyboardAvoidingView for complex forms, or use it standalone for chat interfaces where you need precise control.

```js
function VideoPlayer() {
  const { isActive, previous } = useAppState();
useEffect(() => {
    if (!isActive) {
      pauseVideo();
    }
  }, [isActive]);
  useEffect(() => {
    // User just returned to the app
    if (isActive && previous === 'background') {
      refreshData();
    }
  }, [isActive, previous]);
  return <Video />;
}
```
Why It Works: The hook tracks both current and previous state, which lets you detect specific transitions (like "user just came back from background"). The boolean helpers (isActive, isBackground) make conditionals cleaner.

Real-World Use Cases:

Pause video/audio when app goes background
Refresh auth token when returning to app
Track session duration for analytics
Stop location tracking to save battery

```js
function UploadScreen() {
  const { isConnected, isWifi } = useNetworkState();
if (!isConnected) {
    return <OfflineBanner />;
  }
  return (
    <View>
      {!isWifi && (
        <Text style={styles.warning}>
          You're on cellular. Large uploads may use data.
        </Text>
      )}
      <UploadButton />
    </View>
  );
}
```
Why It Works: The hook wraps @react-native-community/netinfo and provides a clean, reactive interface. You get boolean helpers for common checks (isWifi, isCellular) without parsing the raw state every time.

Pro Tip: Combine this with TanStack Query's onlineManager for automatic request pausing when offline.

```js
function ScoreDisplay({ score }: { score: number }) {
  const previousScore = usePrevious(score);
const didIncrease = previousScore !== undefined && score > previousScore;
  return (
    <Animated.Text
      style={[
        styles.score,
        didIncrease && styles.scoreIncreased, // Flash green when score goes up
      ]}
    >
      {score}
    </Animated.Text>
  );
}
```
Why It Works: The ref persists across renders but updating it doesn't trigger a re-render. By updating it in useEffect, you capture the value after the render completes, meaning on the next render, ref.current holds the previous value.

Use Cases:
Animate changes (score increased, price dropped)
Debug what triggered a re-render
Detect direction of change (scrolling up vs down)
Compare props to decide if side effects should run

```js
function AnalyticsScreen() {
  useMount(() => {
    analytics.trackScreenView('HomeScreen');
    console.log('Component mounted');
  });
useUnmount(() => {
    analytics.trackScreenExit('HomeScreen');
    console.log('Component unmounted');
  });
  return <View>...</View>;
}
```
Why It Works:
1. useMount uses a ref to ensure the callback only runs once, even in React 18's StrictMode (which mounts components twice in development).
2. useUnmount stores the callback in a ref so it always has access to the latest closure values when the component unmounts.

Pro Tip: These hooks make your code's intent crystal clear. When you see useMount, you instantly know it's one-time initialization logic.

```js
import { useDebounce, useNetworkState } from '@/hooks';
```

`hooks/index.ts` is a barrel file that re-exports all custom hooks from the current directory, allowing for cleaner imports throughout the app. Instead of importing each hook individually from its file, you can import them all from the `hooks` directory.

Bonus: Putting It All Together
Here's a real-world component using multiple custom hooks:

```js
function SearchResults() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { isConnected } = useNetworkState();
  const { isActive } = useAppState();
  const { height: keyboardHeight } = useKeyboardHeight();
  const previousQuery = usePrevious(debouncedQuery);
useMount(() => {
    analytics.trackScreenView('Search');
  });
  useEffect(() => {
    if (debouncedQuery && isConnected && isActive) {
      // Only search if we have a query, internet, and app is active
      fetchResults(debouncedQuery);
    }
  }, [debouncedQuery, isConnected, isActive]);
  useEffect(() => {
    if (previousQuery && debouncedQuery !== previousQuery) {
      analytics.trackSearchQueryChanged(previousQuery, debouncedQuery);
    }
  }, [debouncedQuery, previousQuery]);
  if (!isConnected) {
    return <OfflineMessage />;
  }
  return (
    <View style={{ paddingBottom: keyboardHeight }}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search products..."
      />
      <ResultsList />
    </View>
  );
}
```
