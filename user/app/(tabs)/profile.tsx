import { Text, TouchableOpacity, View, Alert, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () => { },
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

  const renderSettingItem = (icon: any, label: string, subtitle?: string, onPress?: () => void, showChevron = true) => (
    <TouchableOpacity onPress={onPress} className="flex-row items-center py-3 active:opacity-70">
      <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-4">
        <Ionicons name={icon} size={20} color="#FF6B35" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-foreground">{label}</Text>
        {subtitle && <Text className="text-xs text-muted">{subtitle}</Text>}
      </View>
      {showChevron && <Ionicons name="chevron-forward" size={20} color="#94A3B8" />}
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="px-5 py-6 flex-row justify-between items-center border-b border-border/40">
          <Text className="text-3xl font-bold text-foreground">Profile</Text>
        </View>

        {/* User Info Card */}
        <View className="px-4 mt-6">
          <Card className="flex-row items-center p-5 border-border/50 shadow-sm bg-surface">
            <View className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-orange-600 items-center justify-center mr-4 shadow-sm">
              <Text className="text-2xl font-bold text-white">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-foreground mb-1">{user?.name}</Text>
              <Text className="text-sm text-muted">{user?.email}</Text>
              <TouchableOpacity className="mt-2">
                <Text className="text-xs text-primary font-bold">Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* Account Settings */}
        <View className="px-4 mt-8">
          <Text className="text-sm font-bold text-muted mb-3 uppercase tracking-wider">Account</Text>
          <Card className="p-2 bg-surface border-border/50">
            {renderSettingItem("location-outline", "Manage Addresses", "3 saved addresses", () => router.push("/address"))}
            <View className="h-[1px] bg-border/40 mx-14" />
            {renderSettingItem("card-outline", "Payment Methods", "Visa ending in 4242", () => Alert.alert("Coming Soon", "Payment methods will be available soon!"))}
            <View className="h-[1px] bg-border/40 mx-14" />
            {renderSettingItem("notifications-outline", "Notifications", "Offers, updates", () => Alert.alert("Coming Soon", "Notification settings will be available soon!"))}
          </Card>
        </View>

        {/* General Settings */}
        <View className="px-4 mt-8">
          <Text className="text-sm font-bold text-muted mb-3 uppercase tracking-wider">General</Text>
          <Card className="p-2 bg-surface border-border/50">
            {renderSettingItem("help-circle-outline", "Help & Support")}
            <View className="h-[1px] bg-border/40 mx-14" />
            {renderSettingItem("shield-checkmark-outline", "Privacy Policy")}
            <View className="h-[1px] bg-border/40 mx-14" />
            {renderSettingItem("information-circle-outline", "About Us", "Version 1.0.0")}
          </Card>
        </View>

        {/* Logout Button */}
        <View className="px-4 mt-8">
          <Button
            label="Logout"
            variant="ghost"
            icon={<Ionicons name="log-out-outline" size={20} color="#EF4444" />}
            onPress={handleLogout}
            className="bg-error/5"
            textClassName="text-error"
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
