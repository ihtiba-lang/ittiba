import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { SURAH_ARABIC } from "../constants/surahArabic";

const API = "https://ittiba-ittiba.hf.space";
const GOLD = "#C9A84C";
const GREEN = "#0A3D2B";
const GREEN_LIGHT = "#1D9E75";

function getGregorianDate() {
  return new Date().toLocaleDateString("en-US", { timeZone: "Asia/Riyadh", weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function getHijriDate() {
  try {
    return new Date().toLocaleDateString("en-TN-u-ca-islamic", { timeZone: "Asia/Riyadh", weekday: "long", year: "numeric", month: "long", day: "numeric" });
  } catch (e) { return ""; }
}

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch(API + "/history");
      setHistory(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={GOLD} />}
    >
      <View style={styles.header}>
        <Text style={styles.appName}>History</Text>
        <Text style={styles.tagline}>Past recitations · Ittiba</Text>
      </View>

      <View style={styles.dateCard}>
        <Text style={styles.gregorianDate}>{getGregorianDate()}</Text>
        <Text style={styles.hijriDate}>{getHijriDate()}</Text>
      </View>

      <Text style={styles.sectionTitle}>Recent recitations</Text>

      {loading ? (
        <ActivityIndicator size="large" color={GOLD} style={{ marginTop: 20 }} />
      ) : history.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No history yet.</Text>
          <Text style={styles.emptySubText}>Recitations will appear here after each prayer.</Text>
        </View>
      ) : (
        history.map((item, index) => (
          <View key={index} style={styles.historyItem}>
            <View style={styles.historyLeft}>
              <Text style={styles.historyMosque}>{item.mosque === "makkah" ? "Makkah" : "Madinah"} · {item.prayer} · Rakah {item.rakah}</Text>
              <Text style={styles.historySurah}>{item.surah_name}</Text>
              <Text style={styles.historySurahArabic}>{SURAH_ARABIC[item.surah] || ""}</Text>
              <Text style={styles.historyAyah}>Ayahs {item.ayah_start} – {item.ayah_end}</Text>
              {item.confidence && <Text style={styles.historyConfidence}>Confidence: {Math.round(item.confidence * 100)}%</Text>}
            </View>
            <Text style={styles.historyTime}>{new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f0e8" },
  header: { backgroundColor: GREEN, padding: 32, paddingTop: 60 },
  appName: { fontSize: 28, fontWeight: "600", color: GOLD },
  tagline: { fontSize: 13, color: "#9FE1CB", marginTop: 4 },
  dateCard: { margin: 16, marginBottom: 8, backgroundColor: "#fff", borderRadius: 16, padding: 16, alignItems: "center" },
  gregorianDate: { fontSize: 14, fontWeight: "500", color: GREEN },
  hijriDate: { fontSize: 13, color: GOLD, marginTop: 4 },
  sectionTitle: { fontSize: 13, fontWeight: "600", color: "#999", paddingHorizontal: 16, marginBottom: 8 },
  emptyCard: { margin: 16, backgroundColor: "#fff", borderRadius: 16, padding: 20, alignItems: "center" },
  emptyText: { fontSize: 16, color: "#333", marginBottom: 4 },
  emptySubText: { fontSize: 13, color: "#999", textAlign: "center" },
  historyItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", marginHorizontal: 16, marginBottom: 8, borderRadius: 12, padding: 16, borderLeftWidth: 3, borderLeftColor: GOLD },
  historyLeft: { flex: 1 },
  historyMosque: { fontSize: 11, color: GOLD, fontWeight: "600", marginBottom: 4 },
  historySurah: { fontSize: 16, fontWeight: "600", color: GREEN },
  historySurahArabic: { fontSize: 18, color: GREEN, textAlign: "left", marginTop: 2 },
  historyAyah: { fontSize: 12, color: "#999", marginTop: 2 },
  historyConfidence: { fontSize: 11, color: GREEN_LIGHT, marginTop: 4 },
  historyTime: { fontSize: 12, color: "#999" },
});
