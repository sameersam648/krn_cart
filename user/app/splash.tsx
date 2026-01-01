import { View, Text, Image, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ScreenContainer } from '@/components/screen-container';

export default function SplashScreen() {
    const router = useRouter();
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
                easing: Easing.elastic(1.2),
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();

        // Navigate after delay
        const timer = setTimeout(() => {
            router.replace('/onboarding');
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <ScreenContainer className="bg-primary items-center justify-center">
            <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: fadeAnim }} className="items-center">
                <View className="w-32 h-32 bg-white rounded-full items-center justify-center mb-6 shadow-xl">
                    <Text className="text-6xl">🍕</Text>
                </View>
                <Text className="text-4xl font-extrabold text-white tracking-widest text-center shadow-sm">
                    KNR CART
                </Text>
                <Text className="text-white/80 text-lg font-medium mt-2 tracking-wide text-center">
                    Deliciously Fast.
                </Text>
            </Animated.View>
        </ScreenContainer>
    );
}
