import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraScreen from './screens/CameraScreen';
import ResultScreen from './screens/ResultScreen';
import DashboardScreen from './screens/DashboardScreen';
import LoginScreen from './screens/LoginScreen';
import { UserProvider } from './context/UserContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{
            headerStyle: { backgroundColor: '#0f172a' },
            headerTintColor: '#38bdf8',
            headerTitleStyle: { fontWeight: '800', fontSize: 20 },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Stockify', headerLeft: () => null }} />
          <Stack.Screen name="Camera" component={CameraScreen} options={{ title: 'Scan Shelf', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff' }} />
          <Stack.Screen name="Result" component={ResultScreen} options={{ title: 'Analysis', headerStyle: { backgroundColor: '#0f172a' }, headerTintColor: '#38bdf8' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
