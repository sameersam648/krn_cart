import { FlatList, Image, Text, TouchableOpacity, View, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useCart } from "@/lib/cart-context";
import { useOrders } from "@/lib/orders-context";
import { ScheduledOrderModal } from "@/components/scheduled-order-modal";
import { SubscriptionModal } from "@/components/subscription-modal";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function CartScreen() {
  const router = useRouter();
  const [showScheduledModal, setShowScheduledModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    getTax,
    getDeliveryFee,
    getTotal,
    clearCart,
    orderType,
    scheduledDateTime,
    setScheduledDateTime,
    subscriptionData,
    setSubscriptionData,
    customOrderData,
  } = useCart();
  const { addOrder } = useOrders();

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      Alert.alert("Empty Cart", "Please add items to your cart before placing an order");
      return;
    }

    if (orderType === 'scheduled' && !scheduledDateTime) {
      setShowScheduledModal(true);
      return;
    }

    if (orderType === 'regular' && !subscriptionData) {
      setShowSubscriptionModal(true);
      return;
    }

    if (orderType === 'custom' && !customOrderData) {
      Alert.alert("Custom Order Required", "Please add custom order details (photo, audio, or description)");
      return;
    }

    let total = getTotal();
    if (orderType === 'regular' && subscriptionData) {
      total = total * subscriptionData.occurrences;
    }

    const deliveryAddress = "123 Main Street, City"; // Mock address

    addOrder(items, total, deliveryAddress);
    clearCart();

    const orderTypeLabel =
      orderType === 'quick' ? 'Quick' :
        orderType === 'scheduled' ? 'Scheduled' :
          orderType === 'regular' ? 'Subscription' : 'Custom';

    Alert.alert("Order Placed!", `Your ${orderTypeLabel} order has been confirmed.`, [
      {
        text: "View Orders",
        onPress: () => {
          router.push("/(tabs)");
          setTimeout(() => router.push("/(tabs)/orders"), 100);
        },
      },
      {
        text: "Continue Shopping",
        onPress: () => {
          router.replace("/(tabs)");
        },
      },
    ]);
  };

  const renderOrderTypeHeader = () => {
    let headerText = "";
    let subtitleText = "";
    let iconName: any = "time-outline";

    switch (orderType) {
      case 'quick':
        iconName = "flash";
        headerText = "Quick Delivery";
        subtitleText = "Estimated delivery: 10 minutes";
        break;
      case 'scheduled':
        iconName = "calendar";
        headerText = "Scheduled Order";
        subtitleText = scheduledDateTime
          ? `Delivery: ${scheduledDateTime.toLocaleString()}`
          : "Please select date & time";
        break;
      case 'regular':
        iconName = "repeat";
        headerText = "Subscription Order";
        subtitleText = subscriptionData
          ? `${subscriptionData.frequency} - ${subscriptionData.occurrences} deliveries`
          : "Please set up subscription";
        break;
      case 'custom':
        iconName = "camera";
        headerText = "Custom Order";
        subtitleText = customOrderData
          ? (customOrderData.photoUri ? "✓ Photo added" : "✓ Audio/Description added")
          : "Please add custom details";
        break;
    }

    return (
      <View className="mx-4 mt-4 mb-2">
        <Card className="bg-primary/5 border-primary/20 flex-row items-center p-4">
          <View className="bg-primary/20 p-2 rounded-full mr-3">
            <Ionicons name={iconName} size={24} color="#FF6B35" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-foreground">{headerText}</Text>
            <Text className="text-xs text-muted mt-0.5">{subtitleText}</Text>

            {orderType === 'regular' && subscriptionData && (
              <View className="mt-2 pt-2 border-t border-primary/20">
                <Text className="text-xs text-muted">
                  {new Date(subscriptionData.startDate).toLocaleDateString()} - {new Date(subscriptionData.endDate).toLocaleDateString()}
                </Text>
              </View>
            )}

            {orderType === 'custom' && customOrderData?.description && (
              <View className="mt-2 pt-2 border-t border-primary/20">
                <Text className="text-xs text-muted italic">"{customOrderData.description}"</Text>
              </View>
            )}
          </View>
        </Card>
      </View>
    );
  };

  return (
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="px-5 py-4 border-b border-border/40 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-foreground">Your Cart</Text>
      </View>

      {items.length === 0 ? (
        <View className="flex-1 items-center justify-center p-8">
          <View className="bg-muted/10 p-6 rounded-full mb-6">
            <Ionicons name="cart-outline" size={64} color="#94A3B8" />
          </View>
          <Text className="text-xl font-bold text-foreground mb-2">Your cart is empty</Text>
          <Text className="text-muted text-center mb-8">Looks like you haven't added anything to your cart yet.</Text>
          <Button
            label="Start Shopping"
            onPress={() => router.push("/(tabs)")}
            size="lg"
            className="w-full"
          />
        </View>
      ) : (
        <>
          {renderOrderTypeHeader()}

          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card className="mx-4 mb-3 p-3 flex-row items-start bg-surface rounded-xl border-border/60 shadow-sm">
                <Image source={{ uri: item.menuItem.image }} className="w-20 h-20 rounded-lg bg-muted/20" />

                <View className="flex-1 ml-3 h-20 justify-between py-0.5">
                  <View>
                    <Text className="text-base font-bold text-foreground" numberOfLines={1}>{item.menuItem.name}</Text>
                    <Text className="text-sm font-medium text-primary">₹{item.menuItem.price}</Text>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center bg-muted/10 rounded-lg">
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                        className="px-2.5 py-1"
                      >
                        <Text className="text-foreground font-bold text-lg">−</Text>
                      </TouchableOpacity>
                      <Text className="text-foreground font-semibold px-2 w-8 text-center">{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                        className="px-2.5 py-1"
                      >
                        <Text className="text-foreground font-bold text-lg">+</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      onPress={() => removeItem(item.menuItem.id)}
                      className="bg-error/10 p-2 rounded-full"
                    >
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            )}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 12, paddingBottom: 120 }}
          />

          {/* Footer Summary & Button */}
          <View className="absolute bottom-0 left-0 right-0 bg-surface border-t border-border/80 p-5 pb-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <View className="space-y-2 mb-4">
              <View className="flex-row justify-between">
                <Text className="text-muted">Subtotal</Text>
                <Text className="text-foreground font-medium">₹{getSubtotal()}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted">Tax (5%)</Text>
                <Text className="text-foreground font-medium">₹{getTax()}</Text>
              </View>
              <View className="flex-row justify-between pb-2 border-b border-dashed border-border">
                <Text className="text-muted">Delivery Fee</Text>
                <Text className="text-foreground font-medium">₹{getDeliveryFee()}</Text>
              </View>

              {orderType === 'regular' && subscriptionData ? (
                <View className="flex-row justify-between pt-1">
                  <Text className="text-base font-bold text-foreground">Total ({subscriptionData.occurrences}x)</Text>
                  <Text className="text-xl font-extrabold text-primary">₹{getTotal() * subscriptionData.occurrences}</Text>
                </View>
              ) : (
                <View className="flex-row justify-between pt-1">
                  <Text className="text-base font-bold text-foreground">Total</Text>
                  <Text className="text-xl font-extrabold text-primary">₹{getTotal()}</Text>
                </View>
              )}
            </View>

            <Button
              label={orderType === 'regular' ? "Subscribe Now" : "Place Order"}
              onPress={handlePlaceOrder}
              size="lg"
            />
            {orderType === 'regular' && (
              <Text className="text-[10px] text-center text-muted mt-2">
                Prepayment required for subscription orders
              </Text>
            )}
          </View>
        </>
      )}

      {/* Modals */}
      <ScheduledOrderModal
        isVisible={showScheduledModal}
        onClose={() => setShowScheduledModal(false)}
        onConfirm={(dateTime) => {
          setScheduledDateTime(dateTime);
          setShowScheduledModal(false);
        }}
      />

      <SubscriptionModal
        isVisible={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onConfirm={(data) => {
          setSubscriptionData(data);
          setShowSubscriptionModal(false);
        }}
      />
    </ScreenContainer>
  );
}
