import React from "react";
import { ScrollView, Text, View, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";
import { useOrders } from "@/lib/order-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Ionicons } from "@expo/vector-icons";
import { formatCurrency } from "@/lib/constants";

export default function ProfileScreen() {
  const router = useRouter();
  const { rider, logout } = useAuth();
  const { completedOrders = [] } = useOrders();

  // Calculate stats with safe defaults
  const deliveredOrders = completedOrders.filter(o => o?.status === 'delivered') || [];
  const completedCount = deliveredOrders.length;
  const totalEarnings = deliveredOrders.reduce((sum, o) => sum + (o?.estimatedEarnings || 0), 0);
  const avgRating = 4.8; // Mock data

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            await logout();
            router.replace("/login");
          },
        },
      ]
    );
  };

  const renderSettingItem = (icon: string, label: string, value?: string, onPress?: () => void) => (
    <Button
      label={label}
      variant="ghost"
      size="lg"
      onPress={onPress || (() => Alert.alert("Coming Soon", `${label} feature coming soon!`))}
      className="justify-start mb-2"
      icon={<Ionicons name={icon as any} size={22} color="#64748B" />}
      textClassName="text-left flex-1"
    />
  );

  return (
    <ScreenContainer className="p-0 bg-background">
      {/* Header */}
      <View className="px-5 pt-6 pb-4 bg-surface border-b border-border/40">
        <Text className="text-3xl font-extrabold text-foreground">Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* Rider Info Card */}
        <Card className="mb-4 items-center py-6">
          <View className="w-24 h-24 bg-gradient-to-br from-primary to-orange-600 rounded-full items-center justify-center mb-4 shadow-lg">
            <Text className="text-4xl font-extrabold text-white">
              {rider?.name?.charAt(0).toUpperCase() || "R"}
            </Text>
          </View>
          <Text className="text-2xl font-extrabold text-foreground mb-1">
            {rider?.name || "Rider Name"}
          </Text>
          <Text className="text-base text-muted">{rider?.email || "rider@example.com"}</Text>
        </Card>

        {/* Stats Cards */}
        <View className="flex-row gap-3 mb-4">
          <Card className="flex-1 items-center py-4 bg-success/5">
            <Ionicons name="checkmark-done-circle" size={32} color="#10B981" />
            <Text className="text-3xl font-extrabold text-foreground mt-2">{completedCount}</Text>
            <Text className="text-xs text-muted font-bold uppercase">Deliveries</Text>
          </Card>
          <Card className="flex-1 items-center py-4 bg-primary/5">
            <Ionicons name="star" size={32} color="#FF6B35" />
            <Text className="text-3xl font-extrabold text-foreground mt-2">{avgRating}</Text>
            <Text className="text-xs text-muted font-bold uppercase">Rating</Text>
          </Card>
        </View>

        <Card className="mb-4 items-center py-4 bg-success/10 border-2 border-success/30">
          <Text className="text-xs font-bold text-muted uppercase mb-1">Total Earnings</Text>
          <Text className="text-4xl font-extrabold text-success">{formatCurrency(totalEarnings)}</Text>
        </Card>

        {/* Settings Section */}
        <Card className="mb-4">
          <Text className="text-base font-bold text-foreground mb-3 uppercase tracking-wide">Account Settings</Text>
          {renderSettingItem("person-outline", "Edit Profile")}
          {renderSettingItem("notifications-outline", "Notifications")}
          {renderSettingItem("card-outline", "Payment Methods")}
          {renderSettingItem("shield-checkmark-outline", "Privacy & Security")}
        </Card>

        <Card className="mb-4">
          <Text className="text-base font-bold text-foreground mb-3 uppercase tracking-wide">Support</Text>
          {renderSettingItem("help-circle-outline", "Help Center")}
          {renderSettingItem("chatbubble-outline", "Contact Support")}
          {renderSettingItem("document-text-outline", "Terms & Conditions")}
        </Card>

        {/* Logout Button */}
        <Button
          label="Logout"
          variant="danger"
          size="xl"
          onPress={handleLogout}
          icon={<Ionicons name="log-out" size={24} color="white" />}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
