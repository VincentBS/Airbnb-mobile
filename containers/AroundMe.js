import { ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";

import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import axios from "axios";

const AroundMe = ({ navigation }) => {
  const [userLatitude, setUserLatitude] = useState(null);
  const [userLongitude, setUserLongitude] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const getPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      //   console.log(status);
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync();
        // console.log(location);
        setUserLatitude(location.coords.latitude);
        setUserLongitude(location.coords.longitude);

        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/rooms/around?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}`
        );
        console.log(response.data);
        setData(response.data);
        setIsLoading(false);
      }
    };
    getPermission();
  }, []);
  return isLoading === true ? (
    <ActivityIndicator />
  ) : (
    <MapView
      style={{ width: "100%", height: "100%" }}
      initialRegion={{
        latitude: userLatitude,
        longitude: userLongitude,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      }}
      showsUserLocation={true}
      provider={PROVIDER_GOOGLE}
    >
      {data.map((item, index) => {
        return (
          <MapView.Marker
            onPress={() => {
              navigation.navigate("Room", {
                id: item._id,
              });
            }}
            key={index}
            coordinate={{
              latitude: item.location[1],
              longitude: item.location[0],
            }}
          />
        );
      })}
    </MapView>
  );
};

export default AroundMe;
