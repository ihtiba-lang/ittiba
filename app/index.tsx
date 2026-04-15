
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { SURAH_ARABIC } from "../constants/surahArabic";
import * as Location from "expo-location";
import { Magnetometer } from "expo-sensors";

const HIJRI_LOOKUP = {
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

function getHijriString() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return HIJRI_LOOKUP[y + "-" + m + "-" + d] || "";
}


const API = "https://ittiba-ittiba.hf.space";
const PROJECT_ID = "a6c00a10-7005-4bdf-a2c6-83cc49f20490";
const GOLD = "#C9A84C";
const GREEN = "#0A3D2B";
const GREEN_LIGHT = "#1D9E75";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotifications() {
  if (!Device.isDevice) return null;
  const { status: existing } = await Notifications.getPermissionsAsync();
  let status = existing;
  if (existing !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    status = newStatus;
  }
  if (status !== "granted") return null;
  const token = (await Notifications.getExpoPushTokenAsync({ projectId: PROJECT_ID })).data;
  return token;
}

function getSaudiTime() {
  return new Date().toLocaleTimeString("en-US", { timeZone: "Asia/Riyadh", hour: "2-digit", minute: "2-digit", hour12: true });
}

function getLocalTime() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function getDateParts() {
  const now = new Date();
  const day = now.toLocaleDateString("en-US", { timeZone: "Asia/Riyadh", day: "numeric" });
  const month = now.toLocaleDateString("en-US", { timeZone: "Asia/Riyadh", month: "long" });
  const year = now.toLocaleDateString("en-US", { timeZone: "Asia/Riyadh", year: "numeric" });
  const weekday = now.toLocaleDateString("en-US", { timeZone: "Asia/Riyadh", weekday: "long" });
  return { day, month, year, weekday };
}

const ARABIC_DAYS = {
  "Monday": "الاثنين", "Tuesday": "الثلاثاء", "Wednesday": "الأربعاء",
  "Thursday": "الخميس", "Friday": "الجمعة", "Saturday": "السبت", "Sunday": "الأحد"
};

const ARABIC_DAYS_TRANSLITERATED = {
  "Monday": "Al-Ithnayn · الاثنين",
  "Tuesday": "Al-Thulatha · الثلاثاء",
  "Wednesday": "Al-Arbi'a · الأربعاء",
  "Thursday": "Al-Khamees · الخميس",
  "Friday": "Al-Jumu'ah · الجمعة",
  "Saturday": "Al-Sabt · السبت",
  "Sunday": "Al-Ahad · الأحد"
};







function getSaudiNow() {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utcMs + 3 * 3600000);
}

function getCountdown(prayerTime) {
  if (!prayerTime || typeof prayerTime !== "string") return "";
  const parts = prayerTime.split(":");
  if (parts.length < 2) return "";
  const ph = parseInt(parts[0], 10);
  const pm = parseInt(parts[1], 10);
  if (isNaN(ph) || isNaN(pm)) return "";
  const saudiNow = getSaudiNow();
  const prayer = new Date(saudiNow);
  prayer.setHours(ph, pm, 0, 0);
  if (prayer.getTime() <= saudiNow.getTime()) {
    prayer.setDate(prayer.getDate() + 1);
  }
  const diffMins = Math.floor((prayer.getTime() - saudiNow.getTime()) / 60000);
  if (diffMins <= 0) return "now";
  const h = Math.floor(diffMins / 60);
  const m = diffMins % 60;
  if (h > 0) return h + "h " + m + "m";
  return m + "m";
}

function getNextPrayer(mosqueTimes) {
  if (!mosqueTimes) return null;
  const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const saudiNow = getSaudiNow();
  const currentTime = String(saudiNow.getHours()).padStart(2, "0") + ":" + String(saudiNow.getMinutes()).padStart(2, "0");
  for (const prayer of prayers) {
    if (mosqueTimes[prayer] > currentTime) {
      return { name: prayer, time: mosqueTimes[prayer] };
    }
  }
  return { name: "Fajr", time: mosqueTimes["Fajr"] };
}

export default function HomeScreen() {
  const [data, setData] = useState(null);
  const [times, setTimes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState("makkah");
  const [, setTick] = useState(0);
  const [qiblaAngle, setQiblaAngle] = useState(null);
  const [heading, setHeading] = useState(0);

  const fetchData = async () => {
    try {
      const [nowRes, timesRes] = await Promise.all([
        fetch(API + "/now"),
        fetch(API + "/times")
      ]);
      setData(await nowRes.json());
      setTimes(await timesRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const dataInterval = setInterval(fetchData, 60000);
    const clockInterval = setInterval(() => setTick(t => t + 1), 1000);
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        const lat = loc.coords.latitude;
        const lon = loc.coords.longitude;
        const makkahLat = 21.4225;
        const makkahLon = 39.8262;
        const lat1 = lat * Math.PI / 180;
        const lat2 = makkahLat * Math.PI / 180;
        const dLon = (makkahLon - lon) * Math.PI / 180;
        const y = Math.sin(dLon) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
        const bearing = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
        setQiblaAngle(bearing);
      }
    })();
    const magSub = Magnetometer.addListener(data => {
      const { x, y, z } = data;
      let angle = Math.atan2(y, -x) * (180 / Math.PI);
      angle = (angle + 360) % 360;
      setHeading(angle);
    });
    Magnetometer.setUpdateInterval(100);

    registerForPushNotifications().then(token => {
      if (token) {
        fetch(API + "/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token })
        });
      }
    });
    return () => { clearInterval(dataInterval); clearInterval(clockInterval); magSub.remove(); };
  }, []);

  const mosque = data ? data[selected] : null;
  const mosqueTimes = times ? (selected === "makkah" ? times.makkah : times.madinah) : null;
  const nextPrayer = getNextPrayer(mosqueTimes);
  const mosqueName = selected === "makkah" ? "Makkah" : "Madinah";

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={GOLD} />}
    >
      <View style={styles.header}>
        <Text style={styles.appName}>Ittiba</Text>
        <Text style={styles.tagline}>Follow the recitation live</Text>
        <View style={styles.liveRow}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Live · Saudi Arabia</Text>
        </View>
      </View>
      {qiblaAngle !== null && (() => {
        const diff = ((qiblaAngle - heading + 360) % 360);
        const aligned = diff < 10 || diff > 350;
        return (
          <View style={styles.qiblaFloat}>
            <View style={[styles.qiblaCompassSmall, aligned && styles.qiblaCompassAligned]}>
              {/* Rotating needle */}
              <View style={[styles.qiblaArrowSmall, { transform: [{ rotate: diff + "deg" }] }]}>
                <View style={[styles.arrowHead, aligned && styles.arrowHeadAligned]} />
                <View style={[styles.arrowBody, aligned && styles.arrowBodyAligned]} />
              </View>
              {/* Kaaba fixed at top edge — does not rotate */}
              <View style={styles.kaabaFixed}>
                <Text style={styles.kaabaEmoji}>🕋</Text>
              </View>

            </View>
            <Text style={[styles.qiblaFloatText, aligned && styles.qiblaFloatTextAligned]}>
              {aligned ? "Qibla ✓" : "Qibla"}
            </Text>
          </View>
        );
      })()}

      <View style={styles.dateCard}>
        {(() => {
          const { day, month, year, weekday } = getDateParts();
          const arabicDay = ARABIC_DAYS[weekday] || weekday;
          return (
            <>
              <Text style={styles.dateDay}>{month} {day}, {year}</Text>
              <Text style={styles.dateWeekday}>{weekday} · {arabicDay}</Text>
              <Text style={styles.hijriDate}>{getHijriString()}</Text>
            </>
          );
        })()}
      </View>

      <View style={styles.timeCard}>
        <View style={styles.timeBlock}>
          <Text style={styles.timeLabel}>Saudi Arabia</Text>
          <Text style={styles.timeValue}>{getSaudiTime()}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.timeBlock}>
          <Text style={styles.timeLabel}>Local</Text>
          <Text style={styles.timeValue}>{getLocalTime()}</Text>
        </View>
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tab, selected === "makkah" && styles.tabActive]} onPress={() => setSelected("makkah")}>
          <Text style={[styles.tabText, selected === "makkah" && styles.tabTextActive]}>🕋 Makkah</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, selected === "madinah" && styles.tabActive]} onPress={() => setSelected("madinah")}>
          <Text style={[styles.tabText, selected === "madinah" && styles.tabTextActive]}>🌿 Madinah</Text>
        </TouchableOpacity>
      </View>

      {nextPrayer && (
        <View style={styles.nextPrayerCard}>
          <Text style={styles.nextPrayerLabel}>Next Prayer · {mosqueName}</Text>
          <View style={styles.nextPrayerRow}>
            <Text style={styles.nextPrayerName}>{nextPrayer.name}</Text>
            <Text style={styles.nextPrayerCountdown}>{getCountdown(nextPrayer.time)}</Text>
          </View>
          <Text style={styles.nextPrayerTime}>{nextPrayer.time} · Saudi Arabia time</Text>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color={GOLD} style={{ marginTop: 40 }} />
      ) : mosque && mosque.prayer ? (
        <View style={styles.card}>
          <Text style={styles.prayerLabel}>{mosque.prayer}</Text>
          {mosque.rakah_1 && mosque.rakah_1.surah_name && (
            <View style={styles.rakahBlock}>
              <Text style={styles.rakahTitle}>Rakah 1</Text>
              <Text style={styles.surahName}>{mosque.rakah_1.surah_name}</Text>
              <Text style={styles.surahArabic}>{SURAH_ARABIC[mosque.rakah_1.surah] || ""}</Text>
              <Text style={styles.ayahRange}>Ayahs {mosque.rakah_1.ayah_start} - {mosque.rakah_1.ayah_end}</Text>
            </View>
          )}
          {mosque.rakah_2 && mosque.rakah_2.surah_name && (
            <View style={styles.rakahBlock}>
              <Text style={styles.rakahTitle}>Rakah 2</Text>
              <Text style={styles.surahName}>{mosque.rakah_2.surah_name}</Text>
              <Text style={styles.surahArabic}>{SURAH_ARABIC[mosque.rakah_2.surah] || ""}</Text>
              <Text style={styles.ayahRange}>Ayahs {mosque.rakah_2.ayah_start} - {mosque.rakah_2.ayah_end}</Text>
            </View>
          )}
          <Text style={styles.timestamp}>Last updated: {new Date(mosque.timestamp).toLocaleTimeString()}</Text>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.noData}>No recitation detected yet.</Text>
          <Text style={styles.noDataSub}>Pull down to refresh or check back at prayer time.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f0e8" },
  header: { backgroundColor: GREEN, padding: 32, paddingTop: 60, position: "relative" },
  appName: { fontSize: 36, fontWeight: "600", color: GOLD, letterSpacing: -0.5 },
  tagline: { fontSize: 14, color: "#9FE1CB", marginTop: 4 },
  liveRow: { flexDirection: "row", alignItems: "center", marginTop: 12, gap: 6 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: GOLD },
  liveText: { fontSize: 13, color: GOLD },
  dateCard: { margin: 16, marginBottom: 8, backgroundColor: "#fff", borderRadius: 16, padding: 16, alignItems: "center" },
  dateDay: { fontSize: 18, fontWeight: "700", color: GREEN },
  dateWeekday: { fontSize: 15, fontWeight: "600", color: GREEN, marginTop: 4 },
  hijriDate: { fontSize: 13, color: GOLD, marginTop: 6 },
  timeCard: { flexDirection: "row", marginHorizontal: 16, marginBottom: 8, backgroundColor: "#fff", borderRadius: 16, padding: 20 },
  timeBlock: { flex: 1, alignItems: "center" },
  timeLabel: { fontSize: 12, color: "#999", marginBottom: 4 },
  timeValue: { fontSize: 22, fontWeight: "600", color: GREEN },
  divider: { width: 1, backgroundColor: "#e0e0e0", marginHorizontal: 12 },
  tabRow: { flexDirection: "row", backgroundColor: "#fff", marginHorizontal: 16, borderRadius: 12, marginBottom: 8, overflow: "hidden" },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabActive: { backgroundColor: GREEN },
  tabText: { fontSize: 14, color: "#999" },
  tabTextActive: { color: GOLD, fontWeight: "600" },
  nextPrayerCard: { marginHorizontal: 16, marginBottom: 8, backgroundColor: GREEN, borderRadius: 16, padding: 20 },
  nextPrayerLabel: { fontSize: 12, color: GOLD, fontWeight: "600", marginBottom: 6 },
  nextPrayerRow: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" },
  nextPrayerName: { fontSize: 24, fontWeight: "600", color: "#fff" },
  nextPrayerCountdown: { fontSize: 16, color: GOLD, fontWeight: "600" },
  nextPrayerTime: { fontSize: 13, color: "#9FE1CB", marginTop: 4 },
  card: { marginHorizontal: 16, marginBottom: 16, backgroundColor: "#fff", borderRadius: 16, padding: 20 },
  prayerLabel: { fontSize: 13, fontWeight: "600", color: GOLD, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 16 },
  rakahBlock: { backgroundColor: "#f5f0e8", borderRadius: 12, padding: 16, marginBottom: 12, borderLeftWidth: 3, borderLeftColor: GOLD },
  rakahTitle: { fontSize: 12, color: GREEN, fontWeight: "600", marginBottom: 4 },
  surahName: { fontSize: 20, fontWeight: "600", color: GREEN },
  ayahRange: { fontSize: 13, color: GREEN_LIGHT, marginTop: 4 },
  surahArabic: { fontSize: 20, color: "#0A3D2B", marginTop: 2, marginBottom: 4 },
  timestamp: { fontSize: 12, color: "#999", marginTop: 12, textAlign: "center" },
  noData: { fontSize: 16, color: "#333", textAlign: "center", marginBottom: 8 },
  noDataSub: { fontSize: 13, color: "#999", textAlign: "center" },
  qiblaFloat: { position: "absolute", top: 62, right: 36, alignItems: "center", zIndex: 10 },
  qiblaCompassSmall: { width: 60, height: 60, borderRadius: 30, borderWidth: 2.5, borderColor: "#C9A84C", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(201,168,76,0.1)" },
  kaabaFixed: {
    position: "absolute",
    top: -14,
    alignSelf: "center",
    backgroundColor: "rgba(15,20,30,0.92)",
    paddingHorizontal: 2,
    zIndex: 10,
  },
  kaabaEmoji: { fontSize: 15 },
  qiblaCompassAligned: { borderColor: "#1D9E75", backgroundColor: "rgba(29,158,117,0.2)" },
  qiblaArrowSmall: { alignItems: "center", justifyContent: "center", width: 60, height: 60 },
  arrowHead: { width: 0, height: 0, borderLeftWidth: 7, borderRightWidth: 7, borderBottomWidth: 14, borderLeftColor: "transparent", borderRightColor: "transparent", borderBottomColor: "#C9A84C" },
  arrowHeadAligned: { borderBottomColor: "#1D9E75" },
  arrowBody: { width: 4, height: 16, backgroundColor: "#C9A84C", borderBottomLeftRadius: 2, borderBottomRightRadius: 2 },
  arrowBodyAligned: { backgroundColor: "#1D9E75" },
  qiblaFloatText: { fontSize: 11, color: "#C9A84C", marginTop: 5, fontWeight: "700" },
  qiblaFloatTextAligned: { color: "#1D9E75" },
});
