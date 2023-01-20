import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { StatusBar } from 'expo-status-bar';
import { Loading } from './src/components/loading';
import { Home } from './src/screens/home';

export default function App() {
  const [fontsLoader] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });
  if (!fontsLoader) {
    return <Loading />;
  }
  return (
    <>
      <Home />
      <StatusBar
        translucent
        style='light'
      />
    </>
  );
}
