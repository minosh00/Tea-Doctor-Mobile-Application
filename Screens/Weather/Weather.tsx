import React, { useEffect, useState } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import DetailCard from "../../Components/DetailCard/DetailCard";
import mainStyles from "../../constants/mainStyles";
import axios from "axios";
import useCurrentLocation from "../../hooks/useCurrentLocation";
import useCurrentUser from "../../firebase/hooks/useCurrentUser";
import FullScreenLoader from "../../layouts/FullScreenLoader";
import { COLOR_PALETTE } from "../../constants/colors";
import AnimatedLottieView from "lottie-react-native";
import { default_URL } from "../../constants/url";

const Weather = ({ changeTab }: { changeTab: (number: number) => void }) => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [day, setDay] = useState<Date>(new Date());
  const currentLocation = useCurrentLocation();
  const currentUser = useCurrentUser();

  useEffect(() => {
    getWeatherData(new Date().toLocaleDateString());
  }, [currentUser, currentLocation]);

  let formattedDate = null;
  if (weatherData) {
    const detectionDate = new Date(weatherData.detection_date);
    formattedDate = detectionDate.toLocaleDateString();
  }

  const handleNextDate = () => {
    const date = day;
    date.setDate(day.getDate() + 1);
    getWeatherData(date.toLocaleDateString());
  };

  const handlePreviousDate = () => {
    const date = day;
    date.setDate(day.getDate() - 1);
    getWeatherData(date.toLocaleDateString());
  };

  const getWeatherData = (dateString: string) => {
    if (currentLocation && currentUser) {
      setIsLoading(true);
      axios
        .get(
          `https://weatherapi-com.p.rapidapi.com/current.json?q=${currentLocation.coords.latitude},${currentLocation.coords.longitude}`,
          {
            headers: {
              "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
              "X-RapidAPI-Key":
                "3623898063msh6d53471e69619bcp1c3645jsn69245bfec7d6",
            },
          }
        )
        .then((res) => {
          const weather = {
            lang: currentLocation?.coords.latitude,
            long: currentLocation?.coords.longitude,
            userId: currentUser?.uid,
            precipitation: res.data.current.precip_mm,
            temp_max: res.data.current.temp_c,
            temp_min: res.data.current.temp_c,
            wind: res.data.current.wind_kph,
            today: dateString,
          };
          axios
            .post(`${default_URL}/detection/detect-weather`, weather)
            .then((response) => {
              console.log(response.data);
              setWeatherData(response.data.data);
              setIsLoading(false);
            })
            .catch((error) => {
              console.error(error);
              setIsLoading(false);
            });
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    }
  };

  return (
    <View style={mainStyles.main}>
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={{ width: "100%", resizeMode: "contain" }}
          source={require("../../assets/tea-doctor-logo.png")}
        />
      </View>
      <DetailCard
        header="Suggestions"
        description="Check the tea leaves and scan if you see any odd spots"
      />
      <FullScreenLoader isLoading={isLoading}>
        <View style={{ paddingVertical: 12, height: isLoading ? 200 : "100%" }}>
          {weatherData && (
            <DetailCard header="Weather on Rathganga">
              <View style={styles.container}>
                <Text style={styles.dateText}>Date: {formattedDate}</Text>
                <View style={styles.infoContainer}>
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Today's Weather:</Text>
                    <Text style={styles.value}>
                      {weatherData.todayWeatherClass}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Temperature:</Text>
                    <Text style={styles.value}>{weatherData.temps[0]} °C</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Humidity:</Text>
                    <Text style={styles.value}>
                      {weatherData.humidities[0]} %
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Rainfalls:</Text>
                    <Text style={styles.value}>
                      {weatherData.rainfalls[0]} mm
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Wind Speed:</Text>
                    <Text style={styles.value}>{weatherData.wind} km/h</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleNextDate()}
                  style={{
                    position: "absolute",
                    backgroundColor: COLOR_PALETTE.secondary,
                    borderColor: COLOR_PALETTE.primary,
                    borderWidth: 2,
                    padding: 8,
                    borderRadius: 100,
                    top: "50%",
                    right: -24,
                    zIndex: 50,
                  }}
                >
                  <AnimatedLottieView
                    style={{ height: 30, width: 30 }}
                    source={require("../../assets/lotties/next.json")}
                    autoPlay
                    loop
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handlePreviousDate()}
                  style={{
                    position: "absolute",
                    backgroundColor: COLOR_PALETTE.secondary,
                    borderColor: COLOR_PALETTE.primary,
                    borderWidth: 2,
                    padding: 8,
                    borderRadius: 100,
                    top: "50%",
                    left: -24,
                    zIndex: 50,
                  }}
                >
                  <AnimatedLottieView
                    style={{
                      height: 30,
                      width: 30,
                      transform: [{ rotate: "90deg" }],
                    }}
                    source={require("../../assets/lotties/next.json")}
                    autoPlay
                    loop
                  />
                </TouchableOpacity>
              </View>
            </DetailCard>
          )}
        </View>
      </FullScreenLoader>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR_PALETTE.secondary,
    position: "relative",
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
    margin: 10,
  },
  dateText: {
    color: COLOR_PALETTE.secondary,
    backgroundColor: COLOR_PALETTE.primary,
    padding: 12,
    textAlign: "center",
    borderRadius: 12,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    color: COLOR_PALETTE.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  value: {
    fontSize: 16,
  },
});

export default Weather;
