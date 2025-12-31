import React, { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, Alert, Switch } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";

export default function ProfileScreen() {
  const router = useRouter();
  const { rider, logout, updateRiderStatus } = useAuth();
  const [isOnline, setIsOnline] = useState(rider?.isOnline || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleOnline = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await updateRiderStatus(!isOnline);
      setIsOnline(!isOnline);
    } catch (error) {
      Alert.alert("Error", "Failed to update status");
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Logout",
        onPress: async () => {
          try {
            setIsLoading(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            await logout();
            router.replace("/login");
          } catch (error) {
            Alert.alert("Error", "Failed to logout");
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  if (!rider) {
    return (
      <ScreenContainer className="justify-center items-center">
        <Text className="text-foreground">Loading profile...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground">Profile</Text>
        </View>

        {/* Online Status Toggle */}
        <View className="bg-surface border border-border rounded-lg p-4 mb-6 flex-row justify-between items-center">
          <View>
            <Text className="text-base font-semibold text-foreground">Online Status</Text>
            <Text className="text-sm text-muted mt-1">
              {isOnline ? "You are online and accepting orders" : "You are offline"}
            </Text>
          </View>
          <Switch value={isOnline} onValueChange={handleToggleOnline} />
        </View>

        {/* Rider Information */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-4">Rider Information</Text>

          {/* Name */}
          <View className="bg-surface border border-border rounded-lg p-4 mb-3">
            <Text className="text-xs text-muted font-semibold uppercase">Name</Text>
            <Text className="text-base font-semibold text-foreground mt-2">{rider.name}</Text>
          </View>

          {/* Email */}
          <View className="bg-surface border border-border rounded-lg p-4 mb-3">
            <Text className="text-xs text-muted font-semibold uppercase">Email</Text>
            <Text className="text-base font-semibold text-foreground mt-2">{rider.email}</Text>
          </View>

          {/* Phone */}
          <View className="bg-surface border border-border rounded-lg p-4 mb-3">
            <Text className="text-xs text-muted font-semibold uppercase">Phone</Text>
            <Text className="text-base font-semibold text-foreground mt-2">{rider.phone}</Text>
          </View>

          {/* Vehicle Type */}
          <View className="bg-surface border border-border rounded-lg p-4 mb-3">
            <Text className="text-xs text-muted font-semibold uppercase">Vehicle Type</Text>
            <Text className="text-base font-semibold text-foreground mt-2 capitalize">{rider.vehicleType}</Text>
          </View>

          {/* Rating */}
          {rider.rating && (
            <View className="bg-surface border border-border rounded-lg p-4">
              <Text className="text-xs text-muted font-semibold uppercase">Rating</Text>
              <Text className="text-base font-semibold text-foreground mt-2">
                ⭐ {rider.rating.toFixed(1)} / 5.0
              </Text>
            </View>
          )}
        </View>

        {/* Settings Section */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-4">Settings</Text>

          <TouchableOpacity
            onPress={() => Alert.alert("Info", "Notifications settings coming soon")}
            activeOpacity={0.7}
            className="bg-surface border border-border rounded-lg p-4 mb-3 flex-row justify-between items-center"
          >
            <Text className="text-base font-semibold text-foreground">Notifications</Text>
            <Text className="text-primary">→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert("Info", "Language settings coming soon")}
            activeOpacity={0.7}
            className="bg-surface border border-border rounded-lg p-4 mb-3 flex-row justify-between items-center"
          >
            <Text className="text-base font-semibold text-foreground">Language</Text>
            <Text className="text-primary">→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert("Info", "Theme settings coming soon")}
            activeOpacity={0.7}
            className="bg-surface border border-border rounded-lg p-4 mb-3 flex-row justify-between items-center"
          >
            <Text className="text-base font-semibold text-foreground">Theme</Text>
            <Text className="text-primary">→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert("Info", "Help & Support coming soon")}
            activeOpacity={0.7}
            className="bg-surface border border-border rounded-lg p-4 flex-row justify-between items-center"
          >
            <Text className="text-base font-semibold text-foreground">Help & Support</Text>
            <Text className="text-primary">→</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View className="bg-surface border border-border rounded-lg p-4 mb-6">
          <Text className="text-xs text-muted font-semibold uppercase mb-2">App Version</Text>
          <Text className="text-sm text-foreground">1.0.0</Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          disabled={isLoading}
          activeOpacity={0.7}
          className="border border-error rounded-lg py-4 items-center"
        >
          <Text className="text-error font-semibold text-base">{isLoading ? "Logging out..." : "Logout"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}
