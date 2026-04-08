import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from "react-native";
import { SURAH_ARABIC } from "../constants/surahArabic";

const API = "https://ittiba-ittiba.hf.space";
const GOLD = "#C9A84C";
const GREEN = "#0A3D2B";
const GREEN_LIGHT = "#1D9E75";

export default function HistoryScreen() {
  const [dateHistory, setDateHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchData = async () => {
    try {
      const res = await fetch(API + "/history/dates");
      const data = await res.json();
      setDateHistory(data);
      if (data.length > 0 && !selectedDate) {
        setSelectedDate(data[0].date);
      }
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

  const selectedDay = dateHistory.find(d => d.date === selectedDate);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>History</Text>
        <Text style={styles.tagline}>Past recitations · Ittiba</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={GOLD} style={{ marginTop: 40 }} />
      ) : dateHistory.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No history yet.</Text>
          <Text style={styles.emptySubText}>Recitations will appear here after each prayer.</Text>
        </View>
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateTabs}>
            {dateHistory.map(d => (
              <TouchableOpacity
                key={d.date}
                style={[styles.dateTab, selectedDate === d.date && styles.dateTabActive]}
                onPress={() => setSelectedDate(d.date)}
              >
                <Text style={[styles.dateTabDay, selectedDate === d.date && styles.dateTabTextActive]}>{d.day}</Text>
                <Text style={[styles.dateTabArabic, selectedDate === d.date && styles.dateTabTextActive]}>{d.arabic_day}</Text>
                <Text style={[styles.dateTabDate, selectedDate === d.date && styles.dateTabTextActive]}>{d.date}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {selectedDay && (
            <ScrollView
              style={styles.scroll}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={GOLD} />}
            >
              <View style={styles.dateHeader}>
                <Text style={styles.dateHeaderArabic}>{selectedDay.arabic_day}</Text>
                <Text style={styles.dateHeaderGregorian}>{selectedDay.gregorian}</Text>
                <Text style={styles.dateHeaderArabicFull}>{selectedDay.arabic}</Text>
              </View>

              {selectedDay.entries.map((item, index) => (
                <View key={index} style={styles.historyItem}>
                  <View style={styles.historyLeft}>
                    <Text style={styles.historyMosque}>{item.mosque === "makkah" ? "Makkah" : "Madinah"} · {item.prayer} · Rakah {item.rakah}</Text>
                    <Text style={styles.historySurah}>{item.surah_name}</Text>
                    <Text style={styles.historySurahArabic}>{SURAH_ARABIC[item.surah] || ""}</Text>
                    <Text style={styles.historyAyah}>Ayahs {item.ayah_start} – {item.ayah_end}</Text>
                    <Text style={styles.historyConfidence}>Confidence: {Math.round(item.confidence * 100)}%</Text>
                  </View>
                  <Text style={styles.historyTime}>{new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
                </View>
              ))}
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f0e8" },
  header: { backgroundColor: GREEN, padding: 32, paddingTop: 60 },
  appName: { fontSize: 28, fontWeight: "600", color: GOLD },
  tagline: { fontSize: 13, color: "#9FE1CB", marginTop: 4 },
  dateTabs: { backgroundColor: GREEN, paddingBottom: 12, paddingHorizontal: 12, maxHeight: 80 },
  dateTab: { alignItems: "center", paddingHorizontal: 16, paddingVertical: 8, marginRight: 8, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.1)" },
  dateTabActive: { backgroundColor: GOLD },
  dateTabDay: { fontSize: 12, color: "#9FE1CB", fontWeight: "600" },
  dateTabDate: { fontSize: 10, color: "#9FE1CB", marginTop: 2 },
  dateTabArabic: { fontSize: 10, color: "#9FE1CB", marginTop: 1 },
  dateTabTextActive: { color: GREEN },
  scroll: { flex: 1 },
  dateHeader: { margin: 16, marginBottom: 8, backgroundColor: "#fff", borderRadius: 16, padding: 16, alignItems: "center" },
  dateHeaderArabic: { fontSize: 22, fontWeight: "600", color: GREEN },
  dateHeaderGregorian: { fontSize: 13, color: "#999", marginTop: 4 },
  dateHeaderArabicFull: { fontSize: 14, color: GOLD, marginTop: 4 },
  emptyCard: { margin: 16, backgroundColor: "#fff", borderRadius: 16, padding: 20, alignItems: "center" },
  emptyText: { fontSize: 16, color: "#333", marginBottom: 4 },
  emptySubText: { fontSize: 13, color: "#999", textAlign: "center" },
  historyItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", marginHorizontal: 16, marginBottom: 8, borderRadius: 12, padding: 16, borderLeftWidth: 3, borderLeftColor: GOLD },
  historyLeft: { flex: 1 },
  historyMosque: { fontSize: 11, color: GOLD, fontWeight: "600", marginBottom: 4 },
  historySurah: { fontSize: 16, fontWeight: "600", color: GREEN },
  historySurahArabic: { fontSize: 18, color: GREEN, marginTop: 2 },
  historyAyah: { fontSize: 12, color: "#999", marginTop: 2 },
  historyConfidence: { fontSize: 11, color: GREEN_LIGHT, marginTop: 4 },
  historyTime: { fontSize: 12, color: "#999" },
});
