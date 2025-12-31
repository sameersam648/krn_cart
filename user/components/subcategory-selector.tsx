import { View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { SubcategoryType, categoryHotels } from '@/lib/food-categories-data';
import { HotelList } from './hotel-list';

interface SubcategorySelectorProps {
    categoryPrefix: 'lunch' | 'dinner';
}

export function SubcategorySelector({ categoryPrefix }: SubcategorySelectorProps) {
    const [selectedType, setSelectedType] = useState<SubcategoryType>('VEG');

    const subcategories: SubcategoryType[] = ['VEG', 'NON-VEG', 'EGG'];

    // Get the appropriate hotels based on selection
    const getHotels = () => {
        const key = `${categoryPrefix}-${selectedType.toLowerCase().replace('-', '')}`;
        return categoryHotels[key] || [];
    };

    return (
        <View className="flex-1">
            {/* Tab Selector */}
            <View className="flex-row px-4 py-3 gap-2 bg-background border-b border-border">
                {subcategories.map((type) => (
                    <TouchableOpacity
                        key={type}
                        onPress={() => setSelectedType(type)}
                        className={`flex-1 py-3 rounded-lg items-center ${selectedType === type
                                ? 'bg-primary'
                                : 'bg-surface border border-border'
                            }`}
                    >
                        <Text
                            className={`font-semibold text-sm ${selectedType === type ? 'text-white' : 'text-foreground'
                                }`}
                        >
                            {type}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Hotel List */}
            <HotelList hotels={getHotels()} />
        </View>
    );
}
