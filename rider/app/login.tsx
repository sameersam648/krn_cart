import React, { useState } from 'react';
import { ScrollView, Text, View, Alert, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Login Failed', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer edges={['top', 'left', 'right', 'bottom']} className="bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="items-center mb-12">
            <View className="h-28 w-28 bg-primary/10 rounded-full items-center justify-center mb-6 shadow-lg border-2 border-primary/20">
              <Ionicons name="bicycle" size={56} color="#FF6B35" />
            </View>
            <Text className="text-4xl font-extrabold text-foreground mb-2 tracking-tight">
              Delivery Partner
            </Text>
            <Text className="text-base text-muted text-center max-w-[280px]">
              Sign in to start accepting deliveries
            </Text>
          </View>

          {/* Login Form */}
          <View className="gap-6">
            {/* Email Input */}
            <View>
              <Text className="text-sm font-bold text-foreground mb-2 uppercase tracking-wide">Email Address</Text>
              <View className="flex-row items-center bg-surface border-2 border-border rounded-xl px-4 py-4 focus:border-primary">
                <Ionicons name="mail-outline" size={20} color="#64748B" />
                <TextInput
                  className="flex-1 ml-3 text-base text-foreground font-semibold"
                  placeholder="rider@example.com"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Password Input */}
            <View>
              <Text className="text-sm font-bold text-foreground mb-2 uppercase tracking-wide">Password</Text>
              <View className="flex-row items-center bg-surface border-2 border-border rounded-xl px-4 py-4 focus:border-primary">
                <Ionicons name="lock-closed-outline" size={20} color="#64748B" />
                <TextInput
                  className="flex-1 ml-3 text-base text-foreground font-semibold"
                  placeholder="Enter your password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                  editable={!isLoading}
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            <Button
              label={isLoading ? "Signing In..." : "Sign In"}
              variant="primary"
              size="xl"
              onPress={handleLogin}
              loading={isLoading}
              className="mt-4"
            />
          </View>

          {/* Demo Info */}
          <Card className="mt-8 bg-primary/5 border-2 border-primary/20">
            <View className="flex-row items-start">
              <View className="bg-primary/20 p-2 rounded-lg mr-3">
                <Ionicons name="information-circle" size={20} color="#FF6B35" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-foreground mb-2 uppercase tracking-wide">Demo Credentials</Text>
                <Text className="text-sm text-muted leading-5">
                  Email: <Text className="text-foreground font-bold">demo@rider.com</Text>{'\n'}
                  Password: <Text className="text-foreground font-bold">demo123</Text>
                </Text>
              </View>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
