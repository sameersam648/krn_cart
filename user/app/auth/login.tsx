import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Login Error", error instanceof Error ? error.message : "Failed to login");
    }
  };

  return (
    <ScreenContainer className="bg-background" edges={["top", "left", "right", "bottom"]}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center px-6 py-12">
          {/* Header */}
          <View className="items-center mb-12">
            <Text className="text-4xl font-bold text-primary mb-2">Foodie</Text>
            <Text className="text-base text-muted">Order food from your favorite restaurants</Text>
          </View>

          {/* Login Form */}
          <View className="gap-4">
            {/* Email Input */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Email Address</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground text-base"
                placeholder="Enter your email"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>

            {/* Password Input */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Password</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground text-base"
                placeholder="Enter your password"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className="bg-primary rounded-lg py-3 mt-4 active:opacity-80"
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text className="text-center text-white font-semibold text-base">
                {isLoading ? "Logging in..." : "Login"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Signup Link */}
          <View className="flex-row justify-center items-center mt-6">
            <Text className="text-muted text-sm">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
              <Text className="text-primary font-semibold text-sm">Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Demo Info */}
          <View className="mt-12 p-4 bg-surface rounded-lg border border-border">
            <Text className="text-xs font-semibold text-foreground mb-2">Demo Credentials:</Text>
            <Text className="text-xs text-muted">Email: demo@example.com</Text>
            <Text className="text-xs text-muted">Password: password123</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
