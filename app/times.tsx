import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from "react-native";

const API = "https://ittiba-ittiba.hf.space";
const GOLD = "#C9A84C";
const GREEN = "#0A3D2B";

const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

function formatTime(t) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return h12 + ":" + String(m).padStart(2, "0") + " " + ampm;
}

export default function TimesScreen() {
  const [times, setTimes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTimes = async () => {
    try {
      const res = await fetch(API + "/times");
      setTimes(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTimes();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchTimes(); }} tintColor={GOLD} />}
    >
      <View style={styles.header}>
        <Text style={styles.appName}>Prayer Times</Text>
        <Text style={styles.tagline}>Makkah & Madinah · Ittiba</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={GOLD} style={{ marginTop: 40 }} />
      ) : times ? (
        <View>
          <Text style={styles.sectionTitle}>Makkah · Masjid al-Haram</Text>
          <View style={styles.card}>
            {PRAYERS.map(prayer => (
              <View key={prayer} style={styles.prayerRow}>
                <Text style={styles.prayerName}>{prayer}</Text>
                <Text style={styles.prayerTime}>{formatTime(times.makkah[prayer])}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Madinah · Masjid an-Nabawi</Text>
          <View style={styles.card}>
            {PRAYERS.map(prayer => (
              <View key={prayer} style={styles.prayerRow}>
                <Text style={styles.prayerName}>{prayer}</Text>
                <Text style={styles.prayerTime}>{formatTime(times.madinah[prayer])}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.footnote}>All times are Saudi Arabia time (UTC+3)</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f0e8" },
  header: { backgroundColor: GREEN, padding: 32, paddingTop: 60 },
  appName: { fontSize: 28, fontWeight: "600", color: GOLD },
  tagline: { fontSize: 13, color: "#9FE1CB", marginTop: 4 },
  sectionTitle: { fontSize: 13, fontWeight: "600", color: "#999", paddingHorizontal: 16, marginTop: 16, marginBottom: 8 },
  card: { marginHorizontal: 16, backgroundColor: "#fff", borderRadius: 16, overflow: "hidden" },
  prayerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottomWidth: 0.5, borderBottomColor: "#f0ece0" },
  prayerName: { fontSize: 16, fontWeight: "500", color: GREEN },
  prayerTime: { fontSize: 16, color: GOLD, fontWeight: "600" },
  footnote: { fontSize: 12, color: "#999", textAlign: "center", margin: 16 },
});
