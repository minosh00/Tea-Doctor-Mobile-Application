import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import MyPlants from './MyPlants';
import TreeDetails from './TreeDetails';

function Index() {
    const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer independent>
        <Stack.Navigator>
            <Stack.Screen name='MyPlants' component={MyPlants} options={{headerShown: false}} />
            <Stack.Screen name='Details' component={TreeDetails} options={{headerShown: false}} />
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Index