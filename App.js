import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PaperProvider } from 'react-native-paper';
import Home from './screens/HomeScreen';
import AddProduct from './screens/AddProductScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='Home' component={Home} options={{headerShown: false}}/>
          <Stack.Screen name='AddProduct' component={AddProduct} options={{headerTitle: "Agregar Producto"}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

