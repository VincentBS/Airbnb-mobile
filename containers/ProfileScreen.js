import {
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

export default function ProfileScreen({ setToken, userToken, setId, userId }) {
  // console.log("user id ===>", userId);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [data, setData] = useState("");

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
        // console.log("response userId ==>", response.data);
        if (response.data.photo) {
          setPhoto(response.data.photo.url);
        }
        setEmail(response.data.email);
        setUsername(response.data.username);
        setDescription(response.data.description);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchData();
  }, []);

  const getPermissionAndGetPicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });
      // console.log(result);
      if (result.cancelled === true) {
        alert("No photo selected");
      } else {
        setSelectedPicture(result.uri);
      }
    } else {
      alert("Permission denied");
    }
  };

  const getPermissionAndTakePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchCameraAsync();
      setSelectedPicture(result.uri);
    } else {
      alert("Permission denied");
    }
  };

  const update = async () => {
    try {
      if (username && email && description) {
        if (
          data.username !== username ||
          data.email !== email ||
          data.description !== description
        ) {
          const response = await axios.put(
            "https://express-airbnb-api.herokuapp.com/user/update",
            { email: email, description: description, username: username },
            { headers: { authorization: `Bearer ${userToken}` } }
          );
          if (response.data) {
            setMessage("Info Updated");
            setData(response.data);
          }
        }
        if (selectedPicture) {
          const tab = selectedPicture.split(".");
          const extension = tab[tab.length - 1];
          const formData = new FormData();
          formData.append("photo", {
            uri: selectedPicture,
            name: `${data.username}.${extension}`,
            type: `image/${extension}`,
          });
          const response = await axios.put(
            "https://express-airbnb-api.herokuapp.com/user/upload_picture",
            formData,
            {
              headers: {
                authorization: `Bearer ${userToken}`,
                // Accept: "application/json",
                // "Content-Type": "multipart/form-data",
              },
            }
          );
          if (response.data) {
            setMessage("Informations updated");
            setPhoto(response.data.photo.url);
            setSelectedPicture(null);
          }
        }
      } else {
        setMessage("All Fields are required");
      }
      setIsLoading(false);
    } catch (error) {
      setMessage(error.response.data.error);
      console.log(error.response.data);
    }
  };

  return isLoading === true ? (
    <ActivityIndicator />
  ) : (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <View style={styles.avatarArea}>
        <View style={styles.avatar}>
          {selectedPicture || photo ? (
            <Image
              source={{ uri: selectedPicture ? selectedPicture : photo }}
              style={styles.avatarImage}
            />
          ) : (
            <FontAwesome5 name="user-alt" size={80} color="#E7E7E7" />
          )}
        </View>
        <View style={{ justifyContent: "space-evenly" }}>
          <TouchableOpacity onPress={getPermissionAndGetPicture}>
            <Ionicons name="images-outline" size={30} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity onPress={getPermissionAndTakePicture}>
            <Ionicons name="ios-camera" size={30} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ alignItems: "center", marginTop: 50 }}>
        <TextInput
          placeholder="email"
          value={email}
          style={styles.inputText}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          placeholder="username"
          value={username}
          style={styles.inputText}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          placeholder="description"
          value={description}
          style={styles.inputDescription}
          onChangeText={(text) => setDescription(text)}
          numberOfLines={4}
          multiline={true}
        />
      </View>
      <Text style={styles.infoMessage}>{message}</Text>
      <View style={styles.buttonArea}>
        <TouchableOpacity style={styles.btn} onPress={update}>
          <Text style={styles.btnText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setToken(null);
            setId(null);
          }}
          style={styles.btnLogOut}
        >
          <Text style={styles.btnText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  avatarArea: { justifyContent: "center", flexDirection: "row", marginTop: 30 },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    width: 150,
    height: 150,
    borderColor: "#FFBCC2",
    borderWidth: 1.5,
    borderRadius: 180,
    marginRight: 15,
  },
  avatarImage: { borderRadius: 180, height: 150, width: 150 },
  inputText: {
    height: 50,
    borderBottomColor: "#FFBCC2",
    borderBottomWidth: 1.5,
    width: 300,
  },
  inputDescription: {
    borderColor: "#FFBCC2",
    borderWidth: 1.5,
    width: 300,
    height: 90,
    marginTop: 25,
    marginBottom: 5,
    textAlignVertical: "top",
    padding: 5,
  },
  buttonArea: {
    marginTop: 10,
    paddingBottom: 50,
    alignItems: "center",
  },
  btn: {
    height: 50,
    borderWidth: 2,
    borderColor: "#F9595E",
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    borderRadius: 45,
    marginTop: 10,
  },
  btnLogOut: {
    height: 50,
    borderWidth: 2,
    borderColor: "#F9595E",
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    borderRadius: 45,
    marginTop: 20,
    backgroundColor: "#E7E7E7",
  },
  btnText: { color: "gray", fontSize: 16, fontWeight: "500" },
  infoMessage: {
    color: "red",
    textAlign: "center",
    paddingTop: 20,
  },
});
