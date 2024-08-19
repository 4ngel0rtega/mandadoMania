import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PaperProvider } from 'react-native-paper';
import Home from './screens/HomeScreen';
import AddProduct from './screens/AddProductScreen';
import Details from './screens/DetailsScreen';
import { ProductsProvider } from './context/ProductsContext';
import AddService from './screens/AddServiceScreen';
import { ServicesProvider } from './context/ServicesContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <ProductsProvider>
          <ServicesProvider>
            <Stack.Navigator>
              <Stack.Screen name='Home' component={Home} options={{headerShown: false}}/>
              <Stack.Screen name='AddProduct' component={AddProduct} options={{headerShown: false}}/>
              <Stack.Screen name='AddService' component={AddService} options={{headerShown: false}}/>
              <Stack.Screen name='Details' component={Details} options={{headerShown: false}}/>
            </Stack.Navigator>
          </ServicesProvider>
        </ProductsProvider>
      </NavigationContainer>
    </PaperProvider>
  );
}

