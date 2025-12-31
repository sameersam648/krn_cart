import { Text, TouchableOpacity, View, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 py-4 border-b border-border">
          <Text className="text-2xl font-bold text-foreground">Profile</Text>
        </View>

        {/* User Info Card */}
        <View className="mx-4 mt-6 p-6 rounded-lg bg-surface border border-border">
          {/* Avatar */}
          <View className="w-16 h-16 rounded-full bg-primary items-center justify-center mb-4">
            <Text className="text-2xl font-bold text-white">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </Text>
          </View>

          {/* User Details */}
          <Text className="text-xl font-bold text-foreground mb-4">{user?.name}</Text>

          <View className="gap-3 mb-6">
            {/* Email */}
            <View className="pb-3 border-b border-border">
              <Text className="text-xs text-muted font-semibold mb-1">Email</Text>
              <Text className="text-sm text-foreground">{user?.email}</Text>
            </View>

            {/* Phone */}
            <View className="pb-3 border-b border-border">
              <Text className="text-xs text-muted font-semibold mb-1">Phone</Text>
              <Text className="text-sm text-foreground">{user?.phone}</Text>
            </View>

            {/* Member Since */}
            <View>
              <Text className="text-xs text-muted font-semibold mb-1">Member Since</Text>
              <Text className="text-sm text-foreground">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* App Info */}
        <View className="mx-4 mt-6 p-4 rounded-lg bg-surface border border-border">
          <Text className="text-sm font-semibold text-foreground mb-2">App Information</Text>
          <View className="flex-row justify-between">
            <Text className="text-xs text-muted">Version</Text>
            <Text className="text-xs text-foreground font-semibold">1.0.0</Text>
          </View>
        </View>

        {/* Logout Button */}
        <View className="mx-4 mt-8 mb-8">
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-error rounded-lg py-3 active:opacity-80"
          >
            <Text className="text-center text-white font-bold text-base">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
