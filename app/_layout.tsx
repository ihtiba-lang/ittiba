import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: "#C9A84C",
      tabBarInactiveTintColor: "#9FE1CB",
      headerShown: false,
      tabBarStyle: { backgroundColor: "#0A3D2B", borderTopColor: "#1D9E75", paddingBottom: 4 }
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Live",
          tabBarIcon: ({ color, size }) => <Ionicons name="radio" color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="times"
        options={{
          title: "Times",
          tabBarIcon: ({ color, size }) => <Ionicons name="time" color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => <Ionicons name="book" color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="jumuah"
        options={{
          title: "Jumu'ah",
          tabBarIcon: ({ color, size }) => <Ionicons name="mic" color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color, size }) => <Ionicons name="information-circle" color={color} size={size} />
        }}
      />
    </Tabs>
  );
}
