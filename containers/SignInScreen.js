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

export default function SignInScreen({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);

  const logIn = async () => {
    console.log(email, password);
    try {
      if (email && password) {
        setError("");
        const response = await axios.post(
          "https://express-airbnb-api.herokuapp.com/user/log_in",
          { email: email, password: password }
        );
        console.log(response.data);
        setToken(response.data.token);
      } else {
        setError("Please fill all fields.");
      }
    } catch (error) {
      console.log(error.response.status);
      console.log(error.response.data);
      if (
        error.response.status === "401" ||
        error.response.data.error === "Unauthorized"
      ) {
        setError("An error occurred, please check fields");
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
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity style={styles.btn} onPress={logIn}>
            <Text style={{ color: "#A0A0A0" }}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            title="redirect SignUp"
            onPress={() => {
              navigation.navigate("SignUp");
            }}
          >
            <Text style={styles.redirectSignup}>No account ? Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 70,
    flex: 1,
  },
  logo: { width: 100, height: 100, marginBottom: 50 },
  input: {
    height: 40,
    width: 300,
    borderBottomColor: "#FFBBC0",
    borderBottomWidth: 2,
    // borderWidth: 2,
    // borderColor: "#FFBBC0",
    marginTop: 30,
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
    marginTop: 100,
  },
  redirectSignup: {
    color: "#A1A1A1",
    marginTop: 15,
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
