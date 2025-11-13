import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { COLORS, FONTS } from "../theme";

type SlideToSendProps = {
  onSlideComplete?: () => void;
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const SLIDER_WIDTH = SCREEN_WIDTH * 0.8;
const KNOB_SIZE = 55;

export default function SlideToSend({ onSlideComplete }: SlideToSendProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const sliderFadeAnim = useRef(new Animated.Value(0)).current;
  const sliderOpacity = useRef(new Animated.Value(1)).current;

  const [completed, setCompleted] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);

  const welcomeMessage =
    "Hi there!" +
    "\n" +
    "It's time to check in." +
    "\n" +
    "Have you taken your medication?" +
    "\n" +
    "Please slide to confirm.";

  const confirmationMessage =
    "Thank you for checking in!" + "\n" + "You have taken your medication.";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(welcomeMessage.slice(0, i + 1));
      i++;
      if (i === welcomeMessage.length) {
        clearInterval(interval);
        setTypingDone(true);

        Animated.timing(sliderFadeAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const id = translateX.addListener(({ value }) => {
      Animated.timing(progressAnim, {
        toValue: value + KNOB_SIZE / 2,
        duration: 50,
        useNativeDriver: false,
      }).start();
    });
    return () => translateX.removeListener(id);
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 5,
      onPanResponderMove: (_, gesture) => {
        const newX = Math.min(
          Math.max(0, gesture.dx),
          SLIDER_WIDTH - KNOB_SIZE
        );
        translateX.setValue(newX);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SLIDER_WIDTH - KNOB_SIZE - 20) {
          Animated.spring(translateX, {
            toValue: SLIDER_WIDTH - KNOB_SIZE,
            useNativeDriver: false,
          }).start(() => {
            handleSlide();
            setCompleted(true);
          });
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const handleSlide = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();

    let j = welcomeMessage.length;
    const deleteInterval = setInterval(() => {
      setDisplayedText((prev) => prev.slice(0, -1));
      j--;
      if (j <= 0) {
        clearInterval(deleteInterval);

        let k = 0;
        const typeInterval = setInterval(() => {
          setDisplayedText(confirmationMessage.slice(0, k + 1));
          k++;
          if (k === confirmationMessage.length) {
            clearInterval(typeInterval);

            Animated.timing(sliderOpacity, {
              toValue: 0,
              duration: 800,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }).start();
          }
        }, 40);
      }
    }, 20);

    onSlideComplete?.();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#FD1101", "#000000"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
        <LinearGradient
          colors={["#000000", "#FD1101"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <View style={styles.centerContent}>
        <Text style={styles.welcomeText}>{displayedText}</Text>
      </View>

      <Animated.View
        style={[
          styles.sliderContainer,
          {
            opacity: Animated.multiply(sliderFadeAnim, sliderOpacity),
            transform: [{ translateY: 20 }],
          },
        ]}
      >
        <View style={styles.sliderTrack}>
          <Animated.View
            style={[styles.progressTrail, { width: progressAnim }]}
          />

          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.knob,
              {
                transform: [{ translateX }],
                backgroundColor: completed ? "#FFFFFF" : "#FD1101",
              },
            ]}
          >
            <Text style={styles.knobText}>
              {completed ? (
                "✓"
              ) : (
                <MaterialIcons
                  name="keyboard-double-arrow-right"
                  size={24}
                  color="black"
                />
              )}
            </Text>
          </Animated.View>

          {!completed && (
            <Text style={styles.slideText}>Confirm Medication</Text>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  welcomeText: {
    fontSize: 18,
    color: COLORS.white,
    fontFamily: FONTS.poppins,
    textAlign: "center",
    lineHeight: 60,
  },
  sliderContainer: {
    position: "absolute",
    bottom: 90,
    width: "100%",
    alignItems: "center",
  },
  sliderTrack: {
    width: SLIDER_WIDTH,
    height: KNOB_SIZE,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: KNOB_SIZE / 5,
    overflow: "hidden",
    justifyContent: "center",
  },
  progressTrail: {
    position: "absolute",
    left: 0,
    height: KNOB_SIZE,
    backgroundColor: "rgba(253, 17, 1, 0.9)",
    borderRadius: KNOB_SIZE / 5,
  },
  knob: {
    position: "absolute",
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 5,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    zIndex: 2,
  },
  knobText: {
    fontSize: 22,
    color: COLORS.black,
    fontWeight: "bold",
  },
  slideText: {
    position: "absolute",
    alignSelf: "center",
    fontSize: 15,
    color: COLORS.white,
    fontFamily: FONTS.poppins,
    zIndex: 1,
  },
});
