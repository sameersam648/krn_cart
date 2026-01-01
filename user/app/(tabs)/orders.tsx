import { FlatList, Text, TouchableOpacity, View, Image } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useOrders } from "@/lib/orders-context";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "@/components/ui/Card";

export default function OrdersScreen() {
  const { orders } = useOrders();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-success/10 text-success';
      case 'processing': return 'bg-primary/10 text-primary';
      case 'cancelled': return 'bg-error/10 text-error';
      default: return 'bg-muted/10 text-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'checkmark-circle';
      case 'processing': return 'time';
      case 'cancelled': return 'close-circle';
      default: return 'help-circle';
    }
  };

  return (
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="px-5 py-4 border-b border-border/40">
        <Text className="text-2xl font-bold text-foreground">Order History</Text>
      </View>

      {orders.length === 0 ? (
        <View className="flex-1 items-center justify-center p-8">
          <View className="bg-muted/10 p-6 rounded-full mb-6">
            <Ionicons name="receipt-outline" size={64} color="#94A3B8" />
          </View>
          <Text className="text-xl font-bold text-foreground mb-2">No orders yet</Text>
          <Text className="text-muted text-center max-w-[250px]">
            Start ordering delicious meals to see them here!
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card className="mx-4 mb-3 p-4 bg-surface rounded-xl border-border/50 shadow-sm">
              {/* Order Header */}
              <View className="flex-row justify-between items-start mb-3 border-b border-border/30 pb-3">
                <View className="flex-row items-center">
                  <View className="bg-primary/10 p-2 rounded-lg mr-3">
                    <Ionicons name="restaurant-outline" size={20} color="#FF6B35" />
                  </View>
                  <View>
                    <Text className="text-sm font-bold text-foreground">Order #{item.id.slice(0, 8)}</Text>
                    <Text className="text-[10px] text-muted font-medium mt-0.5">{formatDate(item.date)}</Text>
                  </View>
                </View>
                <View className={`px-2.5 py-1 rounded-full flex-row items-center ${getStatusColor(item.status).split(' ')[0]}`}>
                  <Text className={`text-[10px] font-bold uppercase ${getStatusColor(item.status).split(' ')[1]}`}>{item.status}</Text>
                </View>
              </View>

              {/* Order Items Summary */}
              <View className="mb-3">
                {item.items.slice(0, 2).map((cartItem) => (
                  <View key={cartItem.id} className="flex-row justify-between items-center mb-1">
                    <Text className="text-sm text-foreground max-w-[80%]" numberOfLines={1}>
                      <Text className="font-semibold text-primary">{cartItem.quantity}x</Text> {cartItem.menuItem.name}
                    </Text>
                    <Text className="text-xs text-muted">₹{cartItem.menuItem.price * cartItem.quantity}</Text>
                  </View>
                ))}
                {item.items.length > 2 && (
                  <Text className="text-xs text-muted italic mt-1">
                    +{item.items.length - 2} more item{item.items.length - 2 !== 1 ? "s" : ""}
                  </Text>
                )}
              </View>

              {/* Footer */}
              <View className="flex-row justify-between items-center pt-3 border-t border-border/30">
                <View>
                  <Text className="text-[10px] text-muted uppercase font-bold tracking-wider">Total Amount</Text>
                  <Text className="text-lg font-bold text-primary">₹{item.total}</Text>
                </View>
                <TouchableOpacity className="bg-muted/5 px-4 py-2 rounded-lg border border-border/50">
                  <Text className="text-xs font-semibold text-foreground">View Details</Text>
                </TouchableOpacity>
              </View>
            </Card>
          )}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 12 }}
        />
      )}
    </ScreenContainer>
  );
}
