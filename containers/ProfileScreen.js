import { useRoute } from "@react-navigation/core";
import { Text, View, Button } from "react-native";

import { useState, useEffect } from "react";
import axios from "axios";

import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen({ setToken, userToken, setId, userId }) {
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [description, setDescription] = useState();
  const [photo, setPhoto] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/user/${userId}`,
          {
            headers: {
              authorization: `Bearer ${userToken}`,
            },
          }
        );
        // console.log(response.data);
        setEmail(response.data.email);
        setUsername(response.data.username);
        setDescription(response.data.description);
        setPhoto(response.data.photo[0].url);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  const getPermissionAndGetPicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync();
      // console.log(result);
    } else {
      alert("Permission denied");
    }
  };

  const logOut = () => {
    setToken(null);
    setId(null);
  };

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <Button
        title="Accéder à la galerie photo"
        onPress={getPermissionAndGetPicture}
      />
    </View>
  );
}
