import {
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

export default function SignInScreen({ setToken, setId }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);

  const createAccount = async () => {
    // console.log(email, username, password, confirmPassword, description);
    try {
      if (email && username && description && password && confirmPassword) {
        setError("");
        if (password === confirmPassword) {
          const response = await axios.post(
            "https://express-airbnb-api.herokuapp.com/user/sign_up",
            {
              email: email,
              username: username,
              description: description,
              password: password,
            }
          );
          // console.log(response.data);
          setToken(response.data.token);
          setId(response.data.id);
        } else {
          setError("The 2 passwords must be the same");
        }
      } else {
        setError("Please fill all fields.");
      }
    } catch (error) {
      // console.log(error.response.status);
      // console.log(error.response.data);
      if (
        error.response.data.error === "This username already has an account." ||
        error.response.data.error === "This email already has an account."
      ) {
        setError(error.response.data.error);
      }
    }
  };

  const navigation = useNavigation();
  const icon = !visible ? "eye" : "eye-off";

  return (
    <SafeAreaView>
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          <Image
            source={require("../assets/Airbnb-Logo.png")}
            style={styles.logo}
          />
          <TextInput
            value={email}
            autoCapitalize="none"
            style={styles.input}
            onChangeText={(text) => setEmail(text)}
            placeholder="email"
          />
          <TextInput
            value={username}
            autoCapitalize="none"
            style={styles.input}
            onChangeText={(text) => setUsername(text)}
            placeholder="username"
          />
          <TextInput
            value={description}
            style={styles.textArea}
            multiline={true}
            numberOfLines={5}
            onChangeText={(text) => setDescription(text)}
            placeholder="Describe yourself in a few words..."
          />

          <View style={styles.passwordField}>
            <TextInput
              value={password}
              secureTextEntry={!visible}
              autoCapitalize="none"
              style={styles.input}
              onChangeText={(text) => setPassword(text)}
              placeholder="password"
            />
            <Feather
              name={icon}
              style={styles.iconEye}
              onPress={() => {
                setVisible(!visible);
              }}
            />
          </View>
          <View style={styles.passwordField}>
            <TextInput
              value={confirmPassword}
              secureTextEntry={!visible}
              autoCapitalize="none"
              style={styles.input}
              onChangeText={(text) => setConfirmPassword(text)}
              placeholder="confirm password"
            />
            <Feather
              name={icon}
              style={styles.iconEye}
              onPress={() => {
                setVisible(!visible);
              }}
            />
          </View>

          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity style={styles.btn} onPress={createAccount}>
            <Text style={{ color: "#A0A0A0" }}>Sign up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            title="redirect SignIn"
            onPress={() => {
              navigation.navigate("SignIn");
            }}
          >
            <Text style={styles.redirectSignup}>
              Already have an account? Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
  },
  logo: { width: 100, height: 100, marginBottom: 10 },
  input: {
    height: 40,
    width: 300,
    borderBottomColor: "#FFBBC0",
    borderBottomWidth: 2,
    marginTop: 20,
  },
  btn: {
    borderColor: "#F95B60",
    borderWidth: 2,
    borderRadius: 50,
    height: 50,
    width: 160,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    color: "red",
    marginTop: 40,
  },
  redirectSignup: {
    color: "#A1A1A1",
    marginTop: 15,
  },
  textArea: {
    height: 100,
    width: 300,
    flexShrink: 1,
    fontSize: 16,
    padding: 10,
    marginVertical: 15,
    borderWidth: 2,
    borderColor: "#FFBBC0",
    textAlignVertical: "top",
    marginTop: 40,
  },
  passwordField: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconEye: {
    fontSize: 17,
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});
