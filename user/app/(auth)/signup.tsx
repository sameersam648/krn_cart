import { useState } from "react";
import { ScrollView, Text, View, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SignupScreen() {
  const router = useRouter();
  const { signup, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      await signup(name, email, phone, password);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Signup Error", error instanceof Error ? error.message : "Failed to signup");
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
            <View className="items-center mb-10 space-y-2">
              <Text className="text-4xl font-bold text-primary tracking-tight">Create Account</Text>
              <Text className="text-base text-muted text-center">
                Join us and start satisfying your cravings
              </Text>
            </View>

            {/* Signup Form */}
            <View className="space-y-4">
              <Input
                label="Full Name"
                placeholder="John Doe"
                value={name}
                onChangeText={setName}
                editable={!isLoading}
              />

              <Input
                label="Email Address"
                placeholder="john@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />

              <Input
                label="Phone Number"
                placeholder="+1 234 567 8900"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                editable={!isLoading}
              />

              <Input
                label="Password"
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
              />

              <Input
                label="Confirm Password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!isLoading}
              />

              <Button
                label={isLoading ? "Creating account..." : "Sign Up"}
                onPress={handleSignup}
                loading={isLoading}
                size="lg"
                className="mt-4"
              />
            </View>

            {/* Login Link */}
            <View className="flex-row justify-center items-center mt-8 mb-8">
              <Text className="text-muted text-sm">Already have an account? </Text>
              <Button
                label="Login"
                variant="ghost"
                size="sm"
                onPress={() => router.back()}
                textClassName="text-primary font-bold"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}