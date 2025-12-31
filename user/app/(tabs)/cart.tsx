import { FlatList, Image, Text, TouchableOpacity, View, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useCart } from "@/lib/cart-context";
import { useOrders } from "@/lib/orders-context";
import { ScheduledOrderModal } from "@/components/scheduled-order-modal";
import { SubscriptionModal } from "@/components/subscription-modal";
import { useState } from "react";

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

    // For scheduled orders, ensure date/time is set
    if (orderType === 'scheduled' && !scheduledDateTime) {
      setShowScheduledModal(true);
      return;
    }

    // For subscription orders, ensure subscription data is set
    if (orderType === 'regular' && !subscriptionData) {
      setShowSubscriptionModal(true);
      return;
    }

    // For custom orders, ensure custom data is set
    if (orderType === 'custom' && !customOrderData) {
      Alert.alert("Custom Order Required", "Please add custom order details (photo, audio, or description)");
      return;
    }

    // Calculate total (for subscriptions, multiply by occurrences)
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
    let icon = "";

    switch (orderType) {
      case 'quick':
        icon = "⚡";
        headerText = "Quick Delivery";
        subtitleText = "Estimated delivery: 10 minutes";
        break;
      case 'scheduled':
        icon = "📅";
        headerText = "Scheduled Order";
        subtitleText = scheduledDateTime
          ? `Delivery: ${scheduledDateTime.toLocaleString()}`
          : "Please select date & time";
        break;
      case 'regular':
        icon = "🔄";
        headerText = "Subscription Order";
        subtitleText = subscriptionData
          ? `${subscriptionData.frequency} - ${subscriptionData.occurrences} deliveries`
          : "Please set up subscription";
        break;
      case 'custom':
        icon = "📸";
        headerText = "Custom Order";
        subtitleText = customOrderData
          ? (customOrderData.photoUri ? "✓ Photo added" : "✓ Audio/Description added")
          : "Please add custom details";
        break;
    }

    return (
      <View className="mx-4 mt-4 mb-3 p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <View className="flex-row items-center mb-1">
          <Text className="text-2xl mr-2">{icon}</Text>
          <Text className="text-base font-bold text-foreground">{headerText}</Text>
        </View>
        <Text className="text-xs text-muted ml-9">{subtitleText}</Text>

        {orderType === 'regular' && subscriptionData && (
          <View className="mt-2 pt-2 border-t border-border/30">
            <Text className="text-xs text-muted">
              From {new Date(subscriptionData.startDate).toLocaleDateString()} to{" "}
              {new Date(subscriptionData.endDate).toLocaleDateString()}
            </Text>
          </View>
        )}

        {orderType === 'custom' && customOrderData?.description && (
          <View className="mt-2 pt-2 border-t border-border/30">
            <Text className="text-xs text-muted">"{customOrderData.description}"</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="px-4 py-4 border-b border-border">
        <Text className="text-2xl font-bold text-foreground">Your Cart</Text>
      </View>

      {items.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-muted mb-4">Your cart is empty</Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)")}
            className="bg-primary px-6 py-3 rounded-lg active:opacity-80"
          >
            <Text className="text-white font-semibold">Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Order Type Header */}
          {renderOrderTypeHeader()}

          {/* Cart Items */}
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="mx-4 mb-3 p-3 rounded-lg bg-surface border border-border flex-row">
                <Image source={{ uri: item.menuItem.image }} className="w-16 h-16 rounded" />

                <View className="flex-1 ml-3 justify-between">
                  <View>
                    <Text className="text-sm font-bold text-foreground">{item.menuItem.name}</Text>
                    <Text className="text-xs text-muted">₹{item.menuItem.price} each</Text>
                  </View>

                  {/* Quantity Controls */}
                  <View className="flex-row items-center gap-2">
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                      className="bg-primary rounded px-2 py-1 active:opacity-80"
                    >
                      <Text className="text-white font-bold text-sm">−</Text>
                    </TouchableOpacity>
                    <Text className="text-foreground font-semibold w-6 text-center">{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                      className="bg-primary rounded px-2 py-1 active:opacity-80"
                    >
                      <Text className="text-white font-bold text-sm">+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => removeItem(item.menuItem.id)}
                      className="ml-auto"
                    >
                      <Text className="text-error font-semibold text-sm">Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Item Total */}
                <View className="ml-2 justify-center">
                  <Text className="text-sm font-bold text-primary">
                    ₹{item.menuItem.price * item.quantity}
                  </Text>
                </View>
              </View>
            )}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 12 }}
          />

          {/* Order Summary */}
          <View className="mx-4 mb-4 p-4 rounded-lg bg-surface border border-border">
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-muted">Subtotal</Text>
              <Text className="text-sm font-semibold text-foreground">₹{getSubtotal()}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-muted">Tax (5%)</Text>
              <Text className="text-sm font-semibold text-foreground">₹{getTax()}</Text>
            </View>
            <View className="flex-row justify-between mb-3 pb-3 border-b border-border">
              <Text className="text-sm text-muted">Delivery Fee</Text>
              <Text className="text-sm font-semibold text-foreground">₹{getDeliveryFee()}</Text>
            </View>

            {orderType === 'regular' && subscriptionData && (
              <>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-sm text-muted">Per delivery</Text>
                  <Text className="text-sm font-semibold text-foreground">₹{getTotal()}</Text>
                </View>
                <View className="flex-row justify-between mb-3 pb-3 border-b border-border">
                  <Text className="text-sm text-muted">× {subscriptionData.occurrences} deliveries</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    ₹{getTotal() * subscriptionData.occurrences}
                  </Text>
                </View>
              </>
            )}

            <View className="flex-row justify-between">
              <Text className="text-base font-bold text-foreground">Total</Text>
              <Text className="text-lg font-bold text-primary">
                ₹{orderType === 'regular' && subscriptionData ? getTotal() * subscriptionData.occurrences : getTotal()}
              </Text>
            </View>

            {orderType === 'regular' && (
              <View className="mt-3 pt-3 border-t border-border">
                <Text className="text-xs text-warning font-semibold">
                  ⚠️ Prepayment required - Cash on Delivery not available
                </Text>
              </View>
            )}
          </View>

          {/* Place Order Button */}
          <View className="mx-4 mb-6">
            <TouchableOpacity
              onPress={handlePlaceOrder}
              className="bg-primary rounded-lg py-4 active:opacity-80"
            >
              <Text className="text-center text-white font-bold text-base">Place Order</Text>
            </TouchableOpacity>
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
