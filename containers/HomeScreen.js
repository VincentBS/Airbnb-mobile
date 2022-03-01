import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import StarRating from "react-native-star-rating";

import {
  Text,
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Image,
} from "react-native";

export default function HomeScreen() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://express-airbnb-api.herokuapp.com/rooms"
        );
        // console.log(response.data);
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return isLoading === true ? (
    <ActivityIndicator />
  ) : (
    <FlatList
      data={data}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => {
        // console.log(item);
        return (
          <TouchableOpacity
            style={styles.container}
            onPress={() => {
              navigation.navigate("Room", { id: item._id });
            }}
          >
            <ImageBackground
              source={{ uri: item.photos[0].url }}
              style={styles.bgImg}
            >
              <View style={styles.priceView}>
                <Text style={styles.priceText}>{item.price} €</Text>
              </View>
            </ImageBackground>
            <View style={styles.view}>
              <View style={{ flex: 1 }}>
                <Text>{item.title}</Text>
                <View style={styles.row}>
                  <StarRating
                    maxStars={5}
                    rating={item.ratingValue}
                    fullStarColor="#FFB000"
                    emptyStarColor="#BBBBBB"
                    starSize={20}
                    emptyStar="star"
                  />
                  <Text style={styles.card_details_reviews}>
                    {item.reviews} reviews
                  </Text>
                </View>
              </View>
              <Image
                source={{ uri: item.user.account.photo.url }}
                style={styles.userImage}
              />
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginBottom: 30 },
  bgImg: {
    height: 250,
    width: Dimensions.get("window").width * 0.9,
    justifyContent: "flex-end",
  },
  priceView: {
    backgroundColor: "black",
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  priceText: {
    color: "white",
    fontSize: 20,
  },
  view: {
    flexDirection: "row",
    width: Dimensions.get("window").width * 0.9,
    marginTop: 15,
  },
  row: { flexDirection: "row" },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  card_details_reviews: {
    color: "gray",
    marginLeft: 5,
    marginTop: 2.5,
  },
});
