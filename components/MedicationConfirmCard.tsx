import React, { useEffect, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  onConfirm: () => Promise<void> | void;
};

const PROMPT_MESSAGE =
  "Hi there!\n\nIt's time to check in.\n\nHave you taken your medication?\n\nPlease confirm.";

const THANK_YOU_MESSAGE =
  "Thank you for confirming.\n\nYour caregiver has been notified.\n\nSee you at the next check-in.";

type Phase = "typingPrompt" | "awaitConfirm" | "typingThanks" | "done";

export default function MedicationConfirmCard({ onConfirm }: Props) {
  const [displayedText, setDisplayedText] = useState("");
  const [phase, setPhase] = useState<Phase>("typingPrompt");
  const confirmOpacity = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (phase === "awaitConfirm") {
      Animated.timing(confirmOpacity, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [phase]);

  // typing effect
  const typeMessage = (message: string, onDone: () => void) => {
    let i = 0;
    setDisplayedText("");

    const interval = setInterval(() => {
      setDisplayedText(message.slice(0, i + 1));
      i++;

      if (i === message.length) {
        clearInterval(interval);
        onDone();
      }
    }, 35);
  };

  useEffect(() => {
    typeMessage(PROMPT_MESSAGE, () => setPhase("awaitConfirm"));
  }, []);

  const handleConfirm = async () => {
    setPhase("typingThanks");
    await onConfirm();

    typeMessage(THANK_YOU_MESSAGE, () => setPhase("done"));
  };

  return (
    <View style={styles.card}>
      <Text style={styles.messageText}>{displayedText}</Text>

      {phase === "awaitConfirm" && (
        <Animated.View style={{ opacity: confirmOpacity }}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmText}>Confirm</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 22,
    padding: 24,
    minHeight: 300,
    width: "90%",
    alignSelf: "center",

    justifyContent: "space-between",

    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  messageText: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 28,
    textAlign: "center",
    color: "#111",
  },
  confirmButton: {
    alignSelf: "center",
    backgroundColor: "#FD1101",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 14,
    marginTop: 24,
  },
  confirmText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
