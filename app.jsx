// React/ReactDOM are loaded as global UMD scripts in index.html (no bundler,
// no module system here), so we destructure hooks from the global instead
// of using an ES "import" statement (which Babel-standalone cannot resolve
// without a module loader and would fail silently at runtime).
const { useState, useEffect, useRef, useMemo } = React;

/* ================================================================
   JIANGHU-NET — DESIGN TOKENS
   "Misterius malam hari di puncak gunung sekte"
   Colors:
     bg            #121212  Deep Onyx — base
     surface       #1B1B1B  card surface
     surfaceRaised #232323  raised / input surface
     border        #2E2C28  hairline
     jade          #00A86B  primary accent — CTA, unlocked, success
     jadeDeep      #00714A  pressed jade
     gold          #D4AF37  premium, tier, currency, rare
     goldDeep      #A8862A  pressed gold
     text          #EDEAE2  primary text (warm white, not pure white)
     textSoft      #9A958C  secondary text
     danger        #C0392B  destructive
   Type:
     Hero    — 'Ma Shan Zheng' (brush calligraphy) — logo & hero title ONLY
     Display — 'Noto Serif SC' 700/800 — section headers, card titles
     Body    — 'Noto Serif' 400/600 — reading text
     Ledger  — 'IBM Plex Mono' 500/700 — currency, stats, timestamps
   Signature: the Giok Lock (jade padlock seal) — marks every premium
   gate, tier badge and achievement, always jade-outlined, gold when
   broken open. Reading progress renders as a tapering "blade bar".
================================================================ */

const C = {
  bg: "#121212",
  surface: "#1B1B1B",
  surfaceRaised: "#232323",
  surfaceHi: "#2A2A2A",
  border: "#2E2C28",
  jade: "#00A86B",
  jadeDeep: "#00714A",
  jadeGlow: "rgba(0,168,107,0.18)",
  gold: "#D4AF37",
  goldDeep: "#A8862A",
  goldGlow: "rgba(212,175,55,0.18)",
  text: "#EDEAE2",
  textSoft: "#9A958C",
  textFaint: "#6B6760",
  danger: "#C0392B",
};

const GENRES = [
  { id: "wuxia", label: "Wuxia Murni", glyph: "俠" },
  { id: "xianxia", label: "Xianxia", glyph: "仙" },
  { id: "xuanhuan", label: "Xuanhuan", glyph: "玄" },
  { id: "cosmic", label: "Sci-Fi Kultivasi Kosmik", glyph: "星" },
  { id: "nusantara", label: "Silat Nusantara", glyph: "keris" },
  { id: "urban", label: "Urban Cultivation (都市修真)", glyph: "都" },
  { id: "system", label: "RPG / System (Sistem Antarmuka)", glyph: "統" },
  { id: "darkurban", label: "Dark Urban Fantasy", glyph: "暗" },
  { id: "misc", label: "Lain-lain", glyph: "雜" },
];

const GLYPHS = ["劍", "俠", "刀", "拳", "龍", "武", "門", "影", "仙", "星"];

const TIERS = [
  { id: "luar", label: "Murid Luar", price: 0, perk: "Akses dasar. Bab gratis tanpa batas." },
  { id: "dalam", label: "Murid Dalam", price: 250, perk: "Diskon 30% harga buka segel bab." },
  { id: "tetua", label: "Tetua Sekte", price: 600, perk: "Semua bab premium terbuka otomatis, 30 hari." },
];

const STONE_PACKAGES = [
  { id: "s1", stones: 100, price: "Rp 15.000", label: "Kantong Pemula" },
  { id: "s2", stones: 550, price: "Rp 75.000", label: "Kantong Pengelana", bonus: "+10%" },
  { id: "s3", stones: 1200, price: "Rp 150.000", label: "Kantong Tetua", bonus: "+20%" },
];

const BLUEPRINTS = [
  { id: "kosong", label: "Kosong", skeleton: "" },
  {
    id: "turnamen",
    label: "Arc Turnamen Sekte",
    skeleton:
      "① Pembukaan turnamen — perkenalkan peserta & taruhan\n② Babak penyisihan — tunjukkan gaya bertarung tokoh utama\n③ Rintangan tak terduga — lawan tersembunyi / kecurangan\n④ Puncak duel — pertaruhan kehormatan sekte\n⑤ Akibat — posisi tokoh utama berubah di mata sekte\n\n—\n",
  },
  {
    id: "reruntuhan",
    label: "Eksplorasi Reruntuhan Kuno",
    skeleton:
      "① Penemuan pintu masuk reruntuhan & firasat buruk\n② Formasi pertahanan kuno — jebakan pertama\n③ Petunjuk sejarah sekte yang hilang\n④ Perebutan pusaka dengan rombongan lain\n⑤ Warisan yang didapat & harga yang dibayar\n\n—\n",
  },
  {
    id: "kosmik",
    label: "Peperangan Lintas Galaksi / Kosmik",
    skeleton:
      "① Sinyal / anomali dari luar sistem bintang sekte\n② Mobilisasi armada / tetua turun tangan\n③ Benturan kekuatan kultivasi vs teknologi kosmik\n④ Titik balik — pengorbanan atau terobosan tingkat\n⑤ Skala ancaman baru terungkap\n\n—\n",
  },
  {
    id: "lelang",
    label: "Lelang Pusaka",
    skeleton:
      "① Undangan lelang & aturan tak tertulis\n② Barang pembuka — pemanasan tensi antar klan\n③ Item incaran utama muncul, penawaran memanas\n④ Intrik / sabotase di tengah lelang\n⑤ Palu jatuh — siapa pulang membawa pusaka\n\n—\n",
  },
];

function uid(p) {
  return `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}
function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "baru saja";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
}
function fmt(n) {
  return new Intl.NumberFormat("id-ID").format(n);
}

// Resizes a user-uploaded cover image down to a small portrait JPEG and
// returns it as a base64 data URL. Kept intentionally small (max 300x420,
// JPEG quality ~0.72) so a cover comfortably fits inside a single Firestore
// document alongside the rest of the novel's metadata (well under the
// 900KB per-write cap enforced by our security rules).
function fileToResizedDataURL(file, maxW = 300, maxH = 420, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(maxW / img.width, maxH / img.height, 1);
        const targetW = Math.max(1, Math.round(img.width * ratio));
        const targetH = Math.max(1, Math.round(img.height * ratio));
        const canvas = document.createElement("canvas");
        canvas.width = targetW;
        canvas.height = targetH;
        canvas.getContext("2d").drawImage(img, 0, 0, targetW, targetH);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ---------------- storage helpers ----------------
   Backed by Firebase Firestore so data is global across every
   device and reader — window.storage (Claude-only) is no longer used.
   The single exception is "me:username" (which pen-name THIS device
   is currently using), which stays in localStorage since it is a
   device-level convenience, not shared app data.
================================================================== */
function firestoreDb() {
  return window.__jianghuDb;
}
async function sGet(key, shared) {
  if (key === "me:username") {
    try {
      return localStorage.getItem("me:username") || null;
    } catch (e) {
      return null;
    }
  }
  try {
    const db = firestoreDb();
    const snap = await db.collection("store").doc(key).get();
    if (!snap.exists) return null;
    const data = snap.data();
    return data ? data.value : null;
  } catch (e) {
    console.error("Firestore get error", key, e);
    return null;
  }
}
async function sSet(key, value, shared) {
  if (key === "me:username") {
    try {
      localStorage.setItem("me:username", value);
      return true;
    } catch (e) {
      return false;
    }
  }
  try {
    const db = firestoreDb();
    await db.collection("store").doc(key).set({ value, updatedAt: Date.now() });
    return true;
  } catch (e) {
    console.error("Firestore set error", key, e);
    return false;
  }
}
async function gJSON(key, shared, fallback) {
  const v = await sGet(key, shared);
  if (!v) return fallback;
  try {
    return JSON.parse(v);
  } catch (e) {
    return fallback;
  }
}
async function sJSON(key, obj, shared) {
  return sSet(key, JSON.stringify(obj), shared);
}

/* ---------------- signature: Giok Lock ---------------- */
// Reusable cover renderer: shows the uploaded photo when a novel has one,
// otherwise falls back to the calligraphy-glyph placeholder used before
// cover uploads existed. Every card/list/hero that displays a novel cover
// goes through this so the two visual styles never drift apart.
function CoverThumb({ novel, size = "md", radius = 10 }) {
  const dims = {
    sm: { w: 50, h: 66, font: 24 },
    md: { w: 110, h: 148, font: 40 },
    lg: { w: 92, h: 124, font: 46 },
  }[size] || { w: 110, h: 148, font: 40 };

  if (novel.coverImage) {
    return (
      <div
        style={{
          width: dims.w,
          height: dims.h,
          borderRadius: radius,
          backgroundImage: `url("${novel.coverImage}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: `1px solid ${C.border}`,
          flexShrink: 0,
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: dims.w,
        height: dims.h,
        borderRadius: radius,
        background: `linear-gradient(160deg, ${C.surfaceHi}, ${C.surface})`,
        border: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span style={{ fontFamily: "'Noto Serif SC', serif", fontSize: dims.font, color: C.jade, fontWeight: 800 }}>{novel.glyph}</span>
    </div>
  );
}

function GiokLock({ size = 28, broken = false, tone = "jade" }) {
  const color = tone === "gold" ? C.gold : C.jade;
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: "38% 62% 60% 40% / 45% 40% 60% 55%",
        border: `2px solid ${color}`,
        background: broken ? "transparent" : `${color}22`,
        color,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.5,
        flexShrink: 0,
      }}
    >
      {broken ? "✓" : "🔒"}
    </span>
  );
}

function BambooDivider() {
  return (
    <svg width="100%" height="8" viewBox="0 0 300 8" preserveAspectRatio="none" style={{ display: "block" }}>
      <path d="M2,4 C50,1 90,7 150,3 C210,0 250,6 298,2" stroke={C.jade} strokeOpacity={0.35} strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function BladeProgress({ pct }) {
  return (
    <div style={{ position: "relative", height: 14, width: "100%", background: C.surfaceHi, clipPath: "polygon(0 22%, 94% 0%, 100% 50%, 94% 100%, 0 78%)", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, width: `${pct}%`, background: `linear-gradient(90deg, ${C.jadeDeep}, ${C.jade})`, transition: "width .3s ease" }} />
    </div>
  );
}

function GlobalStyle() {
  return (
    <style>{`
      @keyframes coinFall {
        0% { transform: translateY(-40px) rotate(0deg); opacity: 0; }
        15% { opacity: 1; }
        100% { transform: translateY(420px) rotate(280deg); opacity: 0; }
      }
      @keyframes goldFlash {
        0% { opacity: 0; transform: scale(0.7); }
        30% { opacity: 1; transform: scale(1.05); }
        100% { opacity: 0; transform: scale(1.3); }
      }
      @keyframes lockCrack {
        0% { transform: scale(1) rotate(0deg); }
        40% { transform: scale(1.25) rotate(-8deg); }
        70% { transform: scale(0.9) rotate(6deg); }
        100% { transform: scale(0) rotate(20deg); opacity: 0; }
      }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes driftDown {
        0% { transform: translateY(-10px) translateX(0); opacity: 0; }
        10% { opacity: 0.55; }
        90% { opacity: 0.4; }
        100% { transform: translateY(100vh) translateX(24px); opacity: 0; }
      }
    `}</style>
  );
}

/* ================================================================
   ROOT APP
================================================================ */
function App() {
  const [ready, setReady] = useState(false);
  const [booting, setBooting] = useState(true);

  // NOTE on naming: `username` holds the Firebase Auth UID once signed in
  // (kept under this name to minimize changes across every screen that
  // already does `if (!username)` / uses it as a storage-key). The public
  // pen name people actually see is `user.displayName`.
  const [username, setUsername] = useState(null);
  const [user, setUser] = useState(null);

  const [tab, setTab] = useState("home");
  const [stack, setStack] = useState([]);

  const [novels, setNovels] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  function showToast(msg) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Noto+Serif+SC:wght@700;800;900&family=Noto+Serif:ital,wght@0,400;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@500;600;700&display=swap";
    document.head.appendChild(link);
    link.onload = () => setReady(true);
    const t = setTimeout(() => setReady(true), 900);
    return () => clearTimeout(t);
  }, []);

  // Firebase Auth persists the session itself (IndexedDB, "local"
  // persistence by default) — no more manual localStorage bookkeeping for
  // "who is this device logged in as".
  useEffect(() => {
    const unsub = window.__jianghuAuth.onAuthStateChanged(async (fbUser) => {
      if (fbUser) {
        setUsername(fbUser.uid);
        await loadUser(fbUser.uid, fbUser);
      } else {
        setUsername(null);
        setUser(null);
      }
      setBooting(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    loadCatalog();
  }, []);

  async function loadUser(uid, fbUser) {
    let u = await gJSON(`user:${uid}`, true, null);
    if (!u) {
      const fallbackName = (fbUser && fbUser.displayName) || (fbUser && fbUser.email ? fbUser.email.split("@")[0] : "Pendekar");
      u = {
        uid,
        email: fbUser ? fbUser.email : null,
        displayName: fallbackName,
        photoURL: (fbUser && fbUser.photoURL) || null,
        stones: 200,
        tier: "luar",
        tierUntil: 0,
        chaptersRead: 0,
        badges: [],
        joinedAt: Date.now(),
      };
      await sJSON(`user:${uid}`, u, true);
    }
    setUser(u);
    return u;
  }
  async function saveUser(next) {
    setUser(next);
    await sJSON(`user:${next.uid}`, next, true);
  }

  async function doGoogleSignIn() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await window.__jianghuAuth.signInWithPopup(provider);
      // onAuthStateChanged (below) picks up the new session automatically
      // and creates/loads the Firestore profile — nothing else to do here.
      return { ok: true };
    } catch (e) {
      if (e && e.code === "auth/popup-closed-by-user") return { ok: false, error: "" };
      return { ok: false, error: authErrorMessage(e) };
    }
  }

  async function loadCatalog() {
    setLoadingCatalog(true);
    const ids = await gJSON("catalog:index", true, []);
    const list = [];
    for (const id of ids) {
      const n = await gJSON(`novel:${id}`, true, null);
      if (n) list.push(n);
    }
    list.sort((a, b) => b.updatedAt - a.updatedAt);
    setNovels(list);
    setLoadingCatalog(false);
  }

  function authErrorMessage(e) {
    const map = {
      "auth/email-already-in-use": "Email ini sudah terdaftar. Coba masuk saja.",
      "auth/invalid-email": "Format email tidak valid.",
      "auth/weak-password": "Password minimal 6 karakter.",
      "auth/user-not-found": "Email belum terdaftar. Daftar dulu, yuk.",
      "auth/wrong-password": "Password salah.",
      "auth/invalid-credential": "Email atau password salah.",
      "auth/too-many-requests": "Terlalu banyak percobaan. Coba lagi beberapa saat lagi.",
      "auth/network-request-failed": "Koneksi bermasalah. Cek internet kamu.",
      "auth/unauthorized-domain": "Domain ini belum diizinkan di Firebase Console (Authentication → Settings → Authorized domains). Tambahkan domain situs ini lalu coba lagi.",
      "auth/popup-blocked": "Pop-up diblokir browser. Izinkan pop-up untuk situs ini lalu coba lagi.",
      "auth/cancelled-popup-request": "",
      "auth/operation-not-allowed": "Login Google belum diaktifkan di Firebase Console (Authentication → Sign-in method → Google).",
    };
    return (e && map[e.code]) || "Terjadi kesalahan. Coba lagi.";
  }

  async function doSignup(email, password, displayName) {
    try {
      const cred = await window.__jianghuAuth.createUserWithEmailAndPassword(email, password);
      const uid = cred.user.uid;
      const u = {
        uid,
        email,
        displayName: displayName.trim() || email.split("@")[0],
        stones: 200,
        tier: "luar",
        tierUntil: 0,
        chaptersRead: 0,
        badges: [],
        joinedAt: Date.now(),
      };
      await sJSON(`user:${uid}`, u, true);
      setUser(u);
      showToast(`Selamat datang di Jianghu, ${u.displayName}!`);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: authErrorMessage(e) };
    }
  }

  async function doLoginEmail(email, password) {
    try {
      await window.__jianghuAuth.signInWithEmailAndPassword(email, password);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: authErrorMessage(e) };
    }
  }

  function doLogout() {
    window.__jianghuAuth.signOut();
    setTab("home");
    setStack([]);
  }

  async function updateDisplayName(newName) {
    if (!user || !newName.trim()) return false;
    const next = { ...user, displayName: newName.trim() };
    await saveUser(next);
    return true;
  }

  async function sendPasswordReset() {
    if (!user || !user.email) return { ok: false, error: "Akun ini tidak memakai email/password (mungkin login via Google)." };
    try {
      await window.__jianghuAuth.sendPasswordResetEmail(user.email);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: authErrorMessage(e) };
    }
  }

  async function deleteAccount() {
    try {
      const current = window.__jianghuAuth.currentUser;
      if (!current) return { ok: false, error: "Sesi login tidak ditemukan." };
      await current.delete();
      return { ok: true };
    } catch (e) {
      if (e && e.code === "auth/requires-recent-login") {
        return { ok: false, error: "Demi keamanan, keluar dan masuk lagi sebelum menghapus akun." };
      }
      return { ok: false, error: authErrorMessage(e) };
    }
  }

  function push(screen, params = {}) {
    setStack((s) => [...s, { screen, params }]);
  }
  function pop() {
    setStack((s) => s.slice(0, -1));
  }
  // Used for lateral navigation (e.g. next/previous chapter) that should
  // SWAP the current screen instead of piling another one onto the stack —
  // otherwise reading N chapters forward means pressing back N times before
  // the bottom nav / main menu becomes reachable again.
  function replace(screen, params = {}) {
    setStack((s) => (s.length ? [...s.slice(0, -1), { screen, params }] : [{ screen, params }]));
  }
  const current = stack[stack.length - 1] || null;

  function requireLogin(after) {
    if (!username) {
      push("login", { after });
      return false;
    }
    return true;
  }

  async function createNovel({ title, synopsis, genre, glyph, coverImage }) {
    const id = uid("novel");
    const novel = {
      id,
      title,
      synopsis,
      genre,
      glyph,
      coverImage: coverImage || null,
      author: username,
      authorName: (user && user.displayName) || "Pendekar",
      chapterIds: [],
      frameworks: [],
      characters: [],
      worldEntries: [],
      reads: 0,
      tips: 0,
      ratingSum: 0,
      ratingCount: 0,
      commentCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await sJSON(`novel:${id}`, novel, true);
    const ids = await gJSON("catalog:index", true, []);
    ids.unshift(id);
    await sJSON("catalog:index", ids, true);
    await loadCatalog();
    return novel;
  }
  async function saveNovel(novel) {
    novel.updatedAt = Date.now();
    await sJSON(`novel:${novel.id}`, novel, true);
    await loadCatalog();
  }
  async function addChapter(novelId, { title, content, isPremium, coinPrice, blueprintType, status }) {
    const novel = await gJSON(`novel:${novelId}`, true, null);
    if (!novel) return;
    const id = uid("ch");
    const chapter = {
      id,
      novelId,
      title,
      content,
      isPremium: !!isPremium,
      coinPrice: isPremium ? Number(coinPrice) || 15 : 0,
      blueprintType: blueprintType || "kosong",
      status: status === "draft" ? "draft" : "published",
      order: novel.chapterIds.length + 1,
      createdAt: Date.now(),
    };
    await sJSON(`chapter:${novelId}:${id}`, chapter, true);
    novel.chapterIds.push(id);
    await saveNovel(novel);
    return chapter;
  }
  async function updateChapter(chapter) {
    await sJSON(`chapter:${chapter.novelId}:${chapter.id}`, chapter, true);
  }

  async function unlockChapter(novel, chapter) {
    if (!requireLogin({ screen: "reader", params: { novelId: novel.id, chapterId: chapter.id } })) return false;
    const activeTetua = user.tier === "tetua" && user.tierUntil > Date.now();
    if (activeTetua) {
      await recordUnlock(novel, chapter, 0);
      return true;
    }
    const discount = user.tier === "dalam" && user.tierUntil > Date.now() ? 0.7 : 1;
    const price = Math.max(1, Math.round(chapter.coinPrice * discount));
    if (user.stones < price) return "insufficient";
    const next = { ...user, stones: user.stones - price };
    await saveUser(next);
    await recordUnlock(novel, chapter, price);
    return true;
  }
  async function recordUnlock(novel, chapter, pricePaid) {
    await sSet(`unlock:${username}:${novel.id}:${chapter.id}`, "1", false);
    if (pricePaid > 0) {
      const authorShare = Math.round(pricePaid * 0.7);
      const key = `earnings:${novel.author}`;
      const earn = await gJSON(key, true, { total: 0, ledger: [] });
      earn.total += authorShare;
      earn.ledger.unshift({ type: "paywall", novel: novel.title, chapter: chapter.title, reader: (user && user.displayName) || "Pembaca", amount: authorShare, ts: Date.now() });
      earn.ledger = earn.ledger.slice(0, 150);
      await sJSON(key, earn, true);
    }
    novel.reads = (novel.reads || 0) + 1;
    await saveNovel(novel);
  }
  async function isUnlocked(novelId, chapterId) {
    if (!username) return false;
    return !!(await sGet(`unlock:${username}:${novelId}:${chapterId}`, false));
  }

  async function buyStones(pkg) {
    if (!requireLogin({ screen: "wallet", params: {} })) return;
    const next = { ...user, stones: user.stones + pkg.stones };
    await saveUser(next);
  }

  async function purchaseTier(tierId) {
    if (!requireLogin({ screen: "wallet", params: {} })) return "needlogin";
    const tier = TIERS.find((t) => t.id === tierId);
    if (!tier || tier.price === 0) return "invalid";
    if (user.stones < tier.price) return "insufficient";
    const base = user.tierUntil > Date.now() && user.tier === tierId ? user.tierUntil : Date.now();
    const next = { ...user, stones: user.stones - tier.price, tier: tierId, tierUntil: base + 30 * 86400000 };
    await saveUser(next);
    return "ok";
  }

  async function tipNovel(novel, amount) {
    if (!requireLogin({ screen: "story", params: { novelId: novel.id } })) return false;
    if (user.stones < amount) return "insufficient";
    const nextUser = { ...user, stones: user.stones - amount };
    await saveUser(nextUser);
    novel.tips = (novel.tips || 0) + amount;
    await saveNovel(novel);
    const ledger = await gJSON("tips:ledger", true, []);
    ledger.unshift({ novelId: novel.id, novelTitle: novel.title, author: novel.author, authorName: novel.authorName, amount, from: username, fromName: (user && user.displayName) || "Pembaca", ts: Date.now() });
    await sJSON("tips:ledger", ledger.slice(0, 300), true);
    const key = `earnings:${novel.author}`;
    const earn = await gJSON(key, true, { total: 0, ledger: [] });
    const authorShare = Math.round(amount * 0.8);
    earn.total += authorShare;
    earn.ledger.unshift({ type: "tip", novel: novel.title, chapter: "Pedang Pusaka / Pil Dewa", reader: (user && user.displayName) || "Pembaca", amount: authorShare, ts: Date.now() });
    earn.ledger = earn.ledger.slice(0, 150);
    await sJSON(key, earn, true);
    return true;
  }

  async function rateNovel(novel, stars) {
    if (!requireLogin({ screen: "story", params: { novelId: novel.id } })) return false;
    const rKey = `rating:${novel.id}:${username}`;
    const prev = await gJSON(rKey, true, null);
    let ratingSum = novel.ratingSum || 0;
    let ratingCount = novel.ratingCount || 0;
    if (prev) {
      ratingSum = ratingSum - prev.stars + stars;
    } else {
      ratingSum += stars;
      ratingCount += 1;
    }
    await sJSON(rKey, { uid: username, stars, ts: Date.now() }, true);
    const nextNovel = { ...novel, ratingSum, ratingCount };
    await saveNovel(nextNovel);
    return nextNovel;
  }
  async function getMyRating(novelId) {
    if (!username) return 0;
    const r = await gJSON(`rating:${novelId}:${username}`, true, null);
    return r ? r.stars : 0;
  }

  async function loadComments(novelId) {
    const c = await gJSON(`comments:${novelId}`, true, { list: [] });
    return c.list || [];
  }
  async function addComment(novel, text) {
    if (!requireLogin({ screen: "story", params: { novelId: novel.id } })) return false;
    const key = `comments:${novel.id}`;
    const c = await gJSON(key, true, { list: [] });
    const entry = { id: uid("cmt"), uid: username, displayName: (user && user.displayName) || "Pembaca", text: text.trim(), ts: Date.now() };
    c.list = [entry, ...(c.list || [])].slice(0, 300);
    await sJSON(key, c, true);
    const nextNovel = { ...novel, commentCount: (novel.commentCount || 0) + 1 };
    await saveNovel(nextNovel);
    return { novel: nextNovel, comments: c.list };
  }
  async function deleteComment(novel, commentId) {
    const key = `comments:${novel.id}`;
    const c = await gJSON(key, true, { list: [] });
    c.list = (c.list || []).filter((x) => x.id !== commentId);
    await sJSON(key, c, true);
    const nextNovel = { ...novel, commentCount: Math.max(0, (novel.commentCount || 1) - 1) };
    await saveNovel(nextNovel);
    return { novel: nextNovel, comments: c.list };
  }

  async function deleteChapter(novel, chapterId) {
    const nextNovel = { ...novel, chapterIds: novel.chapterIds.filter((id) => id !== chapterId) };
    await saveNovel(nextNovel);
    return nextNovel;
  }
  async function deleteNovel(novelId) {
    const ids = await gJSON("catalog:index", true, []);
    await sJSON("catalog:index", ids.filter((id) => id !== novelId), true);
    await loadCatalog();
  }
  async function setChapterStatus(chapter, status) {
    const next = { ...chapter, status };
    await updateChapter(next);
    return next;
  }

  async function toggleLibrary(novelId) {
    if (!requireLogin({ screen: "story", params: { novelId } })) return;
    const lib = await gJSON(`library:${username}`, false, []);
    const has = lib.includes(novelId);
    const next = has ? lib.filter((id) => id !== novelId) : [novelId, ...lib];
    await sJSON(`library:${username}`, next, false);
    return !has;
  }

  async function markProgress(novelId, chapter) {
    if (!username) return;
    await sJSON(`progress:${username}:${novelId}`, { lastOrder: chapter.order, lastChapterId: chapter.id, updatedAt: Date.now() }, false);
    const next = { ...user, chaptersRead: (user.chaptersRead || 0) + 1 };
    const milestones = [10, 50, 200, 500];
    for (const m of milestones) {
      const badgeName = `Pembaca ${m} Bab`;
      if (next.chaptersRead >= m && !next.badges.includes(badgeName)) next.badges = [...next.badges, badgeName];
    }
    await saveUser(next);
  }

  if (!ready || booting) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <GlobalStyle />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Ma Shan Zheng', serif", fontSize: 44, color: C.jade }}>江湖</div>
          <div style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 800, fontSize: 20, color: C.text, marginTop: 6 }}>Jianghu-Net</div>
          <div style={{ color: C.textFaint, fontSize: 11, letterSpacing: 3, marginTop: 10 }}>MEMASUKI JIANGHU…</div>
        </div>
      </div>
    );
  }

  const ctx = {
    C,
    username,
    user,
    novels,
    loadingCatalog,
    push,
    pop,
    replace,
    requireLogin,
    doSignup,
    doLoginEmail,
    doGoogleSignIn,
    updateDisplayName,
    sendPasswordReset,
    deleteAccount,
    doLogout,
    createNovel,
    saveNovel,
    addChapter,
    updateChapter,
    unlockChapter,
    isUnlocked,
    buyStones,
    purchaseTier,
    tipNovel,
    rateNovel,
    getMyRating,
    loadComments,
    addComment,
    deleteComment,
    deleteChapter,
    deleteNovel,
    setChapterStatus,
    toggleLibrary,
    markProgress,
    loadCatalog,
    showToast,
    setTab,
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Noto Serif', serif", color: C.text, display: "flex", justifyContent: "center" }}>
      <GlobalStyle />
      <div style={{ width: "100%", maxWidth: 480, position: "relative", minHeight: "100vh", background: C.bg }}>
        {current ? (
          <ScreenRouter entry={current} ctx={ctx} onBack={pop} />
        ) : (
          <MainTabs tab={tab} setTab={setTab} ctx={ctx} username={username} doLogout={doLogout} />
        )}
        {toast && (
          <div
            style={{
              position: "fixed",
              bottom: current ? 20 : 84,
              left: "50%",
              transform: "translateX(-50%)",
              background: C.surfaceHi,
              border: `1px solid ${C.jade}`,
              color: C.text,
              padding: "10px 18px",
              borderRadius: 999,
              fontSize: 13,
              zIndex: 300,
              maxWidth: "90%",
              textAlign: "center",
              animation: "fadeUp .2s ease",
            }}
          >
            {toast}
          </div>
        )}
        {!current && <BottomNav tab={tab} setTab={setTab} />}
      </div>
    </div>
  );
}

/* ================================================================
   TABS + NAV
================================================================ */
function MainTabs({ tab, setTab, ctx, username, doLogout }) {
  return (
    <div style={{ paddingBottom: 78 }}>
      {tab === "home" && <HomeScreen ctx={ctx} />}
      {tab === "explore" && <ExploreScreen ctx={ctx} />}
      {tab === "library" && <LibraryScreen ctx={ctx} />}
      {tab === "leaderboard" && <LeaderboardScreen ctx={ctx} />}
      {tab === "profile" && <ProfileScreen ctx={ctx} username={username} doLogout={doLogout} />}
    </div>
  );
}

function BottomNav({ tab, setTab }) {
  const items = [
    { id: "home", label: "Dunia Persilatan", glyph: "界" },
    { id: "explore", label: "Aliran & Sekte", glyph: "宗" },
    { id: "library", label: "Paviliun Kitab", glyph: "藏" },
    { id: "leaderboard", label: "Pendekar Langit", glyph: "榜" },
    { id: "profile", label: "Kultivasi", glyph: "俠" },
  ];
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 480,
        background: C.surface,
        borderTop: `1px solid ${C.border}`,
        display: "flex",
        padding: "8px 2px calc(8px + env(safe-area-inset-bottom))",
        zIndex: 100,
      }}
    >
      {items.map((it) => {
        const active = tab === it.id;
        return (
          <button
            key={it.id}
            onClick={() => setTab(it.id)}
            style={{ flex: 1, background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 0", cursor: "pointer", color: active ? C.jade : C.textFaint }}
          >
            <span
              style={{
                fontFamily: "'Noto Serif SC', serif",
                fontWeight: 800,
                fontSize: 15,
                width: 26,
                height: 26,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: active ? C.jadeGlow : "transparent",
                border: active ? `1px solid ${C.jade}` : "1px solid transparent",
              }}
            >
              {it.glyph}
            </span>
            <span style={{ fontSize: 9.5, fontWeight: active ? 700 : 500, textAlign: "center", lineHeight: 1.15 }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function ScreenRouter({ entry, ctx, onBack }) {
  const { screen, params } = entry;
  return (
    <div style={{ minHeight: "100vh" }}>
      {screen === "story" && <StoryDetailScreen novelId={params.novelId} ctx={ctx} onBack={onBack} />}
      {screen === "reader" && <ReaderScreen novelId={params.novelId} chapterId={params.chapterId} ctx={ctx} onBack={onBack} />}
      {screen === "wallet" && <WalletScreen ctx={ctx} onBack={onBack} />}
      {screen === "login" && <LoginScreen ctx={ctx} onBack={onBack} params={params} />}
      {screen === "studio" && <StudioScreen ctx={ctx} onBack={onBack} />}
      {screen === "studioNovel" && <StudioNovelScreen novelId={params.novelId} ctx={ctx} onBack={onBack} />}
      {screen === "chapterEditor" && <ChapterEditorScreen novelId={params.novelId} chapterId={params.chapterId} ctx={ctx} onBack={onBack} />}
      {screen === "characterEditor" && <CharacterEditorScreen novelId={params.novelId} characterId={params.characterId} ctx={ctx} onBack={onBack} />}
      {screen === "worldEntryEditor" && <WorldEntryEditorScreen novelId={params.novelId} entryId={params.entryId} ctx={ctx} onBack={onBack} />}
      {screen === "powerSystem" && <PowerSystemScreen novelId={params.novelId} ctx={ctx} onBack={onBack} />}
      {screen === "distribution" && <DistributionScreen novelId={params.novelId} ctx={ctx} onBack={onBack} />}
      {screen === "legal" && <LegalScreen onBack={onBack} />}
      {screen === "settings" && <SettingsScreen ctx={ctx} onBack={onBack} />}
    </div>
  );
}

function TopBar({ title, onBack, right }) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: `${C.bg}ee`,
        backdropFilter: "blur(6px)",
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "14px 16px",
      }}
    >
      <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.text, padding: 0, width: 30 }}>
        ←
      </button>
      <div style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 800, fontSize: 16, flex: 1 }}>{title}</div>
      {right}
    </div>
  );
}

function inputStyle() {
  return {
    width: "100%",
    padding: "11px 13px",
    borderRadius: 10,
    border: `1.5px solid ${C.border}`,
    background: C.surfaceRaised,
    color: C.text,
    fontFamily: "'Noto Serif', serif",
    fontSize: 13.5,
    outline: "none",
    boxSizing: "border-box",
  };
}
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, marginBottom: 6, color: C.textSoft, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</div>
      {children}
    </div>
  );
}

/* ================================================================
   HOME — Dunia Persilatan
================================================================ */
function HomeScreen({ ctx }) {
  const { novels, loadingCatalog, push } = ctx;
  const [heroIdx, setHeroIdx] = useState(0);
  const [search, setSearch] = useState("");
  const hero = novels.slice(0, 5);

  useEffect(() => {
    if (hero.length < 2) return;
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % hero.length), 4200);
    return () => clearInterval(t);
  }, [hero.length]);

  const tetua = [...novels].sort((a, b) => (b.tips || 0) - (a.tips || 0)).slice(0, 6);
  const pendatangBaru = [...novels].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6);
  const terlaris = [...novels].sort((a, b) => (b.reads || 0) - (a.reads || 0)).slice(0, 6);

  const q = search.trim().toLowerCase();
  const searchResults = q
    ? novels.filter((n) => n.title.toLowerCase().includes(q) || (n.authorName || "").toLowerCase().includes(q) || (n.genre || "").toLowerCase().includes(q))
    : [];

  return (
    <div>
      <FloatingParticles />
      <div style={{ padding: "18px 18px 6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "'Ma Shan Zheng', serif", fontSize: 34, color: C.jade, lineHeight: 1 }}>江湖</span>
          <div>
            <div style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 900, fontSize: 18 }}>Jianghu-Net</div>
            <div style={{ fontSize: 10, letterSpacing: 1.8, color: C.textFaint, textTransform: "uppercase" }}>Dunia Persilatan</div>
          </div>
        </div>
        <div style={{ position: "relative", marginTop: 14 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul, penulis, atau aliran…"
            style={{ ...inputStyle(), paddingLeft: 34 }}
          />
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: C.textFaint }}>🔍</span>
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: C.textFaint, fontSize: 15, cursor: "pointer" }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {q ? (
        <div style={{ padding: "14px 18px 24px" }}>
          <div style={{ fontSize: 12, color: C.textFaint, marginBottom: 12 }}>
            {searchResults.length} hasil untuk "{search.trim()}"
          </div>
          {searchResults.length === 0 && <div style={{ fontSize: 13, color: C.textSoft, textAlign: "center", padding: "30px 0" }}>Tidak ada cerita yang cocok. Coba kata kunci lain.</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {searchResults.map((n) => (
              <NovelListCard key={n.id} novel={n} onOpen={() => push("story", { novelId: n.id })} />
            ))}
          </div>
        </div>
      ) : (
        <>
          {hero.length > 0 && (
            <div
              onClick={() => push("story", { novelId: hero[heroIdx].id })}
              style={{
                margin: "14px 18px 0",
                height: 170,
                borderRadius: 16,
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                background: hero[heroIdx].coverImage
                  ? `url("${hero[heroIdx].coverImage}") center/cover`
                  : `linear-gradient(135deg, ${C.jadeDeep} 0%, #0c1f16 60%, ${C.bg} 100%)`,
                border: `1px solid ${C.border}`,
              }}
            >
              {!hero[heroIdx].coverImage && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 18, opacity: 0.16 }}>
                  <span style={{ fontFamily: "'Noto Serif SC', serif", fontSize: 120, color: C.gold, fontWeight: 900 }}>{hero[heroIdx].glyph}</span>
                </div>
              )}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  padding: 18,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  background: hero[heroIdx].coverImage ? "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.75) 100%)" : "none",
                }}
              >
                <div style={{ fontSize: 10, letterSpacing: 1.5, color: C.gold, fontWeight: 700, textTransform: "uppercase" }}>Novel Unggulan</div>
                <div style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 800, fontSize: 19, marginTop: 4 }}>{hero[heroIdx].title}</div>
                <div style={{ fontSize: 11.5, color: C.textSoft, marginTop: 2 }}>oleh {hero[heroIdx].authorName}</div>
              </div>
              <div style={{ position: "absolute", bottom: 10, right: 14, display: "flex", gap: 5 }}>
                {hero.map((_, i) => (
                  <div key={i} style={{ width: i === heroIdx ? 16 : 6, height: 4, borderRadius: 999, background: i === heroIdx ? C.gold : "rgba(255,255,255,0.3)", transition: "width .2s" }} />
                ))}
              </div>
            </div>
          )}

          {loadingCatalog && <div style={{ padding: 24, color: C.textFaint, fontSize: 13 }}>Membaca gulungan takdir…</div>}

          {!loadingCatalog && novels.length === 0 && (
            <div style={{ textAlign: "center", padding: "50px 24px", color: C.textSoft, fontSize: 13, lineHeight: 1.7 }}>
              Jianghu ini masih sunyi.
              <br />
              Jadilah pendekar pertama yang menuliskan kisahnya di Ruang Meditasi.
            </div>
          )}

          {tetua.length > 0 && <NovelRow title="Rekomendasi Tetua" subtitle="Curated pick dari sesepuh sekte" novels={tetua} ctx={ctx} />}
          {pendatangBaru.length > 0 && <NovelRow title="Pakar Pendatang Baru" subtitle="Karya terbaru di Jianghu" novels={pendatangBaru} ctx={ctx} />}
          {terlaris.length > 0 && <NovelRow title="Kitab Terlaris" subtitle="Paling banyak dibaca pendekar" novels={terlaris} ctx={ctx} />}
        </>
      )}
    </div>
  );
}

function FloatingParticles() {
  const particles = useMemo(
    () => Array.from({ length: 10 }).map(() => ({ left: Math.random() * 100, delay: Math.random() * 6, dur: 8 + Math.random() * 6, size: 3 + Math.random() * 3 })),
    []
  );
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{ position: "absolute", left: `${p.left}%`, top: 0, width: p.size, height: p.size, borderRadius: "50%", background: C.gold, opacity: 0.4, animation: `driftDown ${p.dur}s linear ${p.delay}s infinite` }}
        />
      ))}
    </div>
  );
}

function NovelRow({ title, subtitle, novels, ctx }) {
  const { push } = ctx;
  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ padding: "0 18px", marginBottom: 10 }}>
        <div style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 800, fontSize: 15 }}>{title}</div>
        <div style={{ fontSize: 11, color: C.textFaint }}>{subtitle}</div>
      </div>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 18px 4px", scrollbarWidth: "none" }}>
        {novels.map((n) => (
          <div key={n.id} onClick={() => push("story", { novelId: n.id })} style={{ width: 110, flexShrink: 0, cursor: "pointer" }}>
            <div style={{ marginBottom: 6, position: "relative" }}>
              <CoverThumb novel={n} size="md" />
              {n.genre && (
                <span
                  style={{
                    position: "absolute",
                    top: 6,
                    left: 6,
                    fontSize: 8.5,
                    fontWeight: 700,
                    color: "#08170f",
                    background: C.gold,
                    padding: "2px 6px",
                    borderRadius: 999,
                    maxWidth: 96,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {n.genre}
                </span>
              )}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{n.title}</div>
            <div style={{ fontSize: 10, color: C.textFaint, marginTop: 2 }}>{n.authorName}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   EXPLORE — Aliran & Sekte
================================================================ */
function ExploreScreen({ ctx }) {
  const { novels, push } = ctx;
  const [active, setActive] = useState(null);
  const list = active ? novels.filter((n) => n.genre === GENRES.find((g) => g.id === active).label) : [];

  return (
    <div style={{ padding: 18 }}>
      <div style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 800, fontSize: 19, marginBottom: 4 }}>Aliran & Sekte</div>
      <div style={{ fontSize: 11.5, color: C.textFaint, marginBottom: 16 }}>Jelajahi jianghu berdasarkan aliran ilmu</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
        {GENRES.map((g) => {
          const isActive = active === g.id;
          return (
            <div
              key={g.id}
              onClick={() => setActive(isActive ? null : g.id)}
              style={{ borderRadius: 14, border: `1.5px solid ${isActive ? C.jade : C.border}`, background: isActive ? C.jadeGlow : C.surface, padding: "18px 12px", textAlign: "center", cursor: "pointer" }}
            >
              <div style={{ fontFamily: "'Noto Serif SC', serif", fontSize: 26, fontWeight: 800, color: isActive ? C.jade : C.gold }}>{g.glyph === "keris" ? "⚔" : g.glyph}</div>
              <div style={{ fontSize: 12, fontWeight: 700, marginTop: 8 }}>{g.label}</div>
            </div>
          );
        })}
      </div>

      {active && (
        <div>
          <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>
            {list.length} cerita di aliran {GENRES.find((g) => g.id === active).label}
          </div>
          {list.length === 0 && <div style={{ fontSize: 12.5, color: C.textFaint, padding: "20px 0" }}>Belum ada cerita di aliran ini.</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {list.map((n) => (
              <NovelListCard key={n.id} novel={n} onOpen={() => push("story", { novelId: n.id })} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NovelListCard({ novel, onOpen }) {
  return (
    <div onClick={onOpen} style={{ display: "flex", gap: 12, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, cursor: "pointer" }}>
      <CoverThumb novel={novel} size="sm" radius={8} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{novel.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: C.textFaint }}>oleh {novel.authorName}</span>
          {novel.genre && (
            <span style={{ fontSize: 9, fontWeight: 700, color: C.jade, background: C.jadeGlow, padding: "1px 7px", borderRadius: 999 }}>{novel.genre}</span>
          )}
        </div>
        <div style={{ fontSize: 11.5, color: C.textSoft, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.4 }}>{novel.synopsis}</div>
      </div>
    </div>
  );
}

/* ================================================================
   LIBRARY — Paviliun Kitab
================================================================ */
function LibraryScreen({ ctx }) {
  const { username, novels, push } = ctx;
  const [subtab, setSubtab] = useState("reading");
  const [progressList, setProgressList] = useState([]);
  const [favIds, setFavIds] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      if (!username) {
        setLoaded(true);
        return;
      }
      const fav = await gJSON(`library:${username}`, false, []);
      setFavIds(fav);
      const list = [];
      for (const n of novels) {
        const p = await gJSON(`progress:${username}:${n.id}`, false, null);
        if (p) list.push({ novel: n, progress: p });
      }
      list.sort((a, b) => b.progress.updatedAt - a.progress.updatedAt);
      setProgressList(list);
      setLoaded(true);
    })();
  }, [username, novels]);

  if (!username) {
    return <EmptyState ctx={ctx} title="Paviliun Kitab Terkunci" body="Masuk untuk melacak progres bacaan dan menyimpan kitab favorit." cta="Masuk / Daftar" onCta={() => push("login", {})} />;
  }

  const favs = novels.filter((n) => favIds.includes(n.id));

  return (
    <div style={{ padding: 18 }}>
      <div style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 800, fontSize: 19, marginBottom: 14 }}>Paviliun Kitab</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <SubTabBtn label="Sedang Dibaca" active={subtab === "reading"} onClick={() => setSubtab("reading")} />
        <SubTabBtn label="Kitab Favorit" active={subtab === "fav"} onClick={() => setSubtab("fav")} />
      </div>

      {subtab === "reading" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {loaded && progressList.length === 0 && <div style={{ fontSize: 12.5, color: C.textFaint, padding: "20px 0", textAlign: "center" }}>Belum ada bacaan berjalan.</div>}
          {progressList.map(({ novel, progress }) => {
            const total = novel.chapterIds.length || 1;
            const pct = Math.min(100, Math.round((progress.lastOrder / total) * 100));
            return (
              <div key={novel.id} onClick={() => push("story", { novelId: novel.id })} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 13.5 }}>{novel.title}</span>
                  <span style={{ fontSize: 11, color: C.textFaint, fontFamily: "'IBM Plex Mono', monospace" }}>{pct}%</span>
                </div>
                <BladeProgress pct={pct} />
                <div style={{ fontSize: 10.5, color: C.textFaint, marginTop: 6 }}>
                  Bab {progress.lastOrder} dari {total}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {subtab === "fav" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {favs.length === 0 && <div style={{ fontSize: 12.5, color: C.textFaint, padding: "20px 0", textAlign: "center" }}>Belum ada kitab favorit tersimpan.</div>}
          {favs.map((n) => (
            <NovelListCard key={n.id} novel={n} onOpen={() => push("story", { novelId: n.id })} />
          ))}
        </div>
      )}
    </div>
  );
}
function SubTabBtn({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ flex: 1, padding: "9px 0", borderRadius: 10, border: `1.5px solid ${active ? C.jade : C.border}`, background: active ? C.jadeGlow : "transparent", color: active ? C.jade : C.textSoft, fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>
      {label}
    </button>
  );
}

/* ================================================================
   LEADERBOARD — Daftar Pendekar Langit
================================================================ */
function LeaderboardScreen({ ctx }) {
  const { push } = ctx;
  const [range, setRange] = useState("weekly");
  const [ranking, setRanking] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      setLoaded(false);
      const ledger = await gJSON("tips:ledger", true, []);
      const cutoff = Date.now() - (range === "weekly" ? 7 : 30) * 86400000;
      const totals = {};
      for (const t of ledger) {
        if (t.ts < cutoff) continue;
        if (!totals[t.novelId]) totals[t.novelId] = { novelId: t.novelId, title: t.novelTitle, author: t.authorName || t.author, amount: 0 };
        totals[t.novelId].amount += t.amount;
      }
      setRanking(Object.values(totals).sort((a, b) => b.amount - a.amount).slice(0, 20));
      setLoaded(true);
    })();
  }, [range]);

  return (
    <div style={{ padding: 18 }}>
      <div style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 800, fontSize: 19, marginBottom: 4 }}>Daftar Pendekar Langit</div>
      <div style={{ fontSize: 11.5, color: C.textFaint, marginBottom: 16 }}>Peringkat berdasarkan Pedang Pusaka & Pil Dewa (tipping)</div>

      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        <SubTabBtn label="Mingguan" active={range === "weekly"} onClick={() => setRange("weekly")} />
        <SubTabBtn label="Bulanan" active={range === "monthly"} onClick={() => setRange("monthly")} />
      </div>

      {loaded && ranking.length === 0 && <div style={{ textAlign: "center", padding: "40px 20px", color: C.textFaint, fontSize: 13, lineHeight: 1.6 }}>Belum ada kitab yang menerima persembahan pusaka di periode ini.</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {ranking.map((r, i) => (
          <div
            key={r.novelId}
            onClick={() => push("story", { novelId: r.novelId })}
            style={{ display: "flex", alignItems: "center", gap: 12, background: i < 3 ? C.goldGlow : C.surface, border: `1px solid ${i < 3 ? C.gold : C.border}`, borderRadius: 12, padding: "12px 14px", cursor: "pointer" }}
          >
            <div style={{ width: 28, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 800, fontSize: 15, color: i < 3 ? C.gold : C.textFaint, textAlign: "center" }}>{i + 1}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</div>
              <div style={{ fontSize: 10.5, color: C.textFaint }}>oleh {r.author}</div>
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 13, color: C.gold }}>{fmt(r.amount)} 💎</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   PROFILE — Status Kultivasi
================================================================ */
function ProfileScreen({ ctx, username, doLogout }) {
  const { user, push } = ctx;
  if (!username) {
    return <EmptyState ctx={ctx} title="Belum Terdaftar di Jianghu" body="Masuk untuk melacak status kultivasi, saldo Batu Spiritual, dan pencapaianmu." cta="Masuk / Daftar" onCta={() => push("login", {})} />;
  }

  const tierInfo = TIERS.find((t) => t.id === user.tier) || TIERS[0];
  const tierActive = user.tierUntil > Date.now() && user.tier !== "luar";
  const displayName = user.displayName || "Pendekar";

  return (
    <div style={{ padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <div style={{ width: 58, height: 58, borderRadius: "50%", background: C.jadeGlow, border: `2px solid ${C.jade}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Noto Serif SC', serif", fontWeight: 800, fontSize: 22, color: C.jade }}>
          {displayName[0].toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 17 }}>{displayName}</div>
          {user.email && <div style={{ fontSize: 11, color: C.textFaint, marginTop: 1 }}>{user.email}</div>}
          <div style={{ fontSize: 11.5, color: tierActive ? C.gold : C.textFaint, fontWeight: 700, marginTop: 2 }}>
            {tierActive ? "✦ " : ""}
            {tierInfo.label}
          </div>
        </div>
      </div>

      <div style={{ background: `linear-gradient(135deg, ${C.surfaceHi}, ${C.surface})`, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 18 }}>
        <div style={{ fontSize: 10.5, letterSpacing: 1.5, color: C.textFaint, textTransform: "uppercase" }}>Saldo Batu Spiritual</div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 26, fontWeight: 700, color: C.gold, marginTop: 4 }}>{fmt(user.stones)} 💎</div>
        {tierActive && <div style={{ fontSize: 11, color: C.textSoft, marginTop: 6 }}>Berlaku sampai {new Date(user.tierUntil).toLocaleDateString("id-ID")}</div>}
      </div>

      <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>Achievement Badges</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {(user.badges || []).length === 0 && <div style={{ fontSize: 12, color: C.textFaint }}>Belum ada lencana. Terus membaca!</div>}
        {(user.badges || []).map((b) => (
          <div key={b} style={{ background: C.goldGlow, border: `1px solid ${C.gold}`, borderRadius: 999, padding: "6px 12px", fontSize: 11, fontWeight: 700, color: C.gold }}>
            🏅 {b}
          </div>
        ))}
      </div>

      <MenuRow label="Dompet & Langganan Tier" onClick={() => push("wallet", {})} />
      <MenuRow label="Ruang Meditasi (Studio Penulis)" onClick={() => push("studio", {})} />
      <MenuRow label="Pengaturan Aplikasi & Akun" onClick={() => push("settings", {})} />
      <MenuRow label="Kebijakan Privasi & Ketentuan" onClick={() => push("legal", {})} />

      <button onClick={doLogout} style={{ width: "100%", marginTop: 22, padding: "12px 0", borderRadius: 10, border: `1.5px solid ${C.danger}`, background: "transparent", color: C.danger, fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>
        Keluar dari Jianghu
      </button>
    </div>
  );
}
function MenuRow({ label, value, onClick }) {
  return (
    <div onClick={onClick} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 4px", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}>
      <span style={{ fontSize: 14, fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 13, color: C.textFaint }}>{value || "›"}</span>
    </div>
  );
}

/* ================================================================
   STORY DETAIL
================================================================ */
function StoryDetailScreen({ novelId, ctx, onBack }) {
  const { push, toggleLibrary, username, tipNovel, rateNovel, getMyRating, loadComments, addComment, deleteComment, showToast } = ctx;
  const [novel, setNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [inLib, setInLib] = useState(false);
  const [unlockedMap, setUnlockedMap] = useState({});
  const [tipping, setTipping] = useState(false);
  const [myRating, setMyRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);

  async function reload() {
    const n = await gJSON(`novel:${novelId}`, true, null);
    setNovel(n);
    if (n) {
      const isAuthorNow = username === n.author;
      const chs = [];
      for (const cid of n.chapterIds) {
        const c = await gJSON(`chapter:${novelId}:${cid}`, true, null);
        if (c && (isAuthorNow || c.status !== "draft")) chs.push(c);
      }
      chs.sort((a, b) => a.order - b.order);
      setChapters(chs);
      if (username) {
        const map = {};
        for (const c of chs) if (c.isPremium) map[c.id] = !!(await sGet(`unlock:${username}:${novelId}:${c.id}`, false));
        setUnlockedMap(map);
        setMyRating(await getMyRating(novelId));
      }
      const lib = await gJSON(`library:${username || "_"}`, false, []);
      setInLib(lib.includes(novelId));
      setComments(await loadComments(novelId));
    }
  }
  useEffect(() => {
    reload();
  }, [novelId, username]);

  if (!novel) return <TopBar title="Memuat…" onBack={onBack} />;
  const isAuthor = username === novel.author;
  const avgRating = novel.ratingCount ? (novel.ratingSum / novel.ratingCount).toFixed(1) : null;

  async function handleTip(amount) {
    setTipping(true);
    const r = await tipNovel(novel, amount);
    setTipping(false);
    if (r === "insufficient") showToast("Batu Spiritual tidak cukup.");
    else if (r === true) {
      showToast(`Kamu mempersembahkan ${amount} Batu Spiritual!`);
      reload();
    }
  }

  async function handleRate(stars) {
    const next = await rateNovel(novel, stars);
    if (next) {
      setNovel(next);
      setMyRating(stars);
      showToast("Terima kasih atas penilaianmu!");
    }
  }

  async function handlePostComment() {
    if (!username) {
      push("login", { after: { screen: "story", params: { novelId } } });
      return;
    }
    if (!commentText.trim()) return;
    setPostingComment(true);
    const r = await addComment(novel, commentText);
    setPostingComment(false);
    if (r) {
      setNovel(r.novel);
      setComments(r.comments);
      setCommentText("");
    }
  }

  async function handleDeleteComment(commentId) {
    const r = await deleteComment(novel, commentId);
    if (r) {
      setNovel(r.novel);
      setComments(r.comments);
    }
  }

  return (
    <div>
      <TopBar
        title="Detail Kitab"
        onBack={onBack}
        right={
          isAuthor ? (
            <button onClick={() => push("studioNovel", { novelId })} style={{ border: `1.5px solid ${C.jade}`, background: "transparent", color: C.jade, borderRadius: 8, padding: "5px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              Kelola
            </button>
          ) : null
        }
      />
      <div style={{ padding: 18 }}>
        <div style={{ display: "flex", gap: 14 }}>
          <CoverThumb novel={novel} size="lg" />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 800, fontSize: 18, lineHeight: 1.25 }}>{novel.title}</div>
            <div style={{ fontSize: 12, color: C.textFaint, marginTop: 4 }}>oleh {novel.authorName}</div>
            <div style={{ fontSize: 11.5, color: C.textSoft, marginTop: 8 }}>
              {chapters.length} bab · {novel.reads || 0}x dibaca · {fmt(novel.tips || 0)} 💎 diterima
            </div>
            {avgRating && (
              <div style={{ fontSize: 11.5, color: C.gold, marginTop: 4, fontWeight: 700 }}>
                ⭐ {avgRating} ({novel.ratingCount} rating)
              </div>
            )}
          </div>
        </div>

        <BambooDivider />
        <div
          style={{
            fontSize: 13.5,
            lineHeight: 1.7,
            marginTop: 8,
            ...(synopsisExpanded
              ? {}
              : { display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }),
          }}
        >
          {novel.synopsis}
        </div>
        {novel.synopsis && novel.synopsis.length > 140 && (
          <button
            onClick={() => setSynopsisExpanded((v) => !v)}
            style={{ background: "none", border: "none", color: C.jade, fontSize: 12, fontWeight: 700, cursor: "pointer", padding: "6px 0 0" }}
          >
            {synopsisExpanded ? "Tampilkan lebih sedikit" : "Baca selengkapnya"}
          </button>
        )}

        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: C.textSoft, marginBottom: 6 }}>{myRating ? "Penilaianmu" : "Beri Penilaian"}</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => handleRate(s)}
                style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", padding: 0, opacity: s <= myRating ? 1 : 0.3, filter: s <= myRating ? "none" : "grayscale(1)" }}
              >
                ⭐
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button
            onClick={() => chapters.length > 0 && push("reader", { novelId, chapterId: chapters[0].id })}
            disabled={chapters.length === 0}
            style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "none", background: chapters.length ? C.jade : C.surfaceHi, color: chapters.length ? "#08170f" : C.textFaint, fontWeight: 700, fontSize: 14, cursor: chapters.length ? "pointer" : "default" }}
          >
            {chapters.length ? "Mulai Baca" : "Belum ada bab"}
          </button>
          <button
            onClick={async () => setInLib(await toggleLibrary(novelId))}
            style={{ padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${C.text}`, background: inLib ? C.text : "transparent", color: inLib ? C.bg : C.text, fontWeight: 700, fontSize: 14, cursor: "pointer" }}
          >
            {inLib ? "✓" : "+ Simpan"}
          </button>
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          {[10, 50, 100].map((amt) => (
            <button key={amt} onClick={() => handleTip(amt)} disabled={tipping} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: `1.5px solid ${C.gold}`, background: "transparent", color: C.gold, fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>
              🗡 Beri {amt}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Daftar Bab</div>
          {chapters.length === 0 && <div style={{ fontSize: 13, color: C.textFaint }}>Penulis belum menerbitkan bab apa pun.</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {chapters.map((c) => {
              const locked = c.isPremium && !unlockedMap[c.id];
              return (
                <div key={c.id} onClick={() => push("reader", { novelId, chapterId: c.id })} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <span style={{ fontSize: 11.5, color: C.textFaint, fontFamily: "'IBM Plex Mono', monospace" }}>{String(c.order).padStart(2, "0")}</span>
                    <span style={{ fontSize: 13.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</span>
                    {c.status === "draft" && (
                      <span style={{ fontSize: 9.5, background: C.goldGlow, color: C.gold, padding: "2px 7px", borderRadius: 999, fontWeight: 700, flexShrink: 0 }}>DRAFT</span>
                    )}
                  </div>
                  {c.isPremium ? locked ? <GiokLock size={22} tone="gold" /> : <GiokLock size={22} broken tone="jade" /> : <span style={{ fontSize: 10, color: C.jade, fontWeight: 700 }}>GRATIS</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Komentar ({comments.length})</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={username ? "Tulis komentar…" : "Masuk dulu untuk berkomentar"}
              style={{ ...inputStyle(), flex: 1 }}
              onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
            />
            <button
              onClick={handlePostComment}
              disabled={postingComment}
              style={{ padding: "0 16px", borderRadius: 10, border: "none", background: C.jade, color: "#08170f", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
            >
              Kirim
            </button>
          </div>
          {comments.length === 0 && <div style={{ fontSize: 12.5, color: C.textFaint, textAlign: "center", padding: "12px 0" }}>Belum ada komentar. Jadilah yang pertama.</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {comments.map((cm) => (
              <div key={cm.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>{cm.displayName}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, color: C.textFaint }}>{timeAgo(cm.ts)}</span>
                    {(cm.uid === username || isAuthor) && (
                      <button onClick={() => handleDeleteComment(cm.id)} style={{ background: "none", border: "none", color: C.textFaint, fontSize: 11, cursor: "pointer", padding: 0 }}>
                        Hapus
                      </button>
                    )}
                  </div>
                </div>
                <div style={{ fontSize: 12.5, marginTop: 4, lineHeight: 1.5 }}>{cm.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   READER — with glossary auto-link + paywall flow
================================================================ */
function renderWithGlossary(text, characters, worldEntries, onPick) {
  const items = [
    ...(characters || []).map((c) => ({ ...c, _kind: "character" })),
    ...(worldEntries || []).map((e) => ({ ...e, _kind: "world" })),
  ].filter((x) => x.name);
  if (items.length === 0) return text;
  const names = [...new Set(items.map((x) => x.name))].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${names.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  const parts = text.split(pattern);
  return parts.map((part, i) => {
    const match = items.find((x) => x.name === part);
    if (match) {
      return (
        <span key={i} onClick={() => onPick(match)} style={{ color: C.jade, borderBottom: `1px dashed ${C.jade}`, cursor: "pointer", fontWeight: 600 }}>
          {part}
        </span>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

function ReaderScreen({ novelId, chapterId, ctx, onBack }) {
  const { unlockChapter, isUnlocked, username, user, push, replace, markProgress, showToast } = ctx;
  const [novel, setNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [chapter, setChapter] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [loading, setLoading] = useState(true);
  const [glossaryPick, setGlossaryPick] = useState(null);
  const [paywallStep, setPaywallStep] = useState("locked");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setPaywallStep("locked");
      const n = await gJSON(`novel:${novelId}`, true, null);
      setNovel(n);
      if (n) {
        const chs = [];
        for (const cid of n.chapterIds) {
          const c = await gJSON(`chapter:${novelId}:${cid}`, true, null);
          if (c) chs.push(c);
        }
        chs.sort((a, b) => a.order - b.order);
        setChapters(chs);
        const c = chs.find((x) => x.id === chapterId) || chs[0];
        setChapter(c);
        if (c) {
          const activeTetua = user && user.tier === "tetua" && user.tierUntil > Date.now();
          const u = !c.isPremium || (await isUnlocked(novelId, c.id)) || activeTetua;
          setUnlocked(u);
          if (u) markProgress(novelId, c);
        }
      }
      setLoading(false);
    })();
  }, [novelId, chapterId, username]);

  function findCurrentRealm(character) {
    if (!novel || !character) return null;
    for (const fw of novel.frameworks || []) {
      for (const realm of fw.realms || []) {
        for (const stage of realm.stages || []) {
          if (stage.id === character.stageId) return { framework: fw, realm, stage };
        }
        if (realm.id === character.realmId) return { framework: fw, realm, stage: null };
      }
    }
    return null;
  }

  async function requestUnlock() {
    const price = chapter.coinPrice;
    if (!username) {
      push("login", { after: { screen: "reader", params: { novelId, chapterId: chapter.id } } });
      return;
    }
    if (user.stones < price) {
      setPaywallStep("sheet");
      return;
    }
    doUnlock();
  }

  async function doUnlock() {
    const r = await unlockChapter(novel, chapter);
    if (r === "insufficient") {
      setPaywallStep("sheet");
      return;
    }
    if (r === true) {
      setPaywallStep("delight");
      setTimeout(() => {
        setUnlocked(true);
        setPaywallStep("done");
        markProgress(novelId, chapter);
      }, 1400);
    }
  }

  async function completeTopUp(pkg) {
    setPaywallStep("paying");
    setTimeout(async () => {
      await ctx.buyStones(pkg);
      showToast(`${pkg.stones} Batu Spiritual telah diserap!`);
      setPaywallStep("locked");
      setTimeout(() => doUnlock(), 300);
    }, 900);
  }

  function goTo(id) {
    // Swap chapters in place — pushing here would mean every "next chapter"
    // click adds another layer the reader has to back out of one-by-one.
    replace("reader", { novelId, chapterId: id });
  }

  if (loading || !chapter) return <TopBar title="Membuka bab…" onBack={onBack} />;

  const idx = chapters.findIndex((c) => c.id === chapter.id);
  const prev = chapters[idx - 1];
  const next = chapters[idx + 1];
  const pick = glossaryPick ? findCurrentRealm(glossaryPick) : null;

  return (
    <div>
      <TopBar title={novel.title} onBack={onBack} />
      <div style={{ padding: "18px 20px 110px" }}>
        <div style={{ fontSize: 11, color: C.textFaint, marginBottom: 2 }}>
          Bab {chapter.order} dari {chapters.length}
        </div>
        <div style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 800, fontSize: 19, marginBottom: 14 }}>{chapter.title}</div>

        {unlocked ? (
          <>
            <div style={{ fontSize, lineHeight: 1.85, whiteSpace: "pre-wrap", fontFamily: "'Noto Serif', serif" }}>{renderWithGlossary(chapter.content, novel.characters, novel.worldEntries, setGlossaryPick)}</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30, gap: 10 }}>
              <button disabled={!prev} onClick={() => prev && goTo(prev.id)} style={navBtn(!!prev)}>
                ← Sebelumnya
              </button>
              <button disabled={!next} onClick={() => next && goTo(next.id)} style={navBtn(!!next)}>
                Berikutnya →
              </button>
            </div>
          </>
        ) : (
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 15, lineHeight: 1.85, filter: "blur(6px)", userSelect: "none", color: C.textSoft, maxHeight: 220, overflow: "hidden" }}>{chapter.content.slice(0, 400)}</div>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: `linear-gradient(180deg, transparent, ${C.bg} 55%)`, textAlign: "center", padding: 20 }}>
              <div style={{ animation: paywallStep === "delight" ? "lockCrack .6s ease forwards" : "none" }}>
                <GiokLock size={48} tone="gold" />
              </div>
              <div style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 800, fontSize: 16, marginTop: 14 }}>Segel Formasi Menutup Bab Ini</div>
              <div style={{ fontSize: 12.5, color: C.textSoft, marginTop: 6, maxWidth: 280, lineHeight: 1.6 }}>Bab ini terkunci oleh formasi pusaka. Buka segelnya untuk melanjutkan kisah.</div>
              <button onClick={requestUnlock} style={{ marginTop: 18, padding: "13px 26px", borderRadius: 999, border: "none", background: C.gold, color: "#241a04", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
                Buka Segel Bab · {chapter.coinPrice} 💎
              </button>
            </div>
          </div>
        )}
      </div>

      {unlocked && (
        <div style={{ position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 999, padding: 6 }}>
          <button onClick={() => setFontSize((f) => Math.max(13, f - 1))} style={fontBtn()}>
            A-
          </button>
          <button onClick={() => setFontSize((f) => Math.min(22, f + 1))} style={fontBtn()}>
            A+
          </button>
        </div>
      )}

      {glossaryPick && (
        <div onClick={() => setGlossaryPick(null)} style={overlayStyle()}>
          <div onClick={(e) => e.stopPropagation()} style={sheetStyle()}>
            {glossaryPick._kind === "world" ? (
              <>
                <span style={{ fontSize: 9.5, fontWeight: 700, color: C.gold, background: C.goldGlow, padding: "2px 8px", borderRadius: 999 }}>
                  {(WORLD_ENTRY_TYPES.find((t) => t.id === glossaryPick.type) || {}).label || "Catatan Dunia"}
                </span>
                <div style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 800, fontSize: 17, marginTop: 8 }}>{glossaryPick.name}</div>
                <BambooDivider />
                <div style={{ fontSize: 13, lineHeight: 1.7, marginTop: 4, color: C.textSoft }}>{glossaryPick.description || "Belum ada deskripsi."}</div>
              </>
            ) : (
              <>
                <div style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 800, fontSize: 17 }}>{glossaryPick.name}</div>
                {glossaryPick.sect && <div style={{ fontSize: 12, color: C.textSoft, marginTop: 4 }}>Sekte: {glossaryPick.sect}</div>}
                {glossaryPick.spiritualRoot && <div style={{ fontSize: 12, color: C.textSoft }}>Akar Spiritual: {glossaryPick.spiritualRoot}</div>}
                {glossaryPick.weapon && <div style={{ fontSize: 12, color: C.textSoft }}>Senjata: {glossaryPick.weapon}</div>}
                <BambooDivider />
                {pick ? (
                  <div style={{ fontSize: 13, marginTop: 4 }}>
                    <span style={{ color: C.textFaint }}>Kultivasi: </span>
                    <span style={{ color: C.jade, fontWeight: 700 }}>
                      {pick.realm.realmName}
                      {pick.stage ? ` - ${pick.stage.stageName}` : ""}
                    </span>
                  </div>
                ) : (
                  <div style={{ fontSize: 12.5, color: C.textFaint, marginTop: 4 }}>Tingkat kultivasi belum ditetapkan penulis.</div>
                )}
              </>
            )}
            <button onClick={() => setGlossaryPick(null)} style={{ marginTop: 16, width: "100%", padding: "11px 0", borderRadius: 10, border: `1px solid ${C.border}`, background: "transparent", color: C.text, fontWeight: 700, cursor: "pointer" }}>
              Tutup
            </button>
          </div>
        </div>
      )}

      {paywallStep === "sheet" && (
        <div onClick={() => setPaywallStep("locked")} style={overlayStyle()}>
          <div onClick={(e) => e.stopPropagation()} style={sheetStyle()}>
            <div style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 800, fontSize: 16 }}>Batu Spiritual Tidak Cukup</div>
            <div style={{ fontSize: 12, color: C.textSoft, marginTop: 4, marginBottom: 14 }}>Isi ulang dulu untuk membuka segel bab ini.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {STONE_PACKAGES.map((p) => (
                <button key={p.id} onClick={() => completeTopUp(p)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.surfaceRaised, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "12px 14px", cursor: "pointer" }}>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{p.label}</div>
                    <div style={{ fontSize: 11, color: C.textFaint, fontFamily: "'IBM Plex Mono', monospace" }}>
                      {p.stones} 💎 {p.bonus && <span style={{ color: C.jade }}>{p.bonus}</span>}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 12.5, color: C.gold }}>{p.price}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {paywallStep === "paying" && (
        <div style={overlayStyle()}>
          <div style={{ ...sheetStyle(), textAlign: "center" }}>
            <div style={{ fontSize: 30, animation: "goldFlash 1s ease infinite" }}>💎</div>
            <div style={{ fontSize: 13, color: C.textSoft, marginTop: 10 }}>Memverifikasi pembayaran…</div>
          </div>
        </div>
      )}

      {paywallStep === "delight" && (
        <div style={{ position: "fixed", inset: 0, zIndex: 400, pointerEvents: "none" }}>
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: `${(i * 6.3) % 100}%`, top: -30, fontSize: 20, animation: `coinFall ${0.9 + (i % 5) * 0.15}s ease-in ${(i % 6) * 0.05}s forwards` }}>
              💰
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
function navBtn(enabled) {
  return { flex: 1, padding: "11px 0", borderRadius: 10, border: `1.5px solid ${enabled ? C.text : C.border}`, background: "transparent", color: enabled ? C.text : C.textFaint, fontSize: 12.5, fontWeight: 700, cursor: enabled ? "pointer" : "default" };
}
function fontBtn() {
  return { width: 40, height: 34, borderRadius: 999, border: "none", background: C.surfaceHi, color: C.text, fontWeight: 700, fontSize: 13, cursor: "pointer" };
}
function overlayStyle() {
  return { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 350 };
}
function sheetStyle() {
  return { width: "100%", maxWidth: 480, background: C.surface, borderTop: `1px solid ${C.border}`, borderRadius: "18px 18px 0 0", padding: 22, animation: "fadeUp .25s ease" };
}

/* ================================================================
   WALLET
================================================================ */
function WalletScreen({ ctx, onBack }) {
  const { username, user, buyStones, purchaseTier, showToast } = ctx;

  async function handleTier(tierId) {
    const r = await purchaseTier(tierId);
    if (r === "insufficient") showToast("Batu Spiritual tidak cukup untuk tier ini.");
    if (r === "ok") showToast(`Selamat! Kamu naik menjadi ${TIERS.find((t) => t.id === tierId).label}.`);
  }
  async function handleBuy(p) {
    await buyStones(p);
    showToast(`${p.stones} Batu Spiritual telah diserap!`);
  }

  const body = !username ? (
    <EmptyInline ctx={ctx} text="Masuk untuk mengisi Batu Spiritual dan berlangganan tier." />
  ) : (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${C.surfaceHi}, ${C.surface})`, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, marginBottom: 22 }}>
        <div style={{ fontSize: 10.5, letterSpacing: 1.5, color: C.textFaint, textTransform: "uppercase" }}>Saldo Batu Spiritual</div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 30, fontWeight: 700, color: C.gold, marginTop: 4 }}>{fmt(user.stones)} 💎</div>
      </div>

      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Isi Batu Spiritual</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {STONE_PACKAGES.map((p) => (
          <button key={p.id} onClick={() => handleBuy(p)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "13px 16px", cursor: "pointer" }}>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{p.label}</div>
              <div style={{ fontSize: 11, color: C.textFaint, fontFamily: "'IBM Plex Mono', monospace" }}>
                {p.stones} 💎 {p.bonus && <span style={{ color: C.jade }}>{p.bonus}</span>}
              </div>
            </div>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.gold }}>{p.price}</div>
          </button>
        ))}
      </div>

      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Tier Keanggotaan</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {TIERS.filter((t) => t.price > 0).map((t) => {
          const isCurrent = user.tier === t.id && user.tierUntil > Date.now();
          return (
            <div key={t.id} style={{ background: C.surface, border: `1.5px solid ${isCurrent ? C.jade : C.border}`, borderRadius: 14, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 800, fontSize: 14.5 }}>{t.label}</div>
                {isCurrent && <span style={{ fontSize: 10, color: C.jade, fontWeight: 700 }}>AKTIF</span>}
              </div>
              <div style={{ fontSize: 12, color: C.textSoft, marginTop: 4, marginBottom: 12 }}>{t.perk}</div>
              <button onClick={() => handleTier(t.id)} style={{ width: "100%", padding: "11px 0", borderRadius: 10, border: "none", background: C.gold, color: "#241a04", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>
                {isCurrent ? "Perpanjang" : "Berlangganan"} · {t.price} 💎 / 30 hari
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 10.5, color: C.textFaint, marginTop: 18, textAlign: "center", lineHeight: 1.6 }}>Transaksi di halaman ini bersifat simulasi untuk pengujian aplikasi.</div>
    </div>
  );

  return onBack ? (
    <div>
      <TopBar title="Dompet & Tier" onBack={onBack} />
      <div style={{ padding: 18 }}>{body}</div>
    </div>
  ) : (
    <div style={{ padding: 18 }}>{body}</div>
  );
}
function EmptyInline({ ctx, text }) {
  const { push } = ctx;
  return (
    <div style={{ textAlign: "center", padding: "30px 10px" }}>
      <div style={{ fontSize: 13, color: C.textSoft, marginBottom: 14 }}>{text}</div>
      <button onClick={() => push("login", {})} style={{ padding: "11px 22px", borderRadius: 10, border: "none", background: C.jade, color: "#08170f", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>
        Masuk / Daftar
      </button>
    </div>
  );
}
function EmptyState({ ctx, title, body, cta, onCta }) {
  return (
    <div style={{ padding: "60px 28px", textAlign: "center" }}>
      <GiokLock size={44} />
      <div style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 800, fontSize: 16, marginTop: 14 }}>{title}</div>
      <div style={{ fontSize: 12.5, color: C.textSoft, marginTop: 8, lineHeight: 1.6 }}>{body}</div>
      <button onClick={onCta} style={{ marginTop: 18, padding: "11px 22px", borderRadius: 10, border: "none", background: C.jade, color: "#08170f", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>
        {cta}
      </button>
    </div>
  );
}

/* ================================================================
   SETTINGS — Account & App
================================================================ */
function SettingsScreen({ ctx, onBack }) {
  const { user, updateDisplayName, sendPasswordReset, deleteAccount, doLogout, showToast, push } = ctx;
  const [nameDraft, setNameDraft] = useState(user ? user.displayName : "");
  const [savingName, setSavingName] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);

  async function handleSaveName() {
    if (!nameDraft.trim()) return;
    setSavingName(true);
    await updateDisplayName(nameDraft);
    setSavingName(false);
    showToast("Nama pena tersimpan.");
  }

  async function handleResetPassword() {
    setResetBusy(true);
    const r = await sendPasswordReset();
    setResetBusy(false);
    showToast(r.ok ? "Tautan reset password terkirim ke email kamu." : r.error);
  }

  async function handleDeleteAccount() {
    if (!window.confirm("Hapus akun ini secara permanen? Cerita dan bab yang sudah kamu terbitkan TIDAK ikut terhapus, tapi kamu tidak akan bisa masuk lagi dengan akun ini.")) return;
    setDeleteBusy(true);
    const r = await deleteAccount();
    setDeleteBusy(false);
    if (r.ok) {
      showToast("Akun telah dihapus.");
    } else {
      showToast(r.error);
    }
  }

  if (!user) return <TopBar title="Pengaturan" onBack={onBack} />;

  return (
    <div>
      <TopBar title="Pengaturan Aplikasi & Akun" onBack={onBack} />
      <div style={{ padding: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>Akun</div>

        <Field label="Nama Pena">
          <div style={{ display: "flex", gap: 8 }}>
            <input value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} style={{ ...inputStyle(), flex: 1 }} />
            <button onClick={handleSaveName} disabled={savingName} style={{ padding: "0 16px", borderRadius: 10, border: "none", background: C.jade, color: "#08170f", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>
              Simpan
            </button>
          </div>
        </Field>

        <Field label="Email">
          <div style={{ ...inputStyle(), color: C.textFaint, cursor: "default" }}>{user.email || "Login via Google"}</div>
        </Field>

        {user.email && (
          <button
            onClick={handleResetPassword}
            disabled={resetBusy}
            style={{ width: "100%", padding: "11px 0", borderRadius: 10, border: `1.5px solid ${C.border}`, background: "transparent", color: C.text, fontWeight: 700, fontSize: 12.5, cursor: "pointer", marginBottom: 20 }}
          >
            {resetBusy ? "Mengirim…" : "Kirim Tautan Reset Password"}
          </button>
        )}

        <BambooDivider />

        <div style={{ fontWeight: 700, fontSize: 13.5, margin: "18px 0 10px" }}>Tentang Aplikasi</div>
        <MenuRow label="Kebijakan Privasi & Ketentuan" onClick={() => push("legal", {})} />
        <MenuRow label="Versi Aplikasi" value="1.0.0" />

        <div style={{ marginTop: 28, border: `1.5px solid ${C.danger}`, borderRadius: 12, padding: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: C.danger, marginBottom: 6 }}>Zona Berbahaya</div>
          <div style={{ fontSize: 11.5, color: C.textSoft, marginBottom: 12, lineHeight: 1.5 }}>
            Menghapus akun bersifat permanen. Saldo Batu Spiritual dan riwayat transaksi akan hilang. Cerita yang sudah kamu terbitkan tetap ada di katalog tapi tidak bisa lagi kamu kelola.
          </div>
          <button onClick={handleDeleteAccount} disabled={deleteBusy} style={{ width: "100%", padding: "10px 0", borderRadius: 10, border: "none", background: C.danger, color: "#fff", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>
            {deleteBusy ? "Menghapus…" : "Hapus Akun Ini"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   LEGAL — Privacy Policy & Terms
================================================================ */
function LegalScreen({ onBack }) {
  return (
    <div>
      <TopBar title="Kebijakan Privasi & Ketentuan" onBack={onBack} />
      <div style={{ padding: 20, fontSize: 13, lineHeight: 1.75, color: C.text }}>
        <div style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 800, fontSize: 16, marginBottom: 4 }}>Kebijakan Privasi</div>
        <div style={{ fontSize: 11, color: C.textFaint, marginBottom: 14 }}>Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</div>

        <p><b>Data yang kami simpan:</b> email dan password (dikelola aman oleh Firebase Authentication, kami tidak pernah melihat password kamu dalam bentuk asli), nama pena, progres bacaan, cerita dan bab yang kamu tulis, saldo Batu Spiritual, serta riwayat transaksi di dalam aplikasi.</p>

        <p><b>Siapa yang bisa melihat data:</b> Nama pena, cerita, bab, komentar, dan rating bersifat publik dan bisa dilihat semua pengguna. Email dan riwayat transaksi bersifat privat.</p>

        <p><b>Pembayaran:</b> Fitur isi ulang Batu Spiritual dan langganan tier saat ini bersifat simulasi untuk pengujian aplikasi. Belum ada uang sungguhan yang diproses. Bila di masa depan pembayaran sungguhan diaktifkan, kebijakan ini akan diperbarui.</p>

        <p><b>Penghapusan akun:</b> Hubungi pengembang aplikasi untuk permintaan penghapusan akun dan data terkait.</p>

        <BambooDivider />

        <div style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 800, fontSize: 16, margin: "18px 0 4px" }}>Ketentuan Layanan</div>

        <p><b>Konten yang dilarang:</b> Konten yang melanggar hukum, plagiarisme, ujaran kebencian, atau pelecehan tidak diperbolehkan. Kami berhak menghapus konten yang melanggar tanpa pemberitahuan.</p>

        <p><b>Hak cipta:</b> Penulis tetap memegang hak cipta atas karya yang diterbitkan. Dengan menerbitkan di platform ini, kamu memberi izin bagi pembaca terdaftar untuk membaca karyamu sesuai pengaturan gratis/premium yang kamu tetapkan sendiri.</p>

        <p><b>Pendapatan penulis:</b> Bagi hasil 70% (pembukaan bab premium) dan 80% (persembahan/tip) untuk penulis bersifat ilustratif dalam versi pengujian ini dan belum melibatkan pencairan dana sungguhan.</p>

        <p><b>Tanggung jawab pengguna:</b> Kamu bertanggung jawab penuh atas konten yang kamu terbitkan dan komentar yang kamu tulis.</p>

        <p style={{ marginTop: 18, color: C.textFaint, fontSize: 11.5 }}>Aplikasi ini adalah produk dalam tahap pengembangan. Ketentuan dapat berubah sewaktu-waktu.</p>
      </div>
    </div>
  );
}

/* ================================================================
   LOGIN / SIGNUP
================================================================ */
function LoginScreen({ ctx, onBack, params }) {
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  async function submit() {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Isi email dan password dulu.");
      return;
    }
    if (mode === "signup" && !displayName.trim()) {
      setError("Isi nama pena dulu.");
      return;
    }
    setBusy(true);
    const r =
      mode === "signup" ? await ctx.doSignup(email.trim(), password, displayName) : await ctx.doLoginEmail(email.trim(), password);
    setBusy(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    onBack();
    if (params && params.after) ctx.push(params.after.screen, params.after.params);
  }

  async function submitGoogle() {
    setError("");
    setGoogleBusy(true);
    const r = await ctx.doGoogleSignIn();
    setGoogleBusy(false);
    if (!r.ok) {
      if (r.error) setError(r.error);
      return;
    }
    onBack();
    if (params && params.after) ctx.push(params.after.screen, params.after.params);
  }

  return (
    <div>
      <TopBar title={mode === "signup" ? "Daftar Akun" : "Masuk"} onBack={onBack} />
      <div style={{ padding: 24 }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <span style={{ fontFamily: "'Ma Shan Zheng', serif", fontSize: 50, color: C.jade }}>俠</span>
          <div style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 800, fontSize: 18, marginTop: 10 }}>
            {mode === "signup" ? "Daftar ke Jianghu-Net" : "Masuki Jianghu"}
          </div>
          <div style={{ fontSize: 12, color: C.textSoft, marginTop: 6, lineHeight: 1.6 }}>
            {mode === "signup" ? "Nama pena akan tampil ke pembaca lain. Email & password dipakai untuk masuk kembali." : "Masuk dengan email dan password yang sudah kamu daftarkan."}
          </div>
        </div>

        <button
          onClick={submitGoogle}
          disabled={googleBusy}
          style={{
            width: "100%",
            padding: "12px 0",
            borderRadius: 10,
            border: `1.5px solid ${C.border}`,
            background: "#fff",
            color: "#1f1f1f",
            fontWeight: 700,
            fontSize: 13.5,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginBottom: 18,
            opacity: googleBusy ? 0.7 : 1,
          }}
        >
          <span style={{ width: 18, height: 18, borderRadius: "50%", background: "conic-gradient(#4285F4 0deg 90deg, #34A853 90deg 180deg, #FBBC05 180deg 270deg, #EA4335 270deg 360deg)", display: "inline-block" }} />
          {googleBusy ? "Menghubungkan…" : "Lanjutkan dengan Google"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <span style={{ fontSize: 11, color: C.textFaint }}>atau pakai email</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
        </div>

        {mode === "signup" && (
          <Field label="Nama Pena">
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Contoh: Pendekar Angin Utara" style={inputStyle()} />
          </Field>
        )}
        <Field label="Email">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" style={inputStyle()} />
        </Field>
        <Field label="Password">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "signup" ? "Minimal 6 karakter" : "Password kamu"}
            style={inputStyle()}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </Field>

        {error && <div style={{ color: C.danger, fontSize: 12.5, marginBottom: 12, lineHeight: 1.5 }}>{error}</div>}

        <button
          onClick={submit}
          disabled={busy}
          style={{ width: "100%", padding: "13px 0", borderRadius: 10, border: "none", background: C.jade, color: "#08170f", fontWeight: 700, fontSize: 14, cursor: "pointer", opacity: busy ? 0.7 : 1 }}
        >
          {busy ? "Memproses…" : mode === "signup" ? "Daftar" : "Masuk"}
        </button>

        <button
          onClick={() => {
            setMode(mode === "signup" ? "login" : "signup");
            setError("");
          }}
          style={{ width: "100%", marginTop: 14, background: "none", border: "none", color: C.textSoft, fontSize: 12.5, cursor: "pointer", textDecoration: "underline" }}
        >
          {mode === "signup" ? "Sudah punya akun? Masuk di sini" : "Belum punya akun? Daftar di sini"}
        </button>
      </div>
    </div>
  );
}

/* ================================================================
   WRITER STUDIO — Ruang Meditasi
================================================================ */
function StudioScreen({ ctx, onBack }) {
  const { username, novels, push } = ctx;
  const mine = novels.filter((n) => n.author === username);

  return (
    <div>
      <TopBar title="Ruang Meditasi" onBack={onBack} />
      <div style={{ padding: 18 }}>
        <div style={{ fontSize: 12, color: C.textSoft, marginBottom: 18, lineHeight: 1.6 }}>Kelola naskah, world-building, dan pendapatanmu sebagai penulis.</div>
        <button
          onClick={async () => {
            const n = await ctx.createNovel({ title: "Kitab Tanpa Judul", synopsis: "Sinopsis belum ditulis.", genre: GENRES[0].label, glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)] });
            push("studioNovel", { novelId: n.id });
          }}
          style={{ width: "100%", padding: "13px 0", borderRadius: 10, border: "none", background: C.jade, color: "#08170f", fontWeight: 800, fontSize: 14, cursor: "pointer", marginBottom: 20 }}
        >
          + Naskah Baru
        </button>

        <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>Naskahku ({mine.length})</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {mine.map((n) => (
            <div key={n.id} onClick={() => push("studioNovel", { novelId: n.id })} style={{ display: "flex", gap: 12, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, cursor: "pointer" }}>
              <CoverThumb novel={n} size="sm" radius={8} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{n.title}</div>
                <div style={{ fontSize: 11, color: C.textFaint, marginTop: 3 }}>
                  {n.chapterIds.length} bab · {n.characters.length} karakter · {n.frameworks.length} sistem kultivasi
                </div>
              </div>
            </div>
          ))}
          {mine.length === 0 && <div style={{ fontSize: 12.5, color: C.textFaint, textAlign: "center", padding: "20px 0" }}>Belum ada naskah. Mulai satu di atas.</div>}
        </div>
      </div>
    </div>
  );
}

function StudioNovelScreen({ novelId, ctx, onBack }) {
  const { push } = ctx;
  const [subtab, setSubtab] = useState("naskah");
  const [novel, setNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [genre, setGenre] = useState(GENRES[0].label);
  const [glyph, setGlyph] = useState(GLYPHS[0]);
  const [coverImage, setCoverImage] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [saving, setSaving] = useState(false);

  async function reload() {
    const n = await gJSON(`novel:${novelId}`, true, null);
    setNovel(n);
    if (n) {
      setTitle(n.title);
      setSynopsis(n.synopsis);
      setGenre(n.genre);
      setGlyph(n.glyph);
      setCoverImage(n.coverImage || null);
      const chs = [];
      for (const cid of n.chapterIds) {
        const c = await gJSON(`chapter:${novelId}:${cid}`, true, null);
        if (c) chs.push(c);
      }
      chs.sort((a, b) => a.order - b.order);
      setChapters(chs);
    }
  }
  useEffect(() => {
    reload();
  }, [novelId]);

  async function handleCoverChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const dataUrl = await fileToResizedDataURL(file);
      setCoverImage(dataUrl);
    } catch (err) {
      ctx.showToast("Gagal memproses gambar. Coba file lain.");
    }
    setUploadingCover(false);
  }

  async function handleSaveMeta() {
    setSaving(true);
    const next = { ...novel, title, synopsis, genre, glyph, coverImage };
    await ctx.saveNovel(next);
    setNovel(next);
    setSaving(false);
    ctx.showToast("Perubahan tersimpan.");
  }

  if (!novel) return <TopBar title="Memuat…" onBack={onBack} />;

  const tabs = [
    { id: "naskah", label: "Naskah" },
    { id: "world", label: "World-Building" },
    { id: "power", label: "Sistem Tingkatan" },
    { id: "distribusi", label: "Distribusi" },
  ];

  return (
    <div>
      <TopBar title={novel.title} onBack={onBack} />
      <div style={{ display: "flex", gap: 6, padding: "12px 16px", overflowX: "auto" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setSubtab(t.id)}
            style={{ whiteSpace: "nowrap", padding: "8px 14px", borderRadius: 999, border: `1.5px solid ${subtab === t.id ? C.jade : C.border}`, background: subtab === t.id ? C.jadeGlow : "transparent", color: subtab === t.id ? C.jade : C.textSoft, fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {subtab === "naskah" && (
        <div style={{ padding: 18 }}>
          <Field label="Judul Kitab">
            <input value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle()} />
          </Field>
          <Field label="Sinopsis">
            <textarea value={synopsis} onChange={(e) => setSynopsis(e.target.value)} rows={4} style={{ ...inputStyle(), resize: "vertical" }} />
          </Field>
          <Field label="Aliran / Genre">
            <select value={genre} onChange={(e) => setGenre(e.target.value)} style={inputStyle()}>
              {GENRES.map((g) => (
                <option key={g.id} value={g.label}>
                  {g.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Sampul Cerita (Cover)">
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div
                style={{
                  width: 84,
                  height: 112,
                  borderRadius: 10,
                  border: `1px solid ${C.border}`,
                  backgroundImage: coverImage ? `url("${coverImage}")` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  background: coverImage ? undefined : `linear-gradient(160deg, ${C.surfaceHi}, ${C.surface})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {!coverImage && <span style={{ fontFamily: "'Noto Serif SC', serif", fontSize: 34, color: C.jade, fontWeight: 800 }}>{glyph}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: "inline-block",
                    padding: "9px 16px",
                    borderRadius: 999,
                    border: `1.5px solid ${C.jade}`,
                    color: C.jade,
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {uploadingCover ? "Memproses…" : coverImage ? "Ganti Foto" : "Upload Foto"}
                  <input type="file" accept="image/*" onChange={handleCoverChange} style={{ display: "none" }} disabled={uploadingCover} />
                </label>
                {coverImage && (
                  <button
                    onClick={() => setCoverImage(null)}
                    style={{ display: "block", marginTop: 8, background: "none", border: "none", color: C.textFaint, fontSize: 11.5, cursor: "pointer", textDecoration: "underline", padding: 0 }}
                  >
                    Hapus foto, pakai lambang saja
                  </button>
                )}
                <div style={{ fontSize: 10.5, color: C.textFaint, marginTop: 8, lineHeight: 1.5 }}>JPG/PNG. Otomatis dipangkas & dikompres jadi ukuran sampul buku.</div>
              </div>
            </div>
          </Field>
          <Field label="Lambang Sampul (fallback bila tanpa foto)">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {GLYPHS.map((g) => (
                <button key={g} onClick={() => setGlyph(g)} style={{ width: 40, height: 40, borderRadius: 10, border: `2px solid ${glyph === g ? C.jade : C.border}`, background: glyph === g ? C.jadeGlow : "transparent", color: C.text, fontFamily: "'Noto Serif SC', serif", fontWeight: 800, fontSize: 17, cursor: "pointer" }}>
                  {g}
                </button>
              ))}
            </div>
          </Field>
          <button onClick={handleSaveMeta} disabled={saving} style={{ width: "100%", padding: "12px 0", borderRadius: 10, border: "none", background: C.jade, color: "#08170f", fontWeight: 800, fontSize: 13.5, cursor: "pointer", marginBottom: 24 }}>
            Simpan Perubahan
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Bab ({chapters.length})</div>
            <button onClick={() => push("chapterEditor", { novelId, chapterId: null })} style={{ border: "none", background: C.jade, color: "#08170f", borderRadius: 999, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              + Tambah Bab
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 28 }}>
            {chapters.map((c) => (
              <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10 }}>
                <div onClick={() => push("chapterEditor", { novelId, chapterId: c.id })} style={{ flex: 1, cursor: "pointer", minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.order}. {c.title}
                    </span>
                    {c.status === "draft" && <span style={{ fontSize: 9, background: C.goldGlow, color: C.gold, padding: "1px 6px", borderRadius: 999, fontWeight: 700, flexShrink: 0 }}>DRAFT</span>}
                  </div>
                  <span style={{ fontSize: 10.5, color: c.isPremium ? C.gold : C.jade, fontWeight: 700 }}>{c.isPremium ? `${c.coinPrice} 💎` : "GRATIS"}</span>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={async () => {
                      const next = await ctx.setChapterStatus(c, c.status === "draft" ? "published" : "draft");
                      setChapters((prev) => prev.map((x) => (x.id === next.id ? next : x)));
                    }}
                    style={{ border: `1px solid ${C.border}`, background: "transparent", color: C.textSoft, borderRadius: 8, padding: "5px 8px", fontSize: 10.5, cursor: "pointer" }}
                  >
                    {c.status === "draft" ? "Terbitkan" : "Jadikan Draft"}
                  </button>
                  <button
                    onClick={async () => {
                      if (!window.confirm(`Hapus bab "${c.title}"? Tindakan ini tidak bisa dibatalkan.`)) return;
                      const next = await ctx.deleteChapter(novel, c.id);
                      setNovel(next);
                      setChapters((prev) => prev.filter((x) => x.id !== c.id));
                    }}
                    style={{ border: `1px solid ${C.danger}`, background: "transparent", color: C.danger, borderRadius: 8, padding: "5px 8px", fontSize: 10.5, cursor: "pointer" }}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
            {chapters.length === 0 && <div style={{ fontSize: 12.5, color: C.textFaint }}>Belum ada bab.</div>}
          </div>

          <div style={{ border: `1.5px solid ${C.danger}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.danger, marginBottom: 6 }}>Zona Berbahaya</div>
            <div style={{ fontSize: 11.5, color: C.textSoft, marginBottom: 12, lineHeight: 1.5 }}>Menghapus kitab akan menyembunyikannya dari katalog secara permanen, termasuk seluruh babnya.</div>
            <button
              onClick={async () => {
                if (!window.confirm(`Hapus seluruh kitab "${novel.title}"? Tindakan ini tidak bisa dibatalkan.`)) return;
                await ctx.deleteNovel(novel.id);
                ctx.showToast("Kitab telah dihapus.");
                onBack();
              }}
              style={{ width: "100%", padding: "10px 0", borderRadius: 10, border: "none", background: C.danger, color: "#fff", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}
            >
              Hapus Kitab Ini
            </button>
          </div>
        </div>
      )}

      {subtab === "world" && <WorldBuildingPanel novel={novel} ctx={ctx} />}
      {subtab === "power" && <PowerSystemScreen novelId={novelId} ctx={ctx} embedded onChange={reload} />}
      {subtab === "distribusi" && <DistributionScreen novelId={novelId} ctx={ctx} embedded />}
    </div>
  );
}

const WORLD_ENTRY_TYPES = [
  { id: "sekte", label: "Sekte / Faksi", glyph: "宗" },
  { id: "lokasi", label: "Lokasi", glyph: "地" },
  { id: "pusaka", label: "Pusaka / Item", glyph: "劍" },
  { id: "sejarah", label: "Sejarah / Lore", glyph: "史" },
  { id: "istilah", label: "Istilah", glyph: "詞" },
];

function WorldBuildingPanel({ novel, ctx }) {
  const { push } = ctx;
  const [subtab, setSubtab] = useState("karakter");

  return (
    <div style={{ padding: 18 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <SubTabBtn label="Karakter" active={subtab === "karakter"} onClick={() => setSubtab("karakter")} />
        <SubTabBtn label="Catatan Dunia" active={subtab === "dunia"} onClick={() => setSubtab("dunia")} />
      </div>

      {subtab === "karakter" && (
        <div>
          <div style={{ fontSize: 12, color: C.textSoft, marginBottom: 16, lineHeight: 1.6 }}>
            Lacak afiliasi sekte, akar spiritual, dan senjata setiap karakter agar konsisten di seluruh bab. Pembaca bisa mengetuk nama karakter di teks untuk melihat status kultivasinya.
          </div>
          <button onClick={() => push("characterEditor", { novelId: novel.id, characterId: null })} style={{ width: "100%", padding: "12px 0", borderRadius: 10, border: "none", background: C.jade, color: "#08170f", fontWeight: 800, fontSize: 13.5, cursor: "pointer", marginBottom: 18 }}>
            + Tambah Karakter
          </button>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(novel.characters || []).map((c) => (
              <div key={c.id} onClick={() => push("characterEditor", { novelId: novel.id, characterId: c.id })} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 13, cursor: "pointer" }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</div>
                <div style={{ fontSize: 11.5, color: C.textFaint, marginTop: 4 }}>
                  {c.sect ? `Sekte: ${c.sect}` : "Sekte belum diisi"} {c.weapon ? `· Senjata: ${c.weapon}` : ""}
                </div>
              </div>
            ))}
            {(novel.characters || []).length === 0 && <div style={{ fontSize: 12.5, color: C.textFaint, textAlign: "center", padding: "16px 0" }}>Belum ada karakter tercatat.</div>}
          </div>
        </div>
      )}

      {subtab === "dunia" && (
        <div>
          <div style={{ fontSize: 12, color: C.textSoft, marginBottom: 16, lineHeight: 1.6 }}>
            Catat lokasi, sekte/faksi, pusaka, sejarah, dan istilah dunia ceritamu agar konsisten. Nama entri ini juga bisa diketuk pembaca di dalam teks bab, sama seperti nama karakter.
          </div>
          <button onClick={() => push("worldEntryEditor", { novelId: novel.id, entryId: null })} style={{ width: "100%", padding: "12px 0", borderRadius: 10, border: "none", background: C.jade, color: "#08170f", fontWeight: 800, fontSize: 13.5, cursor: "pointer", marginBottom: 18 }}>
            + Tambah Catatan Dunia
          </button>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(novel.worldEntries || []).map((e) => {
              const typeInfo = WORLD_ENTRY_TYPES.find((t) => t.id === e.type) || WORLD_ENTRY_TYPES[0];
              return (
                <div key={e.id} onClick={() => push("worldEntryEditor", { novelId: novel.id, entryId: e.id })} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 13, cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 9.5, fontWeight: 700, color: C.gold, background: C.goldGlow, padding: "2px 8px", borderRadius: 999 }}>{typeInfo.label}</span>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{e.name}</span>
                  </div>
                  {e.description && (
                    <div style={{ fontSize: 11.5, color: C.textFaint, marginTop: 6, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{e.description}</div>
                  )}
                </div>
              );
            })}
            {(novel.worldEntries || []).length === 0 && <div style={{ fontSize: 12.5, color: C.textFaint, textAlign: "center", padding: "16px 0" }}>Belum ada catatan dunia.</div>}
          </div>
        </div>
      )}
    </div>
  );
}

function WorldEntryEditorScreen({ novelId, entryId, ctx, onBack }) {
  const { showToast } = ctx;
  const [novel, setNovel] = useState(null);
  const [type, setType] = useState(WORLD_ENTRY_TYPES[0].id);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    (async () => {
      const n = await gJSON(`novel:${novelId}`, true, null);
      setNovel(n);
      if (entryId && n) {
        const e = (n.worldEntries || []).find((x) => x.id === entryId);
        if (e) {
          setType(e.type);
          setName(e.name);
          setDescription(e.description || "");
        }
      }
    })();
  }, [novelId, entryId]);

  if (!novel) return <TopBar title="Memuat…" onBack={onBack} />;

  async function handleSave() {
    if (!name.trim()) return;
    const entries = [...(novel.worldEntries || [])];
    if (entryId) {
      const i = entries.findIndex((e) => e.id === entryId);
      entries[i] = { ...entries[i], type, name, description };
    } else {
      entries.push({ id: uid("world"), type, name, description });
    }
    await ctx.saveNovel({ ...novel, worldEntries: entries });
    showToast("Catatan dunia tersimpan.");
    onBack();
  }

  async function handleDelete() {
    if (!window.confirm(`Hapus catatan "${name}"?`)) return;
    const entries = (novel.worldEntries || []).filter((e) => e.id !== entryId);
    await ctx.saveNovel({ ...novel, worldEntries: entries });
    showToast("Catatan dihapus.");
    onBack();
  }

  return (
    <div>
      <TopBar title={entryId ? "Sunting Catatan Dunia" : "Catatan Dunia Baru"} onBack={onBack} />
      <div style={{ padding: 18 }}>
        <Field label="Tipe">
          <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle()}>
            {WORLD_ENTRY_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Nama">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Sekte Awan Ungu / Lembah Sunyi / Pedang Naga Merah" style={inputStyle()} />
        </Field>
        <Field label="Deskripsi">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} placeholder="Jelaskan detail, sejarah, atau aturan terkait entri ini…" style={{ ...inputStyle(), resize: "vertical" }} />
        </Field>
        <button onClick={handleSave} disabled={!name.trim()} style={{ width: "100%", padding: "13px 0", borderRadius: 10, border: "none", background: C.jade, color: "#08170f", fontWeight: 800, fontSize: 14, cursor: "pointer", opacity: name.trim() ? 1 : 0.6, marginBottom: 10 }}>
          Simpan Catatan
        </button>
        {entryId && (
          <button onClick={handleDelete} style={{ width: "100%", padding: "11px 0", borderRadius: 10, border: `1.5px solid ${C.danger}`, background: "transparent", color: C.danger, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            Hapus Catatan Ini
          </button>
        )}
      </div>
    </div>
  );
}

function CharacterEditorScreen({ novelId, characterId, ctx, onBack }) {
  const { showToast } = ctx;
  const [novel, setNovel] = useState(null);
  const [name, setName] = useState("");
  const [sect, setSect] = useState("");
  const [root, setRoot] = useState("");
  const [weapon, setWeapon] = useState("");
  const [realmId, setRealmId] = useState("");
  const [stageId, setStageId] = useState("");

  useEffect(() => {
    (async () => {
      const n = await gJSON(`novel:${novelId}`, true, null);
      setNovel(n);
      if (characterId && n) {
        const c = (n.characters || []).find((x) => x.id === characterId);
        if (c) {
          setName(c.name);
          setSect(c.sect || "");
          setRoot(c.spiritualRoot || "");
          setWeapon(c.weapon || "");
          setRealmId(c.realmId || "");
          setStageId(c.stageId || "");
        }
      }
    })();
  }, [novelId, characterId]);

  if (!novel) return <TopBar title="Memuat…" onBack={onBack} />;

  const allRealms = [];
  for (const fw of novel.frameworks || []) for (const r of fw.realms || []) allRealms.push({ ...r, frameworkName: fw.typeName });
  const stagesForRealm = allRealms.find((r) => r.id === realmId)?.stages || [];

  async function handleSave() {
    if (!name.trim()) return;
    const chars = [...(novel.characters || [])];
    if (characterId) {
      const i = chars.findIndex((c) => c.id === characterId);
      chars[i] = { ...chars[i], name, sect, spiritualRoot: root, weapon, realmId, stageId };
    } else {
      chars.push({ id: uid("char"), name, sect, spiritualRoot: root, weapon, realmId, stageId });
    }
    const next = { ...novel, characters: chars };
    await ctx.saveNovel(next);
    showToast("Karakter tersimpan.");
    onBack();
  }

  return (
    <div>
      <TopBar title={characterId ? "Sunting Karakter" : "Karakter Baru"} onBack={onBack} />
      <div style={{ padding: 18 }}>
        <Field label="Nama Karakter">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Lin Feng" style={inputStyle()} />
        </Field>
        <Field label="Afiliasi Sekte">
          <input value={sect} onChange={(e) => setSect(e.target.value)} placeholder="Contoh: Sekte Awan Ungu" style={inputStyle()} />
        </Field>
        <Field label="Akar Spiritual">
          <input value={root} onChange={(e) => setRoot(e.target.value)} placeholder="Contoh: Akar Petir Sembilan Langit" style={inputStyle()} />
        </Field>
        <Field label="Senjata Andalan">
          <input value={weapon} onChange={(e) => setWeapon(e.target.value)} placeholder="Contoh: Pedang Naga Merah" style={inputStyle()} />
        </Field>
        <Field label="Tingkat Kultivasi Saat Ini">
          <select
            value={realmId}
            onChange={(e) => {
              setRealmId(e.target.value);
              setStageId("");
            }}
            style={inputStyle()}
          >
            <option value="">— Pilih Realm —</option>
            {allRealms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.frameworkName}: {r.realmName}
              </option>
            ))}
          </select>
        </Field>
        {realmId && (
          <Field label="Sub-Tahap">
            <select value={stageId} onChange={(e) => setStageId(e.target.value)} style={inputStyle()}>
              <option value="">— Pilih Tahap —</option>
              {stagesForRealm.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.stageName}
                </option>
              ))}
            </select>
          </Field>
        )}
        <button onClick={handleSave} disabled={!name.trim()} style={{ width: "100%", padding: "13px 0", borderRadius: 10, border: "none", background: C.jade, color: "#08170f", fontWeight: 800, fontSize: 14, cursor: "pointer", opacity: name.trim() ? 1 : 0.6 }}>
          Simpan Karakter
        </button>
      </div>
    </div>
  );
}

function PowerSystemScreen({ novelId, ctx, onBack, embedded, onChange }) {
  const [novel, setNovel] = useState(null);
  const [newFwName, setNewFwName] = useState("");
  const [newRealmName, setNewRealmName] = useState({});
  const [newStageName, setNewStageName] = useState({});

  async function reload() {
    const n = await gJSON(`novel:${novelId}`, true, null);
    setNovel(n);
  }
  useEffect(() => {
    reload();
  }, [novelId]);

  async function persist(next) {
    await ctx.saveNovel(next);
    setNovel(next);
    if (onChange) onChange();
  }

  async function addFramework() {
    if (!newFwName.trim()) return;
    const fw = { id: uid("fw"), typeName: newFwName.trim(), realms: [] };
    await persist({ ...novel, frameworks: [...(novel.frameworks || []), fw] });
    setNewFwName("");
  }
  async function addRealm(fwId) {
    const name = (newRealmName[fwId] || "").trim();
    if (!name) return;
    const fws = novel.frameworks.map((fw) => {
      if (fw.id !== fwId) return fw;
      const realm = { id: uid("realm"), realmName: name, levelOrder: (fw.realms || []).length + 1, stages: [] };
      return { ...fw, realms: [...(fw.realms || []), realm] };
    });
    await persist({ ...novel, frameworks: fws });
    setNewRealmName({ ...newRealmName, [fwId]: "" });
  }
  async function addStage(fwId, realmId) {
    const key = `${fwId}:${realmId}`;
    const name = (newStageName[key] || "").trim();
    if (!name) return;
    const fws = novel.frameworks.map((fw) => {
      if (fw.id !== fwId) return fw;
      const realms = fw.realms.map((r) => {
        if (r.id !== realmId) return r;
        const stage = { id: uid("stage"), stageName: name, order: (r.stages || []).length + 1 };
        return { ...r, stages: [...(r.stages || []), stage] };
      });
      return { ...fw, realms };
    });
    await persist({ ...novel, frameworks: fws });
    setNewStageName({ ...newStageName, [key]: "" });
  }

  if (!novel) return embedded ? null : <TopBar title="Memuat…" onBack={onBack} />;

  const body = (
    <div style={{ padding: 18 }}>
      <div style={{ fontSize: 12, color: C.textSoft, marginBottom: 16, lineHeight: 1.6 }}>
        Petakan hierarki kekuatan berlapis. Satu kitab boleh punya lebih dari satu sistem (misal Kultivasi Qi & Kultivasi Jiwa berjalan berdampingan).
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input value={newFwName} onChange={(e) => setNewFwName(e.target.value)} placeholder="Nama sistem baru, mis. Kultivasi Qi" style={{ ...inputStyle(), flex: 1 }} />
        <button onClick={addFramework} style={{ padding: "0 16px", borderRadius: 10, border: "none", background: C.jade, color: "#08170f", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>
          + Sistem
        </button>
      </div>

      {(novel.frameworks || []).map((fw) => (
        <div key={fw.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 14 }}>
          <div style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 800, fontSize: 15, color: C.gold, marginBottom: 10 }}>{fw.typeName}</div>

          {(fw.realms || [])
            .slice()
            .sort((a, b) => a.levelOrder - b.levelOrder)
            .map((realm) => (
              <div key={realm.id} style={{ marginBottom: 12, paddingLeft: 10, borderLeft: `2px solid ${C.jadeDeep}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: C.textFaint }}>Lv.{realm.levelOrder}</span>
                  <span style={{ fontWeight: 700, fontSize: 13.5 }}>{realm.realmName}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6, marginBottom: 8 }}>
                  {(realm.stages || []).map((s) => (
                    <span key={s.id} style={{ fontSize: 10.5, background: C.surfaceHi, borderRadius: 999, padding: "3px 10px", color: C.textSoft }}>
                      {s.stageName}
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <input
                    value={newStageName[`${fw.id}:${realm.id}`] || ""}
                    onChange={(e) => setNewStageName({ ...newStageName, [`${fw.id}:${realm.id}`]: e.target.value })}
                    placeholder="Tambah sub-tahap, mis. Puncak"
                    style={{ ...inputStyle(), flex: 1, padding: "7px 10px", fontSize: 12 }}
                  />
                  <button onClick={() => addStage(fw.id, realm.id)} style={{ padding: "0 12px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.text, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    +
                  </button>
                </div>
              </div>
            ))}

          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            <input value={newRealmName[fw.id] || ""} onChange={(e) => setNewRealmName({ ...newRealmName, [fw.id]: e.target.value })} placeholder="Tambah realm baru, mis. Dewa Bintang" style={{ ...inputStyle(), flex: 1, fontSize: 12.5 }} />
            <button onClick={() => addRealm(fw.id)} style={{ padding: "0 14px", borderRadius: 8, border: "none", background: C.jadeDeep, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              + Realm
            </button>
          </div>
        </div>
      ))}
      {(novel.frameworks || []).length === 0 && <div style={{ fontSize: 12.5, color: C.textFaint, textAlign: "center", padding: "16px 0" }}>Belum ada sistem tingkatan. Buat satu di atas.</div>}
    </div>
  );

  return embedded ? (
    body
  ) : (
    <div>
      <TopBar title="Sistem Tingkatan" onBack={onBack} />
      {body}
    </div>
  );
}

function DistributionScreen({ novelId, ctx, onBack, embedded }) {
  const { username } = ctx;
  const [earn, setEarn] = useState({ total: 0, ledger: [] });
  const [novel, setNovel] = useState(null);

  useEffect(() => {
    (async () => {
      const n = await gJSON(`novel:${novelId}`, true, null);
      setNovel(n);
      const e = await gJSON(`earnings:${username}`, true, { total: 0, ledger: [] });
      setEarn(e);
    })();
  }, [novelId, username]);

  const relevant = novel ? earn.ledger.filter((l) => l.novel === novel.title) : earn.ledger;

  const days = Array.from({ length: 7 }).map((_, i) => {
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);
    dayStart.setDate(dayStart.getDate() - (6 - i));
    const dayEnd = dayStart.getTime() + 86400000;
    const total = relevant.filter((l) => l.ts >= dayStart.getTime() && l.ts < dayEnd).reduce((s, l) => s + l.amount, 0);
    return { label: dayStart.toLocaleDateString("id-ID", { weekday: "short" }), total };
  });
  const maxDay = Math.max(1, ...days.map((d) => d.total));

  const body = (
    <div style={{ padding: 18 }}>
      <div style={{ background: `linear-gradient(135deg, ${C.jadeDeep}, #07331f)`, borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 10.5, letterSpacing: 1.5, color: "#bcead6", textTransform: "uppercase" }}>Total Pendapatan (Kitab Ini)</div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 28, fontWeight: 700, color: "#fff", marginTop: 4 }}>{fmt(relevant.reduce((s, l) => s + l.amount, 0))} 💎</div>
      </div>

      <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>Pendapatan 7 Hari Terakhir</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 110, marginBottom: 22, padding: "0 4px" }}>
        {days.map((d, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: "100%", height: Math.max(4, (d.total / maxDay) * 80), background: `linear-gradient(180deg, ${C.gold}, ${C.goldDeep})`, borderRadius: "4px 4px 0 0" }} />
            <div style={{ fontSize: 9, color: C.textFaint }}>{d.label}</div>
          </div>
        ))}
      </div>

      <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>Riwayat Paywall & Donasi</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {relevant.slice(0, 20).map((e, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px" }}>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600 }}>{e.type === "tip" ? "🗡 Persembahan Pusaka" : `🔒 ${e.chapter}`}</div>
              <div style={{ fontSize: 10.5, color: C.textFaint }}>
                dari {e.reader} · {timeAgo(e.ts)}
              </div>
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, color: C.jade }}>+{e.amount}</div>
          </div>
        ))}
        {relevant.length === 0 && <div style={{ fontSize: 12.5, color: C.textFaint, textAlign: "center", padding: "20px 0" }}>Belum ada pendapatan untuk kitab ini.</div>}
      </div>
    </div>
  );

  return embedded ? (
    body
  ) : (
    <div>
      <TopBar title="Distribusi" onBack={onBack} />
      {body}
    </div>
  );
}

/* ================================================================
   CHAPTER EDITOR — distraction-free + glossary sidebar + blueprints
================================================================ */
function ChapterEditorScreen({ novelId, chapterId, ctx, onBack }) {
  const { addChapter, updateChapter, showToast } = ctx;
  const [novel, setNovel] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [coinPrice, setCoinPrice] = useState(15);
  const [blueprint, setBlueprint] = useState("kosong");
  const [status, setStatus] = useState("published");
  const [existing, setExisting] = useState(null);
  const [showGlossary, setShowGlossary] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const n = await gJSON(`novel:${novelId}`, true, null);
      setNovel(n);
      if (chapterId) {
        const c = await gJSON(`chapter:${novelId}:${chapterId}`, true, null);
        if (c) {
          setExisting(c);
          setTitle(c.title);
          setContent(c.content);
          setIsPremium(c.isPremium);
          setCoinPrice(c.coinPrice || 15);
          setBlueprint(c.blueprintType || "kosong");
          setStatus(c.status === "draft" ? "draft" : "published");
        }
      }
    })();
  }, [novelId, chapterId]);

  function applyBlueprint(id) {
    setBlueprint(id);
    if (!existing) {
      const bp = BLUEPRINTS.find((b) => b.id === id);
      if (bp && bp.skeleton) setContent((prev) => (prev.trim() ? prev : bp.skeleton));
    }
  }

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  async function handlePublish(saveStatus) {
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    if (existing) {
      await updateChapter({ ...existing, title, content, isPremium, coinPrice: isPremium ? coinPrice : 0, blueprintType: blueprint, status: saveStatus });
    } else {
      await addChapter(novelId, { title, content, isPremium, coinPrice, blueprintType: blueprint, status: saveStatus });
    }
    setSaving(false);
    showToast(saveStatus === "draft" ? "Bab tersimpan sebagai draft." : "Bab tersimpan & terbit!");
    onBack();
  }

  if (!novel) return <TopBar title="Memuat…" onBack={onBack} />;

  return (
    <div>
      <TopBar
        title={existing ? "Sunting Bab" : "Bab Baru"}
        onBack={onBack}
        right={
          <button onClick={() => setShowGlossary((s) => !s)} style={{ border: `1px solid ${C.border}`, background: "transparent", color: C.textSoft, borderRadius: 8, padding: "5px 10px", fontSize: 11, cursor: "pointer" }}>
            {showGlossary ? "Sembunyikan Glosarium" : "Tampilkan Glosarium"}
          </button>
        }
      />
      <div style={{ padding: 18 }}>
        {!existing && (
          <Field label="Cetak Biru Bab">
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
              {BLUEPRINTS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => applyBlueprint(b.id)}
                  style={{ whiteSpace: "nowrap", padding: "7px 12px", borderRadius: 999, border: `1.5px solid ${blueprint === b.id ? C.jade : C.border}`, background: blueprint === b.id ? C.jadeGlow : "transparent", color: blueprint === b.id ? C.jade : C.textSoft, fontSize: 11.5, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </Field>
        )}

        <Field label="Judul Bab">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Pertarungan di Lembah Sunyi" style={inputStyle()} />
        </Field>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Field label={`Isi Bab · ${wordCount} kata`}>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Tulis ceritamu di sini…" rows={16} style={{ ...inputStyle(), resize: "vertical", lineHeight: 1.7, fontSize: 13.5 }} />
            </Field>
          </div>
          {showGlossary && (
            <div style={{ width: 130, flexShrink: 0 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: C.textSoft, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Glosarium</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: 300, overflowY: "auto" }}>
                {(novel.characters || []).map((c) => (
                  <div key={c.id} style={{ fontSize: 10.5, background: C.surfaceRaised, borderRadius: 6, padding: "5px 7px", color: C.jade, fontWeight: 600 }}>
                    {c.name}
                  </div>
                ))}
                {(novel.characters || []).length === 0 && <div style={{ fontSize: 10, color: C.textFaint }}>Belum ada karakter. Tambahkan di World-Building.</div>}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 14, marginTop: 4 }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700 }}>Bab Premium (Segel Formasi)</div>
            <div style={{ fontSize: 11, color: C.textFaint }}>Pembaca perlu Batu Spiritual atau tier untuk membuka</div>
          </div>
          <Toggle checked={isPremium} onChange={setIsPremium} />
        </div>

        {isPremium && (
          <Field label="Harga (Batu Spiritual)">
            <input type="number" min={5} value={coinPrice} onChange={(e) => setCoinPrice(Math.max(5, Number(e.target.value) || 0))} style={inputStyle()} />
          </Field>
        )}

        <div style={{ fontSize: 11, color: C.textFaint, background: C.surfaceRaised, borderRadius: 10, padding: "10px 12px", marginBottom: 16, lineHeight: 1.5 }}>
          Kamu menerima <b style={{ color: C.gold }}>70%</b> dari setiap Batu Spiritual pembuka bab premium ini.
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => handlePublish("draft")}
            disabled={saving || !title.trim() || !content.trim()}
            style={{ flex: 1, padding: "13px 0", borderRadius: 10, border: `1.5px solid ${C.gold}`, background: "transparent", color: C.gold, fontWeight: 700, fontSize: 13, cursor: "pointer", opacity: title.trim() && content.trim() ? 1 : 0.6 }}
          >
            Simpan Draft
          </button>
          <button
            onClick={() => handlePublish("published")}
            disabled={saving || !title.trim() || !content.trim()}
            style={{ flex: 1, padding: "13px 0", borderRadius: 10, border: "none", background: C.jade, color: "#08170f", fontWeight: 800, fontSize: 13, cursor: "pointer", opacity: title.trim() && content.trim() ? 1 : 0.6 }}
          >
            {existing && status === "published" ? "Simpan & Terbitkan" : "Terbitkan Bab"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <div onClick={() => onChange(!checked)} style={{ width: 44, height: 26, borderRadius: 999, background: checked ? C.jade : C.surfaceHi, position: "relative", cursor: "pointer", flexShrink: 0 }}>
      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: checked ? 21 : 3, transition: "left .15s" }} />
    </div>
  );
}

/* ================================================================
   MOUNT
================================================================ */
const rootEl = document.getElementById("root");
const root = ReactDOM.createRoot(rootEl);
root.render(<App />);
