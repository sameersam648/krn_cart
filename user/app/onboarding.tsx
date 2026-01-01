import { View, Text, Image, useWindowDimensions, FlatList, Animated, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';

const ONBOARDING_DATA = [
    {
        id: '1',
        title: 'Delicious Food\nDelivered to You',
        description: 'Experience a world of culinary delights delivered right to your doorstep with just a few taps.',
        icon: 'restaurant',
        color: '#FF6B35'
    },
    {
        id: '2',
        title: 'Live Tracking\n& Fast Delivery',
        description: 'Track your food in real-time and enjoy super-fast delivery from your favorite restaurants.',
        icon: 'time',
        color: '#F59E0B'
    },
    {
        id: '3',
        title: 'Easy Payment\n& Safe Secure',
        description: 'Hassle-free payments with multiple options. Your security is our top priority.',
        icon: 'wallet',
        color: '#10B981'
    }
];

export default function OnboardingScreen() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;

    const viewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems && viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const handleNext = () => {
        if (currentIndex < ONBOARDING_DATA.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            router.replace('/(auth)/login');
        }
    };

    const handleSkip = () => {
        router.replace('/(auth)/login');
    };

    const Paginator = ({ data, scrollX }: any) => {
        return (
            <View className="flex-row h-16 pt-4 justify-center items-center gap-3">
                {data.map((_: any, i: number) => {
                    const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: [8, 24, 8],
                        extrapolate: 'clamp',
                    });
                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp',
                    });

                    return (
                        <Animated.View
                            key={i.toString()}
                            style={{ width: dotWidth, opacity }}
                            className={`h-2 rounded-full ${i === currentIndex ? 'bg-primary' : 'bg-muted'}`}
                        />
                    );
                })}
            </View>
        );
    };

    return (
        <ScreenContainer className="bg-background">
            <View className="flex-1">
                {/* Header (Skip) */}
                <View className="flex-row justify-end px-6 pt-6">
                    <TouchableOpacity onPress={handleSkip}>
                        <Text className="text-primary font-bold text-base">Skip</Text>
                    </TouchableOpacity>
                </View>

                {/* Carousel */}
                <View className="flex-3 justify-center items-center">
                    <FlatList
                        data={ONBOARDING_DATA}
                        renderItem={({ item }) => (
                            <View style={{ width }} className="items-center justify-center px-8">
                                <View className="w-64 h-64 bg-surface rounded-full items-center justify-center mb-10 shadow-lg border border-border/50" style={{ shadowColor: item.color, shadowOpacity: 0.2, shadowRadius: 20 }}>
                                    <View className="w-56 h-56 rounded-full items-center justify-center bg-background/50">
                                        <Ionicons name={item.icon as any} size={100} color={item.color} />
                                    </View>
                                </View>

                                <Text className="text-3xl font-extrabold text-foreground text-center mb-4 leading-tight">
                                    {item.title}
                                </Text>
                                <Text className="text-base text-muted text-center leading-6 px-4">
                                    {item.description}
                                </Text>
                            </View>
                        )}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled
                        bounces={false}
                        keyExtractor={(item) => item.id}
                        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                            useNativeDriver: false,
                        })}
                        scrollEventThrottle={32}
                        onViewableItemsChanged={viewableItemsChanged}
                        viewabilityConfig={viewConfig}
                        ref={flatListRef}
                    />
                </View>

                {/* Footer */}
                <View className="flex-1 px-8 justify-between pb-12">
                    <Paginator data={ONBOARDING_DATA} scrollX={scrollX} />

                    <Button
                        label={currentIndex === ONBOARDING_DATA.length - 1 ? "Get Started" : "Next"}
                        onPress={handleNext}
                        size="lg"
                        className="mt-8"
                    />
                </View>
            </View>
        </ScreenContainer>
    );
}
