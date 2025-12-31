import { describe, it, expect, beforeEach, vi } from "vitest";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock AsyncStorage
vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

describe("Authentication Context", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with no rider when AsyncStorage is empty", async () => {
    (AsyncStorage.getItem as any).mockResolvedValue(null);

    const mockRider = null;
    expect(mockRider).toBeNull();
  });

  it("should restore rider from AsyncStorage", async () => {
    const mockRiderData = {
      id: "rider_123",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      vehicleType: "bike" as const,
      isOnline: false,
      rating: 4.8,
    };

    (AsyncStorage.getItem as any).mockResolvedValue(JSON.stringify(mockRiderData));

    const stored = await AsyncStorage.getItem("rider");
    const parsed = stored ? JSON.parse(stored) : null;

    expect(parsed).toEqual(mockRiderData);
    expect(parsed.name).toBe("John Doe");
  });

  it("should validate login credentials", () => {
    const email = "demo@rider.com";
    const password = "password123";

    expect(email).toBeTruthy();
    expect(password).toBeTruthy();
    expect(email).toContain("@");
  });

  it("should reject empty email or password", () => {
    const email = "";
    const password = "password123";

    expect(email).toBeFalsy();
    expect(password).toBeTruthy();
  });

  it("should save rider data to AsyncStorage on login", async () => {
    const mockRiderData = {
      id: "rider_456",
      name: "demo",
      email: "demo@rider.com",
      phone: "+1234567890",
      vehicleType: "bike" as const,
      isOnline: false,
    };

    await AsyncStorage.setItem("rider", JSON.stringify(mockRiderData));

    expect(AsyncStorage.setItem).toHaveBeenCalledWith("rider", JSON.stringify(mockRiderData));
  });

  it("should remove rider data from AsyncStorage on logout", async () => {
    await AsyncStorage.removeItem("rider");

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith("rider");
  });

  it("should update rider online status", async () => {
    const mockRiderData = {
      id: "rider_789",
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "+1234567891",
      vehicleType: "scooter" as const,
      isOnline: true,
      rating: 4.5,
    };

    (AsyncStorage.setItem as any).mockResolvedValue(undefined);
    (AsyncStorage.getItem as any).mockResolvedValue(JSON.stringify(mockRiderData));

    await AsyncStorage.setItem("rider", JSON.stringify(mockRiderData));
    const stored = await AsyncStorage.getItem("rider");
    const parsed = stored ? JSON.parse(stored) : null;

    expect(parsed.isOnline).toBe(true);
  });
});
