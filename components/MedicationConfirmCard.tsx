import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

type Props = {
  onConfirm: () => Promise<void> | void;
  onCancel: () => Promise<void> | void;
  initialConfirmed: boolean;
};

type Phase = "prompt" | "confirmed";

const PROMPT_MESSAGE =
  "Hi there!\n\nIt's time to check in.\n\nHave you taken your medication?\n\nPlease confirm.";

const THANK_YOU_MESSAGE =
  "Thank you for confirming.\n\nYour caregiver has been notified.\n\nIf this was a mistake, you may cancel below.";

export default function MedicationConfirmCard({
  onConfirm,
  onCancel,
  initialConfirmed,
}: Props) {
  const [phase, setPhase] = useState<Phase>(
    initialConfirmed ? "confirmed" : "prompt",
  );

  const [loading, setLoading] = useState(false);

  // Stronger animation values
  const translateY = useRef(new Animated.Value(40)).current;
  const scale = useRef(new Animated.Value(0.96)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const animateIn = () => {
    translateY.setValue(40);
    scale.setValue(0.96);
    opacity.setValue(0);

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 450, // slightly slower
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Animate when phase changes
  useEffect(() => {
    animateIn();
  }, [phase]);

  // Sync with backend state
  useEffect(() => {
    setPhase(initialConfirmed ? "confirmed" : "prompt");
  }, [initialConfirmed]);

  const getMessage = () => {
    return phase === "confirmed" ? THANK_YOU_MESSAGE : PROMPT_MESSAGE;
  };

  const handleConfirm = async () => {
    if (phase !== "prompt") return;

    setPhase("confirmed"); // optimistic
    setLoading(true);

    try {
      await onConfirm();
    } catch {
      setPhase("prompt");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (phase !== "confirmed") return;

    setPhase("prompt"); // immediate switch back
    setLoading(true);

    try {
      await onCancel();
    } catch {
      setPhase("confirmed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity,
          transform: [{ translateY }, { scale }],
        },
      ]}
    >
      <Text style={styles.messageText}>{getMessage()}</Text>

      {phase === "prompt" && (
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.confirmText}>Confirm</Text>
          )}
        </TouchableOpacity>
      )}

      {phase === "confirmed" && (
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleCancel}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.confirmText}>Cancel</Text>
          )}
        </TouchableOpacity>
      )}
    </Animated.View>
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
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 14,
    marginTop: 24,
  },
  confirmText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
