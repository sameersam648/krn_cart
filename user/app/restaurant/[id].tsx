import { FlatList, Image, Text, TouchableOpacity, View, StyleSheet, Animated } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { mockRestaurants, MenuItem as MenuItemType } from "@/lib/mock-data";
import { useCart } from "@/lib/cart-context";
import { useState, useCallback, memo, useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

// Toast notification component
const Toast = memo(function Toast({
  visible,
  message,
  onHide
}: {
  visible: boolean;
  message: string;
  onHide: () => void;
}) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Slide in
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after 2 seconds
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => onHide());
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [visible, translateY, opacity, onHide]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          transform: [{ translateY }],
          opacity,
        }
      ]}
    >
      <View style={styles.toastContent}>
        <View style={styles.toastIcon}>
          <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
        </View>
        <Text style={styles.toastText}>{message}</Text>
      </View>
    </Animated.View>
  );
});

// Separate MenuItem component to avoid re-render issues
const MenuItemCard = memo(function MenuItemCard({
  item,
  isSelected,
  quantity,
  onSelect,
  onQuantityChange,
  onAddToCart,
}: {
  item: MenuItemType;
  isSelected: boolean;
  quantity: number;
  onSelect: () => void;
  onQuantityChange: (q: number) => void;
  onAddToCart: () => void;
}) {
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onSelect} activeOpacity={0.9}>
        <View style={styles.itemRow}>
          {/* Item Image */}
          <Image source={{ uri: item.image }} style={styles.itemImage} />

          {/* Item Info */}
          <View style={styles.itemInfo}>
            <View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.price}>₹{item.price}</Text>
              <View style={[styles.chevronContainer, isSelected && styles.chevronSelected]}>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={isSelected ? "#FF6B35" : "#9CA3AF"}
                  style={isSelected ? { transform: [{ rotate: '180deg' }] } : undefined}
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Quantity Selector (shown when selected) */}
      {isSelected && (
        <View style={styles.quantitySection}>
          <View style={styles.quantityRow}>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                onPress={() => onQuantityChange(Math.max(1, quantity - 1))}
                style={styles.quantityBtn}
              >
                <Text style={styles.quantityBtnText}>−</Text>
              </TouchableOpacity>
              <View style={styles.quantityValue}>
                <Text style={styles.quantityText}>{quantity}</Text>
              </View>
              <TouchableOpacity
                onPress={() => onQuantityChange(Math.min(10, quantity + 1))}
                style={styles.quantityBtn}
              >
                <Text style={styles.quantityBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={onAddToCart}>
              <Ionicons name="cart" size={18} color="white" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
});

export default function RestaurantMenuScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const restaurant = mockRestaurants.find((r) => r.id === id);

  const showToast = useCallback((itemName: string, qty: number) => {
    setToastMessage(`${qty}x ${itemName} added to cart! 🛒`);
    setToastVisible(true);
  }, []);

  const hideToast = useCallback(() => {
    setToastVisible(false);
  }, []);

  const handleAddToCart = useCallback((itemId: string) => {
    if (!restaurant) return;
    const menuItem = restaurant.items.find((item) => item.id === itemId);
    if (menuItem) {
      addItem(restaurant.id, menuItem, quantity);
      showToast(menuItem.name, quantity);
      setQuantity(1);
      setSelectedItem(null);
    }
  }, [restaurant, quantity, addItem, showToast]);

  const handleSelect = useCallback((itemId: string) => {
    if (selectedItem === itemId) {
      setSelectedItem(null);
    } else {
      setSelectedItem(itemId);
      setQuantity(1);
    }
  }, [selectedItem]);

  if (!restaurant) {
    return (
      <ScreenContainer className="bg-background items-center justify-center">
        <Text className="text-foreground">Restaurant not found</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background" edges={["top", "left", "right"]}>
      {/* Toast Notification */}
      <Toast visible={toastVisible} message={toastMessage} onHide={hideToast} />

      <FlatList
        data={restaurant.items}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            {/* Header Image */}
            <View className="relative">
              <Image source={{ uri: restaurant.image }} className="w-full h-64 bg-muted/20" resizeMode="cover" />
              <View className="absolute top-4 left-4 z-10">
                <TouchableOpacity
                  onPress={() => router.back()}
                  className="bg-white/90 p-2 rounded-full shadow-sm backdrop-blur-md active:bg-white"
                >
                  <Ionicons name="arrow-back" size={24} color="#0F172A" />
                </TouchableOpacity>
              </View>
              <View className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
            </View>

            {/* Restaurant Details */}
            <View className="px-5 py-6 bg-background -mt-6 rounded-t-3xl shadow-sm border-b border-border/40">
              <View className="flex-row justify-between items-start">
                <View className="flex-1 mr-4">
                  <Text className="text-3xl font-bold text-foreground mb-1">{restaurant.name}</Text>
                  <Text className="text-base text-muted leading-5">{restaurant.description}</Text>
                </View>
                <View className="bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20 items-center">
                  <Text className="text-lg font-bold text-primary">{restaurant.rating} ★</Text>
                  <Text className="text-[10px] text-muted">Rating</Text>
                </View>
              </View>

              <View className="flex-row mt-4 space-x-6">
                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={18} color="#64748B" />
                  <Text className="ml-1.5 text-sm font-medium text-foreground">{restaurant.deliveryTime}</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="bicycle-outline" size={18} color="#64748B" />
                  <Text className="ml-1.5 text-sm font-medium text-foreground">Free Delivery</Text>
                </View>
              </View>
            </View>

            <Text className="px-5 mt-6 mb-3 text-lg font-bold text-foreground">Menu</Text>
          </>
        }
        renderItem={({ item }) => (
          <MenuItemCard
            item={item}
            isSelected={selectedItem === item.id}
            quantity={quantity}
            onSelect={() => handleSelect(item.id)}
            onQuantityChange={setQuantity}
            onAddToCart={() => handleAddToCart(item.id)}
          />
        )}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  // Toast styles
  toast: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  toastContent: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  toastIcon: {
    marginRight: 12,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  // Card styles - Dark theme
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#1E293B', // Dark surface color
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  itemRow: {
    flexDirection: 'row',
    padding: 12,
  },
  itemImage: {
    width: 96,
    height: 96,
    borderRadius: 12,
    backgroundColor: '#374151',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC', // Light text for dark background
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 12,
    color: '#9CA3AF', // Muted text
    lineHeight: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B35',
  },
  chevronContainer: {
    borderRadius: 20,
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  chevronSelected: {
    backgroundColor: 'rgba(255,107,53,0.2)',
  },
  quantitySection: {
    backgroundColor: 'rgba(255,107,53,0.1)', // Subtle orange tint
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A', // Darker background for controls
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  quantityBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityBtnText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF6B35',
  },
  quantityValue: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  quantityText: {
    fontWeight: '700',
    color: '#F8FAFC', // Light text
    fontSize: 16,
  },
  addButton: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});
