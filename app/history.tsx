import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from "react-native";
import { SURAH_ARABIC } from "../constants/surahArabic";

const API = "https://ittiba-ittiba.hf.space";
const GOLD = "#C9A84C";
const GREEN = "#0A3D2B";
const GREEN_LIGHT = "#1D9E75";

const HIJRI_LOOKUP: Record<string, string> = {
  "2026-04-11":"23 Shawwal 1447 · ٢٣ شوال ١٤٤٧",
  "2026-04-12":"24 Shawwal 1447 · ٢٤ شوال ١٤٤٧",
  "2026-04-13":"25 Shawwal 1447 · ٢٥ شوال ١٤٤٧",
  "2026-04-14":"26 Shawwal 1447 · ٢٦ شوال ١٤٤٧",
  "2026-04-15":"27 Shawwal 1447 · ٢٧ شوال ١٤٤٧",
  "2026-04-16":"28 Shawwal 1447 · ٢٨ شوال ١٤٤٧",
  "2026-04-17":"29 Shawwal 1447 · ٢٩ شوال ١٤٤٧",
  "2026-04-18":"30 Shawwal 1447 · ٣٠ شوال ١٤٤٧",
  "2026-04-19":"1 Dhu al-Qidah 1447 · ١ ذو القعدة ١٤٤٧",
  "2026-04-20":"2 Dhu al-Qidah 1447 · ٢ ذو القعدة ١٤٤٧",
  "2026-04-21":"3 Dhu al-Qidah 1447 · ٣ ذو القعدة ١٤٤٧",
  "2026-04-22":"4 Dhu al-Qidah 1447 · ٤ ذو القعدة ١٤٤٧",
  "2026-04-23":"5 Dhu al-Qidah 1447 · ٥ ذو القعدة ١٤٤٧",
  "2026-04-24":"6 Dhu al-Qidah 1447 · ٦ ذو القعدة ١٤٤٧",
  "2026-04-25":"7 Dhu al-Qidah 1447 · ٧ ذو القعدة ١٤٤٧",
  "2026-04-26":"8 Dhu al-Qidah 1447 · ٨ ذو القعدة ١٤٤٧",
  "2026-04-27":"9 Dhu al-Qidah 1447 · ٩ ذو القعدة ١٤٤٧",
  "2026-04-28":"10 Dhu al-Qidah 1447 · ١٠ ذو القعدة ١٤٤٧",
  "2026-04-29":"11 Dhu al-Qidah 1447 · ١١ ذو القعدة ١٤٤٧",
  "2026-04-30":"12 Dhu al-Qidah 1447 · ١٢ ذو القعدة ١٤٤٧",
  "2026-05-01":"13 Dhu al-Qidah 1447 · ١٣ ذو القعدة ١٤٤٧",
  "2026-05-02":"14 Dhu al-Qidah 1447 · ١٤ ذو القعدة ١٤٤٧",
  "2026-05-03":"15 Dhu al-Qidah 1447 · ١٥ ذو القعدة ١٤٤٧",
  "2026-05-04":"16 Dhu al-Qidah 1447 · ١٦ ذو القعدة ١٤٤٧",
  "2026-05-05":"17 Dhu al-Qidah 1447 · ١٧ ذو القعدة ١٤٤٧",
  "2026-05-06":"18 Dhu al-Qidah 1447 · ١٨ ذو القعدة ١٤٤٧",
  "2026-05-07":"19 Dhu al-Qidah 1447 · ١٩ ذو القعدة ١٤٤٧",
  "2026-05-08":"20 Dhu al-Qidah 1447 · ٢٠ ذو القعدة ١٤٤٧",
  "2026-05-09":"21 Dhu al-Qidah 1447 · ٢١ ذو القعدة ١٤٤٧",
  "2026-05-10":"22 Dhu al-Qidah 1447 · ٢٢ ذو القعدة ١٤٤٧",
  "2026-05-11":"23 Dhu al-Qidah 1447 · ٢٣ ذو القعدة ١٤٤٧",
  "2026-05-12":"24 Dhu al-Qidah 1447 · ٢٤ ذو القعدة ١٤٤٧",
  "2026-05-13":"25 Dhu al-Qidah 1447 · ٢٥ ذو القعدة ١٤٤٧",
  "2026-05-14":"26 Dhu al-Qidah 1447 · ٢٦ ذو القعدة ١٤٤٧",
  "2026-05-15":"27 Dhu al-Qidah 1447 · ٢٧ ذو القعدة ١٤٤٧",
  "2026-05-16":"28 Dhu al-Qidah 1447 · ٢٨ ذو القعدة ١٤٤٧",
  "2026-05-17":"29 Dhu al-Qidah 1447 · ٢٩ ذو القعدة ١٤٤٧",
  "2026-05-18":"30 Dhu al-Qidah 1447 · ٣٠ ذو القعدة ١٤٤٧",
  "2026-05-19":"1 Dhu al-Hijjah 1447 · ١ ذو الحجة ١٤٤٧",
  "2026-05-20":"2 Dhu al-Hijjah 1447 · ٢ ذو الحجة ١٤٤٧",
  "2026-05-21":"3 Dhu al-Hijjah 1447 · ٣ ذو الحجة ١٤٤٧",
  "2026-05-22":"4 Dhu al-Hijjah 1447 · ٤ ذو الحجة ١٤٤٧",
  "2026-05-23":"5 Dhu al-Hijjah 1447 · ٥ ذو الحجة ١٤٤٧",
  "2026-05-24":"6 Dhu al-Hijjah 1447 · ٦ ذو الحجة ١٤٤٧",
  "2026-05-25":"7 Dhu al-Hijjah 1447 · ٧ ذو الحجة ١٤٤٧",
  "2026-05-26":"8 Dhu al-Hijjah 1447 · ٨ ذو الحجة ١٤٤٧",
  "2026-05-27":"9 Dhu al-Hijjah 1447 · ٩ ذو الحجة ١٤٤٧",
  "2026-05-28":"10 Dhu al-Hijjah 1447 · ١٠ ذو الحجة ١٤٤٧",
  "2026-05-29":"11 Dhu al-Hijjah 1447 · ١١ ذو الحجة ١٤٤٧",
  "2026-05-30":"12 Dhu al-Hijjah 1447 · ١٢ ذو الحجة ١٤٤٧",
  "2026-05-31":"13 Dhu al-Hijjah 1447 · ١٣ ذو الحجة ١٤٤٧",
  "2026-06-01":"14 Dhu al-Hijjah 1447 · ١٤ ذو الحجة ١٤٤٧",
  "2026-06-02":"15 Dhu al-Hijjah 1447 · ١٥ ذو الحجة ١٤٤٧",
  "2026-06-03":"16 Dhu al-Hijjah 1447 · ١٦ ذو الحجة ١٤٤٧",
  "2026-06-04":"17 Dhu al-Hijjah 1447 · ١٧ ذو الحجة ١٤٤٧",
  "2026-06-05":"18 Dhu al-Hijjah 1447 · ١٨ ذو الحجة ١٤٤٧",
  "2026-06-06":"19 Dhu al-Hijjah 1447 · ١٩ ذو الحجة ١٤٤٧",
  "2026-06-07":"20 Dhu al-Hijjah 1447 · ٢٠ ذو الحجة ١٤٤٧",
  "2026-06-08":"21 Dhu al-Hijjah 1447 · ٢١ ذو الحجة ١٤٤٧",
  "2026-06-09":"22 Dhu al-Hijjah 1447 · ٢٢ ذو الحجة ١٤٤٧",
  "2026-06-10":"23 Dhu al-Hijjah 1447 · ٢٣ ذو الحجة ١٤٤٧",
  "2026-06-11":"24 Dhu al-Hijjah 1447 · ٢٤ ذو الحجة ١٤٤٧",
  "2026-06-12":"25 Dhu al-Hijjah 1447 · ٢٥ ذو الحجة ١٤٤٧",
  "2026-06-13":"26 Dhu al-Hijjah 1447 · ٢٦ ذو الحجة ١٤٤٧",
  "2026-06-14":"27 Dhu al-Hijjah 1447 · ٢٧ ذو الحجة ١٤٤٧",
  "2026-06-15":"28 Dhu al-Hijjah 1447 · ٢٨ ذو الحجة ١٤٤٧",
  "2026-06-16":"29 Dhu al-Hijjah 1447 · ٢٩ ذو الحجة ١٤٤٧",
  "2026-06-17":"1 Muharram 1448 · ١ محرم ١٤٤٨",
};

function getHijriDate(dateStr: string): string {
  return HIJRI_LOOKUP[dateStr] || "";
}

export default function HistoryScreen() {
  const [dateHistory, setDateHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMosque, setSelectedMosque] = useState("makkah");

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
  const filteredEntries = selectedDay?.entries.filter(e => e.mosque === selectedMosque) || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>History</Text>
        <Text style={styles.tagline}>Past recitations · Ittiba</Text>
      </View>

      {/* Mosque tabs */}
      <View style={styles.mosqueTabs}>
        <TouchableOpacity
          style={[styles.mosqueTab, selectedMosque === "makkah" && styles.mosqueTabActive]}
          onPress={() => setSelectedMosque("makkah")}
        >
          <Text style={[styles.mosqueTabText, selectedMosque === "makkah" && styles.mosqueTabTextActive]}>🕋 Makkah</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.mosqueTab, selectedMosque === "madinah" && styles.mosqueTabActive]}
          onPress={() => setSelectedMosque("madinah")}
        >
          <Text style={[styles.mosqueTabText, selectedMosque === "madinah" && styles.mosqueTabTextActive]}>🌿 Madinah</Text>
        </TouchableOpacity>
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
          {/* Date tabs */}
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
                {getHijriDate(selectedDay.date) ? <Text style={styles.dateHeaderHijri}>{getHijriDate(selectedDay.date)}</Text> : null}
              </View>

              {filteredEntries.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyText}>No recitations recorded</Text>
                  <Text style={styles.emptySubText}>for {selectedMosque === "makkah" ? "Makkah" : "Madinah"} on this day.</Text>
                </View>
              ) : (
                filteredEntries.map((item, index) => (
                  <View key={index} style={styles.historyItem}>
                    <View style={styles.historyLeft}>
                      <Text style={styles.historyPrayer}>{item.prayer} · Rakah {item.rakah}</Text>
                      <Text style={styles.historySurah}>{item.surah_name}</Text>
                      <Text style={styles.historySurahArabic}>{SURAH_ARABIC[item.surah] || ""}</Text>
                      <Text style={styles.historyAyah}>Ayahs {item.ayah_start} – {item.ayah_end}</Text>
                      <Text style={styles.historyConfidence}>Confidence: {Math.round(item.confidence * 100)}%</Text>
                    </View>
                    <Text style={styles.historyTime}>{new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
                  </View>
                ))
              )}
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
  mosqueTabs: { flexDirection: "row", backgroundColor: GREEN, paddingHorizontal: 16, paddingBottom: 12 },
  mosqueTab: { flex: 1, alignItems: "center", paddingVertical: 8, borderRadius: 20, marginHorizontal: 4, backgroundColor: "rgba(255,255,255,0.1)" },
  mosqueTabActive: { backgroundColor: GOLD },
  mosqueTabText: { fontSize: 14, color: "#9FE1CB", fontWeight: "600" },
  mosqueTabTextActive: { color: GREEN },
  dateTabs: { backgroundColor: GREEN, paddingBottom: 12, paddingHorizontal: 12, maxHeight: 90 },
  dateTab: { alignItems: "center", paddingHorizontal: 16, paddingVertical: 8, marginRight: 8, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.1)" },
  dateTabActive: { backgroundColor: GOLD },
  dateTabDay: { fontSize: 12, color: "#9FE1CB", fontWeight: "600" },
  dateTabArabic: { fontSize: 11, color: "#9FE1CB", marginTop: 1 },
  dateTabDate: { fontSize: 10, color: "#9FE1CB", marginTop: 1 },
  dateTabTextActive: { color: GREEN },
  scroll: { flex: 1 },
  dateHeader: { margin: 16, marginBottom: 8, backgroundColor: "#fff", borderRadius: 16, padding: 16, alignItems: "center" },
  dateHeaderArabic: { fontSize: 22, fontWeight: "600", color: GREEN },
  dateHeaderGregorian: { fontSize: 13, color: "#999", marginTop: 4 },
  dateHeaderArabicFull: { fontSize: 14, color: GOLD, marginTop: 4 },
  dateHeaderHijri: { fontSize: 13, color: "#999", marginTop: 4, fontStyle: "italic" },
  emptyCard: { margin: 16, backgroundColor: "#fff", borderRadius: 16, padding: 20, alignItems: "center" },
  emptyText: { fontSize: 16, color: "#333", marginBottom: 4 },
  emptySubText: { fontSize: 13, color: "#999", textAlign: "center" },
  historyItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", marginHorizontal: 16, marginBottom: 8, borderRadius: 12, padding: 16, borderLeftWidth: 3, borderLeftColor: GOLD },
  historyLeft: { flex: 1 },
  historyPrayer: { fontSize: 11, color: GOLD, fontWeight: "600", marginBottom: 4 },
  historySurah: { fontSize: 16, fontWeight: "600", color: GREEN },
  historySurahArabic: { fontSize: 18, color: GREEN, marginTop: 2 },
  historyAyah: { fontSize: 12, color: "#999", marginTop: 2 },
  historyConfidence: { fontSize: 11, color: GREEN_LIGHT, marginTop: 4 },
  historyTime: { fontSize: 12, color: "#999" },
});
