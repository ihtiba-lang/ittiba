import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const GOLD = "#C9A84C";
const GREEN = "#0A3D2B";
const GREEN_LIGHT = "#1D9E75";

const KHUTBAH_LINKS = {
  makkah: {
    name: "Masjid al-Haram",
    arabic: "المسجد الحرام",
    url: "https://theislamicinformation.com/more/listen-masjid-al-haram-friday-khutbah/",
    languages: ["Arabic", "English", "Urdu", "French", "Turkish", "Indonesian", "Malay", "Russian", "Hindi", "Chinese", "Hausa", "Farsi"]
  },
  madinah: {
    name: "Masjid an-Nabawi",
    arabic: "المسجد النبوي",
    url: "https://theislamicinformation.com/more/listen-masjid-an-nabawi-friday-khutbah/",
    languages: ["Arabic", "English", "Urdu", "French", "Turkish", "Indonesian", "Malay", "Russian", "Hindi", "Chinese", "Hausa", "Farsi"]
  }
};

const LANGUAGE_FLAGS = {
  "Arabic": "🇸🇦", "English": "🇬🇧", "Urdu": "🇵🇰", "French": "🇫🇷",
  "Turkish": "🇹🇷", "Indonesian": "🇮🇩", "Malay": "🇲🇾", "Russian": "🇷🇺",
  "Hindi": "🇮🇳", "Chinese": "🇨🇳", "Hausa": "🇳🇬", "Farsi": "🇮🇷"
};

export default function JumuahScreen() {
  const [selectedMosque, setSelectedMosque] = useState("makkah");
  const [prayerTime, setPrayerTime] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const mosque = KHUTBAH_LINKS[selectedMosque];

  const fetchTimes = async () => {
    try {
      const r = await fetch("https://ittiba-ittiba.hf.space/times");
      const data = await r.json();
      const times = selectedMosque === "makkah" ? data.makkah : data.madinah;
      setPrayerTime(times?.Dhuhr || null);
    } catch (e) {} finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTimes();
  }, [selectedMosque]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchTimes(); }} tintColor={GOLD} />}
    >
      <View style={styles.header}>
        <Text style={styles.appName}>الجمعة</Text>
        <Text style={styles.appNameEn}>Jumu'ah</Text>
        <Text style={styles.tagline}>Friday Sermon · Ittiba</Text>
      </View>

      {/* Mosque Selector */}
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

      {/* Mosque Info */}
      <View style={styles.mosqueCard}>
        <Text style={styles.mosqueArabic}>{mosque.arabic}</Text>
        <Text style={styles.mosqueName}>{mosque.name}</Text>
        {prayerTime && (
          <View style={styles.timeRow}>
            <Ionicons name="time" size={14} color={GOLD} />
            <Text style={styles.timeText}>Jumuah begins around {prayerTime} Saudi time</Text>
          </View>
        )}
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>📻 Live Khutbah Translation</Text>
        <Text style={styles.infoBody}>
          Every Friday, the sermon from {mosque.name} is broadcast live with translations in 12 languages. Tap a language below to listen.
        </Text>
      </View>

      {/* Language Buttons */}
      <Text style={styles.sectionTitle}>Choose your language</Text>
      <View style={styles.languageGrid}>
        {mosque.languages.map((lang) => (
          <TouchableOpacity
            key={lang}
            style={styles.langButton}
            onPress={() => Linking.openURL(mosque.url)}
          >
            <Text style={styles.langFlag}>{LANGUAGE_FLAGS[lang] || "🌐"}</Text>
            <Text style={styles.langText}>{lang}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Listen Button */}
      <TouchableOpacity style={styles.listenButton} onPress={() => Linking.openURL(mosque.url)}>
        <Ionicons name="headset" size={20} color={GREEN} />
        <Text style={styles.listenButtonText}>Open Khutbah Player</Text>
      </TouchableOpacity>

      {/* Note */}
      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>📖 About the Friday Sermon</Text>
        <Text style={styles.noteBody}>
          The Khutbah consists of two parts. The imam delivers the sermon in Arabic at Dhuhr time every Friday. Live translations are provided by the General Presidency of the Two Holy Mosques.
        </Text>
      </View>

      <Text style={styles.footer}>يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِن يَوْمِ الْجُمُعَةِ</Text>
      <Text style={styles.footerEn}>O you who believe! When the call for prayer is made on Friday... (62:9)</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f0e8" },
  header: { backgroundColor: GREEN, padding: 32, paddingTop: 60 },
  appName: { fontSize: 36, fontWeight: "600", color: GOLD },
  appNameEn: { fontSize: 22, fontWeight: "600", color: "#fff", marginTop: 2 },
  tagline: { fontSize: 13, color: "#9FE1CB", marginTop: 4 },
  mosqueTabs: { flexDirection: "row", backgroundColor: GREEN, paddingHorizontal: 16, paddingBottom: 16 },
  mosqueTab: { flex: 1, alignItems: "center", paddingVertical: 8, borderRadius: 20, marginHorizontal: 4, backgroundColor: "rgba(255,255,255,0.1)" },
  mosqueTabActive: { backgroundColor: GOLD },
  mosqueTabText: { fontSize: 14, color: "#9FE1CB", fontWeight: "600" },
  mosqueTabTextActive: { color: GREEN },
  mosqueCard: { margin: 16, marginBottom: 8, backgroundColor: "#fff", borderRadius: 16, padding: 20, alignItems: "center" },
  mosqueArabic: { fontSize: 24, color: GREEN, fontWeight: "600" },
  mosqueName: { fontSize: 14, color: "#999", marginTop: 4 },
  timeRow: { flexDirection: "row", alignItems: "center", marginTop: 8, gap: 4 },
  timeText: { fontSize: 13, color: GOLD },
  infoCard: { marginHorizontal: 16, marginBottom: 8, backgroundColor: "#fff", borderRadius: 16, padding: 16 },
  infoTitle: { fontSize: 14, fontWeight: "600", color: GREEN, marginBottom: 8 },
  infoBody: { fontSize: 13, color: "#555", lineHeight: 20 },
  sectionTitle: { fontSize: 12, fontWeight: "600", color: "#999", paddingHorizontal: 16, marginBottom: 8, marginTop: 4 },
  languageGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 12, gap: 8, marginBottom: 16 },
  langButton: { backgroundColor: "#fff", borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14, alignItems: "center", borderWidth: 1, borderColor: "#e0d9cc", minWidth: 80 },
  langFlag: { fontSize: 20 },
  langText: { fontSize: 11, color: GREEN, fontWeight: "600", marginTop: 4 },
  listenButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: GOLD, marginHorizontal: 16, borderRadius: 16, padding: 16, gap: 8, marginBottom: 16 },
  listenButtonText: { fontSize: 16, fontWeight: "600", color: GREEN },
  noteCard: { marginHorizontal: 16, marginBottom: 16, backgroundColor: "#fff", borderRadius: 16, padding: 16 },
  noteTitle: { fontSize: 14, fontWeight: "600", color: GOLD, marginBottom: 8 },
  noteBody: { fontSize: 13, color: "#555", lineHeight: 20 },
  footer: { textAlign: "center", color: GREEN, fontSize: 14, marginHorizontal: 16, marginBottom: 4, fontWeight: "500" },
  footerEn: { textAlign: "center", color: "#999", fontSize: 11, marginHorizontal: 16, marginBottom: 24, fontStyle: "italic" },
});
