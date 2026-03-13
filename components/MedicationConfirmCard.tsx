/**
 * MedicationConfirmCard
 *
 * Card component that prompts the user to confirm whether
 * they have taken their medication.
 *
 * Handles two phases:
 * - "prompt": asks the user to confirm medication intake
 * - "confirmed": shows confirmation and allows cancellation
 *
 * Includes optimistic UI updates and entry animations.
 */

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
  /** Called when the user confirms medication intake */
  onConfirm: () => Promise<void> | void;

  /** Called when the user cancels a previous confirmation */
  onCancel: () => Promise<void> | void;

  /** Initial confirmation state from backend */
  initialConfirmed: boolean;
};

type Phase = "prompt" | "confirmed";

/** Message shown when prompting the user for confirmation */
const PROMPT_MESSAGE =
  "Hi there!\n\nIt's time to check in.\n\nHave you taken your medication?\n\nPlease confirm.";

/** Message shown after the user confirms medication intake */
const THANK_YOU_MESSAGE =
  "Thank you for confirming.\n\nYour caregiver has been notified.\n\nIf this was a mistake, you may cancel below.";

export default function MedicationConfirmCard({
  onConfirm,
  onCancel,
  initialConfirmed,
}: Props) {
  /** Current UI phase of the component */
  const [phase, setPhase] = useState<Phase>(
    initialConfirmed ? "confirmed" : "prompt",
  );

  /** Loading state during confirm/cancel actions */
  const [loading, setLoading] = useState(false);

  /** Animated values for entry transition */
  const translateY = useRef(new Animated.Value(40)).current;
  const scale = useRef(new Animated.Value(0.96)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  /**
   * Runs the entry animation for the card.
   * Triggered when the phase changes.
   */
  const animateIn = () => {
    translateY.setValue(40);
    scale.setValue(0.96);
    opacity.setValue(0);

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 450,
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

  /** Animate whenever the UI phase changes */
  useEffect(() => {
    animateIn();
  }, [phase]);

  /**
   * Sync UI phase with backend confirmation state.
   * This ensures the card reflects server updates.
   */
  useEffect(() => {
    setPhase(initialConfirmed ? "confirmed" : "prompt");
  }, [initialConfirmed]);

  /** Returns the message corresponding to the current phase */
  const getMessage = () => {
    return phase === "confirmed" ? THANK_YOU_MESSAGE : PROMPT_MESSAGE;
  };

  /**
   * Handles medication confirmation.
   * Uses an optimistic update for immediate UI feedback.
   */
  const handleConfirm = async () => {
    if (phase !== "prompt") return;

    setPhase("confirmed");
    setLoading(true);

    try {
      await onConfirm();
    } catch {
      setPhase("prompt");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles cancellation of a previous confirmation.
   * Reverts the UI if the request fails.
   */
  const handleCancel = async () => {
    if (phase !== "confirmed") return;

    setPhase("prompt");
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
