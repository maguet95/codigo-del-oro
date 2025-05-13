import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC1cwF90thUfoUkKfJm0tHXdf3-5CrFf0s",
  authDomain: "codigodeloro.firebaseapp.com",
  projectId: "codigodeloro",
  storageBucket: "codigodeloro.firebasestorage.app",
  messagingSenderId: "463504472808",
  appId: "1:463504472808:web:dbe1f530fe834f6337275d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const user = cred.user;

    // Verifica si es el superadmin por su correo
    const isSuperAdmin = user.email === 'enmajose95+admin@gmail.com';

    if (isSuperAdmin) {
      mostrarContenido(true); // superadmin tiene acceso completo
      return;
    }

    // Si no es superadmin, verifica su rol desde Firestore
    const userDoc = await getDoc(doc(db, "usuarios", user.uid));
    const isAdmin = userDoc.exists() && userDoc.data().rol === "admin";

    mostrarContenido(isAdmin);
  } catch (error) {
    alert('Error de inicio de sesión');
  }
});

function mostrarContenido(isAdmin) {
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('main-content').style.display = 'block';

  if (isAdmin) {
    document.getElementById('tradingview-admin').style.display = 'block';
  } else {
    document.getElementById('tradingview-admin').style.display = 'none';
  }
}

window.logout = () => signOut(auth);


onAuthStateChanged(auth, async user => {
  if (user) {
    const userDoc = await getDoc(doc(db, "usuarios", user.uid));
    const isAdmin = userDoc.exists() && userDoc.data().rol === "admin";

    document.getElementById('login-container').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';

    if (isAdmin) {
      document.getElementById('tradingview-admin').style.display = 'block';
    } else {
      document.getElementById('tradingview-admin').style.display = 'none';
    }

  } else {
    document.getElementById('login-container').style.display = 'flex';
    document.getElementById('main-content').style.display = 'none';
  }
});

window.logout = () => signOut(auth);

new TradingView.widget({
  autosize: true,
  symbol: "OANDA:XAUUSD",
  interval: "240",
  timezone: "Etc/UTC",
  theme: "dark",
  style: "1",
  locale: "es",
  withdateranges: true,
  hide_side_toolbar: false,
  allow_symbol_change: false,
  save_image: false,
  hide_volume: true,
  container_id: "tradingview_chart",
  support_host: "https://www.tradingview.com"
});


