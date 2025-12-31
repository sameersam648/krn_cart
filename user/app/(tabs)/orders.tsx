import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useOrders } from "@/lib/orders-context";

export default function OrdersScreen() {
  const { orders } = useOrders();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="px-4 py-4 border-b border-border">
        <Text className="text-2xl font-bold text-foreground">Order History</Text>
      </View>

      {orders.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-muted">No orders yet</Text>
          <Text className="text-sm text-muted mt-2">Start ordering to see your history</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="mx-4 mb-3 p-4 rounded-lg bg-surface border border-border active:opacity-80"
            >
              {/* Order Header */}
              <View className="flex-row justify-between items-start mb-3">
                <View>
                  <Text className="text-sm font-bold text-foreground">{item.id}</Text>
                  <Text className="text-xs text-muted mt-1">{formatDate(item.date)}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-base font-bold text-primary">₹{item.total}</Text>
                  <Text className="text-xs text-success font-semibold mt-1">{item.status}</Text>
                </View>
              </View>

              {/* Order Items Summary */}
              <View className="border-t border-border pt-3">
                <Text className="text-xs text-muted mb-2">
                  {item.items.length} item{item.items.length !== 1 ? "s" : ""}
                </Text>
                {item.items.slice(0, 2).map((cartItem) => (
                  <Text key={cartItem.id} className="text-xs text-foreground">
                    • {cartItem.menuItem.name} x{cartItem.quantity}
                  </Text>
                ))}
                {item.items.length > 2 && (
                  <Text className="text-xs text-muted mt-1">
                    +{item.items.length - 2} more item{item.items.length - 2 !== 1 ? "s" : ""}
                  </Text>
                )}
              </View>

              {/* Delivery Address */}
              <View className="mt-3 pt-3 border-t border-border">
                <Text className="text-xs text-muted">Delivered to:</Text>
                <Text className="text-xs text-foreground mt-1">{item.deliveryAddress}</Text>
              </View>
            </TouchableOpacity>
          )}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 12 }}
        />
      )}
    </ScreenContainer>
  );
}
