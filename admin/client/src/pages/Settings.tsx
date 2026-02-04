import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

interface SettingItem {
  key: string;
  label: string;
  description: string;
  type: "number" | "string" | "boolean";
  defaultValue: string | number | boolean;
}

const SETTINGS: SettingItem[] = [
  {
    key: "commission_percentage",
    label: "Commission Percentage",
    description: "Platform commission from each order (%)",
    type: "number",
    defaultValue: 15,
  },
  {
    key: "service_charge",
    label: "Service Charge",
    description: "Fixed service charge per order (₹)",
    type: "number",
    defaultValue: 0,
  },
  {
    key: "minimum_order_value",
    label: "Minimum Order Value",
    description: "Minimum order value allowed (₹)",
    type: "number",
    defaultValue: 0,
  },
  {
    key: "delivery_charge_base",
    label: "Base Delivery Charge",
    description: "Base delivery charge (₹)",
    type: "number",
    defaultValue: 50,
  },
  {
    key: "maintenance_mode",
    label: "Maintenance Mode",
    description: "Enable maintenance mode to restrict platform access",
    type: "boolean",
    defaultValue: false,
  },
  {
    key: "allow_new_restaurants",
    label: "Allow New Restaurant Registration",
    description: "Allow new restaurants to register on the platform",
    type: "boolean",
    defaultValue: true,
  },
  {
    key: "allow_new_riders",
    label: "Allow New Rider Registration",
    description: "Allow new riders to register on the platform",
    type: "boolean",
    defaultValue: true,
  },
];

export default function Settings() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const { data: allSettingsData } = trpc.settings.getAll.useQuery();
  const updateMutation = trpc.settings.update.useMutation({
    onSuccess: () => {
      toast.success("Setting updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update setting");
    },
  });

  useEffect(() => {
    if (allSettingsData && Array.isArray(allSettingsData) && allSettingsData.length > 0) {
      const settingsMap: Record<string, any> = {};
      (allSettingsData as any[]).forEach((setting: any) => {
        settingsMap[setting.key] = setting.value;
      });
      setSettings(settingsMap);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [allSettingsData]);

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = (key: string) => {
    const value = settings[key];
    if (value === undefined || value === null) {
      toast.error("Please enter a value");
      return;
    }

    updateMutation.mutate({
      key,
      value: String(value),
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-gray-500">Loading settings...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-600 mt-2">Configure platform-wide settings and features</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {SETTINGS.map((setting) => (
            <Card key={setting.key}>
              <CardHeader>
                <CardTitle className="text-lg">{setting.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{setting.description}</p>

                {setting.type === "boolean" ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {settings[setting.key] ? "Enabled" : "Disabled"}
                    </span>
                    <Switch
                      checked={settings[setting.key] === "true" || settings[setting.key] === true}
                      onCheckedChange={(checked) => {
                        handleChange(setting.key, checked);
                        updateMutation.mutate({
                          key: setting.key,
                          value: String(checked),
                        });
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      type={setting.type}
                      value={settings[setting.key] || ""}
                      onChange={(e) =>
                        handleChange(
                          setting.key,
                          setting.type === "number"
                            ? parseFloat(e.target.value) || 0
                            : e.target.value
                        )
                      }
                      placeholder={String(setting.defaultValue)}
                    />
                    <Button
                      onClick={() => handleSave(setting.key)}
                      disabled={updateMutation.isPending}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">About Settings</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-800 space-y-2">
            <p>
              These settings control the behavior and configuration of your KNR Cart platform.
            </p>
            <p>
              Changes take effect immediately and apply to all users and operations on the platform.
            </p>
            <p>
              Be careful when enabling maintenance mode as it will restrict access to the platform.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
