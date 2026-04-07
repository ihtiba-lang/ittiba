import { View, Text, StyleSheet, ScrollView } from "react-native";

const GOLD = "#C9A84C";
const GREEN = "#0A3D2B";

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>Ittiba</Text>
        <Text style={styles.tagline}>Follow the recitation live</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.arabicTitle}>اتِّبَاع</Text>
        <Text style={styles.meaning}>From the Arabic — to follow, to trace the steps of</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>What is Ittiba?</Text>
        <Text style={styles.body}>Ittiba identifies the surah being recited live at Masjid al-Haram in Makkah and Masjid an-Nabawi in Madinah during each prayer. You receive a notification after each rakah telling you which surah and ayahs were recited.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>How it works</Text>
        <Text style={styles.body}>At each prayer time, Ittiba listens to the live Saudi Quran TV and Sunnah TV streams. It uses an AI model trained specifically on Quran recitation to identify the surah and ayah range. Results are pushed to your phone in real time.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Prayers covered</Text>
        <Text style={styles.body}>Fajr, Maghrib, and Isha — the three prayers with audible recitation. Jumu'ah on Fridays. Dhuhr and Asr are silent prayers and are not tracked.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Accuracy</Text>
        <Text style={styles.body}>Ittiba uses confidence scoring — it only sends a notification when it is confident about the surah. If confidence is too low it keeps listening until it finds a match.</Text>
      </View>

      <Text style={styles.footer}>Made with love for the Ummah 🤍</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f0e8" },
  header: { backgroundColor: GREEN, padding: 32, paddingTop: 60 },
  appName: { fontSize: 36, fontWeight: "600", color: GOLD, letterSpacing: -0.5 },
  tagline: { fontSize: 14, color: "#9FE1CB", marginTop: 4 },
  card: { margin: 16, marginBottom: 0, marginTop: 12, backgroundColor: "#fff", borderRadius: 16, padding: 20 },
  arabicTitle: { fontSize: 36, color: GREEN, textAlign: "center", marginBottom: 8 },
  meaning: { fontSize: 14, color: "#999", textAlign: "center", fontStyle: "italic" },
  sectionTitle: { fontSize: 14, fontWeight: "600", color: GOLD, marginBottom: 8 },
  body: { fontSize: 14, color: "#444", lineHeight: 22 },
  footer: { textAlign: "center", color: "#999", fontSize: 13, margin: 24 },
});
