import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';

export default function ProfileScreen() {
  const router = useRouter();
  const { restaurant, updateRestaurant, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState(restaurant?.name || '');
  const [address, setAddress] = useState(restaurant?.address || '');
  const [phone, setPhone] = useState(restaurant?.phone || '');
  const [isOpen, setIsOpen] = useState<boolean>(restaurant?.isOpen ?? true);

  const handleSave = async () => {
    if (!name.trim() || !address.trim() || !phone.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsSaving(true);
    try {
      if (restaurant) {
        await updateRestaurant({
          ...restaurant,
          name,
          address,
          phone,
          isOpen,
        });
        setIsEditing(false);
        Alert.alert('Success', 'Restaurant profile updated');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/login');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="gap-6">
          {/* Header */}
          <View className="flex-row justify-between items-center">
            <Text className="text-3xl font-bold text-foreground">Profile</Text>
            <TouchableOpacity
              onPress={() => setIsEditing(!isEditing)}
              className="bg-primary px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold text-sm">
                {isEditing ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Status Section */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-sm text-muted">Restaurant Status</Text>
                <Text className="text-lg font-semibold text-foreground mt-1">
                  {isOpen ? '🟢 Open' : '🔴 Closed'}
                </Text>
              </View>
              {isEditing && (
                <Switch
                  value={isOpen}
                  onValueChange={(value) => setIsOpen(value)}
                  trackColor={{ false: '#EF4444', true: '#22C55E' }}
                  thumbColor={isOpen ? '#22C55E' : '#EF4444'}
                />
              )}
            </View>
          </View>

          {/* Restaurant Info */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-4">
            <Text className="text-lg font-semibold text-foreground">Restaurant Information</Text>

            {/* Name */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Restaurant Name</Text>
              {isEditing ? (
                <TextInput
                  className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                  value={name}
                  onChangeText={setName}
                  placeholder="Restaurant name"
                  placeholderTextColor="#9BA1A6"
                  editable={!isSaving}
                />
              ) : (
                <Text className="text-base text-foreground">{name}</Text>
              )}
            </View>

            {/* Address */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Address</Text>
              {isEditing ? (
                <TextInput
                  className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Restaurant address"
                  placeholderTextColor="#9BA1A6"
                  editable={!isSaving}
                  multiline
                  numberOfLines={2}
                />
              ) : (
                <Text className="text-base text-foreground">{address}</Text>
              )}
            </View>

            {/* Phone */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Phone Number</Text>
              {isEditing ? (
                <TextInput
                  className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Phone number"
                  placeholderTextColor="#9BA1A6"
                  keyboardType="phone-pad"
                  editable={!isSaving}
                />
              ) : (
                <Text className="text-base text-foreground">{phone}</Text>
              )}
            </View>

            {/* Email */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Email</Text>
              <Text className="text-base text-foreground">{restaurant?.email}</Text>
            </View>
          </View>

          {/* Save Button */}
          {isEditing && (
            <TouchableOpacity
              onPress={handleSave}
              disabled={isSaving}
              style={{ opacity: isSaving ? 0.6 : 1 }}
              className="bg-primary rounded-lg py-4 items-center"
            >
              <Text className="text-white font-semibold text-base">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-error rounded-lg py-4 items-center"
          >
            <Text className="text-white font-semibold text-base">Logout</Text>
          </TouchableOpacity>

          {/* App Info */}
          <View className="bg-surface rounded-lg p-4 border border-border items-center gap-2">
            <Text className="text-xs text-muted">Restaurant Partner</Text>
            <Text className="text-xs text-muted">Version 1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
