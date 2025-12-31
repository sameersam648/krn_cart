import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, Alert } from "react-native";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";
import { CustomOrderData } from "@/lib/mock-data";

interface CustomOrderModalProps {
    isVisible: boolean;
    onClose: () => void;
    onConfirm: (data: CustomOrderData) => void;
}

export function CustomOrderModal({ isVisible, onClose, onConfirm }: CustomOrderModalProps) {
    const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);
    const [audioUri, setAudioUri] = useState<string | undefined>(undefined);
    const [description, setDescription] = useState("");
    const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);
    const [isRecording, setIsRecording] = useState(false);

    const requestPermissions = async () => {
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const audioPermission = await Audio.requestPermissionsAsync();

        return {
            camera: cameraPermission.status === "granted",
            mediaLibrary: mediaLibraryPermission.status === "granted",
            audio: audioPermission.status === "granted",
        };
    };

    const handleUploadPhoto = async () => {
        const permissions = await requestPermissions();
        if (!permissions.mediaLibrary) {
            Alert.alert("Permission Denied", "Please allow access to your media library");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setPhotoUri(result.assets[0].uri);
        }
    };

    const handleTakePhoto = async () => {
        const permissions = await requestPermissions();
        if (!permissions.camera) {
            Alert.alert("Permission Denied", "Please allow access to your camera");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setPhotoUri(result.assets[0].uri);
        }
    };

    const startRecording = async () => {
        try {
            const permissions = await requestPermissions();
            if (!permissions.audio) {
                Alert.alert("Permission Denied", "Please allow access to your microphone");
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            setRecording(recording);
            setIsRecording(true);
        } catch (err) {
            Alert.alert("Error", "Failed to start recording");
            console.error("Failed to start recording", err);
        }
    };

    const stopRecording = async () => {
        if (!recording) return;

        setIsRecording(false);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setAudioUri(uri || undefined);
        setRecording(undefined);
    };

    const handleConfirm = () => {
        if (!photoUri && !audioUri && !description) {
            Alert.alert("Required", "Please add at least a photo, audio, or description");
            return;
        }

        const customOrderData: CustomOrderData = {
            photoUri,
            audioUri,
            description: description || undefined,
        };

        onConfirm(customOrderData);

        // Reset state
        setPhotoUri(undefined);
        setAudioUri(undefined);
        setDescription("");
        onClose();
    };

    return (
        <Modal isVisible={isVisible} onBackdropPress={onClose} className="m-0 justify-end">
            <View className="bg-background rounded-t-3xl p-6 pb-8 max-h-[85%]">
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text className="text-2xl font-bold text-foreground mb-2">Book Your Own</Text>
                    <Text className="text-sm text-muted mb-6">
                        Upload a photo, take a picture, or record what you want to order
                    </Text>

                    {/* Photo Options */}
                    <View className="mb-6">
                        <Text className="text-sm font-semibold text-foreground mb-3">Add Photo</Text>
                        <View className="flex-row gap-3 mb-3">
                            <TouchableOpacity
                                onPress={handleUploadPhoto}
                                className="flex-1 bg-primary/10 border border-primary rounded-lg py-3 active:opacity-80"
                            >
                                <Text className="text-center text-primary font-semibold">📤 Upload</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleTakePhoto}
                                className="flex-1 bg-primary/10 border border-primary rounded-lg py-3 active:opacity-80"
                            >
                                <Text className="text-center text-primary font-semibold">📷 Camera</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Photo Preview */}
                        {photoUri && (
                            <View className="relative">
                                <Image source={{ uri: photoUri }} className="w-full h-48 rounded-lg" />
                                <TouchableOpacity
                                    onPress={() => setPhotoUri(undefined)}
                                    className="absolute top-2 right-2 bg-error rounded-full w-8 h-8 items-center justify-center"
                                >
                                    <Text className="text-white font-bold">✕</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Audio Recording */}
                    <View className="mb-6">
                        <Text className="text-sm font-semibold text-foreground mb-3">Voice Recording</Text>
                        {!audioUri ? (
                            <TouchableOpacity
                                onPress={isRecording ? stopRecording : startRecording}
                                className={`${isRecording ? 'bg-error' : 'bg-primary'
                                    } rounded-lg py-4 active:opacity-80`}
                            >
                                <Text className="text-center text-white font-semibold">
                                    {isRecording ? '⏹️ Stop Recording' : '🎤 Start Recording'}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <View className="bg-surface border border-border rounded-lg p-4 flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                    <Text className="text-2xl mr-2">🎵</Text>
                                    <Text className="text-foreground font-semibold">Audio recorded</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setAudioUri(undefined)}
                                    className="bg-error rounded-full w-8 h-8 items-center justify-center"
                                >
                                    <Text className="text-white font-bold">✕</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Description */}
                    <View className="mb-6">
                        <Text className="text-sm font-semibold text-foreground mb-2">
                            Additional Notes (Optional)
                        </Text>
                        <TextInput
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Describe what you want to order..."
                            placeholderTextColor="#94A3B8"
                            multiline
                            numberOfLines={4}
                            className="bg-surface border border-border rounded-lg p-4 text-foreground"
                            style={{ textAlignVertical: 'top' }}
                        />
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={onClose}
                            className="flex-1 bg-surface border border-border rounded-lg py-3 active:opacity-80"
                        >
                            <Text className="text-center text-foreground font-semibold">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleConfirm}
                            className="flex-1 bg-primary rounded-lg py-3 active:opacity-80"
                        >
                            <Text className="text-center text-white font-semibold">Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
}
