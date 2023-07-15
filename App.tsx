import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from "./Screens/Main";
import Register from "./Screens/Auth/Register";
import Login from "./Screens/Auth/Login";
import Details from "./Screens/MyPlants/TreeDetails";
// import Components from "./Screens/Components";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
          <Stack.Screen name="Register" component={Register} options={{headerShown: false}} />
          <Stack.Screen name="Main" component={Main} options={{headerShown: false}} />
          <Stack.Screen name="Details" component={Details} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
