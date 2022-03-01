import React, { useState, useEffect } from "react";
import { Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, Feather } from "@expo/vector-icons";
import HomeScreen from "./containers/HomeScreen";
import ProfileScreen from "./containers/ProfileScreen";
import SignInScreen from "./containers/SignInScreen";
import SignUpScreen from "./containers/SignUpScreen";
import SettingsScreen from "./containers/SettingsScreen";
import SplashScreen from "./containers/SplashScreen";
import RoomScreen from "./containers/RoomScreen";
import AroundMe from "./containers/AroundMe";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const setToken = async (token) => {
    if (token) {
      await AsyncStorage.setItem("userToken", token);
    } else {
      await AsyncStorage.removeItem("userToken");
    }

    setUserToken(token);
  };

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      // We should also handle error for production apps
      const userToken = await AsyncStorage.getItem("userToken");

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      setUserToken(userToken);

      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  if (isLoading === true) {
    // We haven't finished checking for the token yet
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken === null ? (
          // No token found, user isn't signed in
          <>
            <Stack.Screen name="SignIn">
              {() => <SignInScreen setToken={setToken} />}
            </Stack.Screen>
            <Stack.Screen name="SignUp">
              {() => <SignUpScreen setToken={setToken} />}
            </Stack.Screen>
          </>
        ) : (
          // User is signed in ! 🎉
          <Stack.Screen name="Tab" options={{ headerShown: false }}>
            {() => (
              <Tab.Navigator
                screenOptions={{
                  headerShown: false,
                  tabBarActiveTintColor: "tomato",
                  tabBarInactiveTintColor: "gray",
                }}
              >
                {/* ---------- TAB HOME ---------- */}

                <Tab.Screen
                  name="TabHome"
                  options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name={"ios-home"} size={size} color={color} />
                    ),
                  }}
                >
                  {(props) => {
                    // console.log(props);
                    return (
                      <Stack.Navigator>
                        <Stack.Screen
                          name="Home"
                          options={{
                            // title: "Airbnb",
                            // headerStyle: { backgroundColor: "#F95B60" },
                            // headerTitleStyle: { color: "white" },
                            headerTitle: () => (
                              <Image
                                source={require("./assets/Airbnb-Logo.png")}
                                style={{ width: 35, height: 35 }}
                              />
                            ),
                          }}
                        >
                          {() => <HomeScreen />}
                        </Stack.Screen>
                        <Stack.Screen
                          name="Room"
                          options={{
                            headerTitle: () => (
                              <Image
                                source={require("./assets/Airbnb-Logo.png")}
                                style={{ width: 35, height: 35 }}
                              />
                            ),
                          }}
                        >
                          {(props) => <RoomScreen {...props} />}
                        </Stack.Screen>
                        <Stack.Screen
                          name="Profile"
                          options={{
                            title: "User Profile",
                          }}
                        >
                          {() => <ProfileScreen />}
                        </Stack.Screen>
                      </Stack.Navigator>
                    );
                  }}
                </Tab.Screen>

                {/* ---------- TAB AROUND ME ---------- */}

                <Tab.Screen
                  name="AroundTab"
                  options={{
                    tabBarLabel: "Around Me",
                    tabBarIcon: ({ color, size }) => {
                      return (
                        <Feather name="map-pin" size={size} color={color} />
                      );
                    },
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        options={{
                          headerShown: false,
                        }}
                        name="Around"
                        component={AroundMe}
                      />
                      {/* Depuis la tab "Around Me" on peut accéder à la page Room */}
                      {/* <Stack.Screen name="Room" component={RoomScreen} /> */}
                    </Stack.Navigator>
                  )}
                </Tab.Screen>

                {/* ---------- TAB PROFILE ---------- */}

                <Tab.Screen
                  name="TabProfile"
                  options={{
                    tabBarLabel: "My Profile",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons
                        name={"person-outline"}
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Profile"
                        options={{
                          title: "Profile",
                        }}
                      >
                        {() => <ProfileScreen setToken={setToken} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
