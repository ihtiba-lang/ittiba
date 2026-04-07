import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: "#C9A84C",
      tabBarInactiveTintColor: "#999",
      headerShown: false,
      tabBarStyle: { backgroundColor: "#0A3D2B", borderTopColor: "#1D9E75" }
    }}>
      <Tabs.Screen name="index" options={{ title: "Live" }} />
      <Tabs.Screen name="times" options={{ title: "Times" }} />
      <Tabs.Screen name="history" options={{ title: "History" }} />
      <Tabs.Screen name="about" options={{ title: "About" }} />
    </Tabs>
  );
}
