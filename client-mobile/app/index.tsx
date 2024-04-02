// Routes.js

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import App from "@/src"; // Certifique-se de importar o componente correto para sua aplicação

const Stack = createNativeStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="App" component={App} />
    </Stack.Navigator>
  );
}
