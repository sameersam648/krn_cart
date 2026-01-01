import { useState } from "react";
import { ScrollView, Text, View, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          className="px-6"
        >
          <View className="flex-1 justify-center py-12">
            {/* Header */}
            <View className="items-center mb-12 space-y-2">
              <View className="h-20 w-20 bg-primary/10 rounded-full items-center justify-center mb-4">
                <Text className="text-4xl">🍕</Text>
              </View>
              <Text className="text-4xl font-bold text-foreground tracking-tight">Welcome Back</Text>
              <Text className="text-base text-muted text-center max-w-[250px]">
                Sign in to continue your delicious journey
              </Text>
            </View>

            {/* Login Form */}
            <View className="space-y-6">
              <Input
                label="Email Address"
                placeholder="hello@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />

              <View>
                <Input
                  label="Password"
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  editable={!isLoading}
                />
                <Text className="text-right text-xs text-primary font-medium mt-2">Forgot Password?</Text>
              </View>

              <Button
                label={isLoading ? "Logging in..." : "Login"}
                onPress={handleLogin}
                loading={isLoading}
                size="lg"
                className="mt-2"
              />
            </View>

            {/* Signup Link */}
            <View className="flex-row justify-center items-center mt-8">
              <Text className="text-muted text-sm">Don't have an account? </Text>
              <Button
                label="Sign Up"
                variant="ghost"
                size="sm"
                onPress={() => router.push("/(auth)/signup")}
                textClassName="text-primary font-bold"
              />
            </View>

            {/* Demo Info */}
            <View className="mt-12 p-4 bg-surface rounded-2xl border border-dashed border-border/60">
              <Text className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider text-center">Demo Access</Text>
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-xs text-muted">Email</Text>
                  <Text className="text-xs font-medium text-foreground">demo@example.com</Text>
                </View>
                <View className="items-end">
                  <Text className="text-xs text-muted">Password</Text>
                  <Text className="text-xs font-medium text-foreground">password123</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}