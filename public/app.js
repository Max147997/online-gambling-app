// Basis-URL für API (dynamisch, nicht nur localhost)
const API_URL = window.location.origin;

// einfache Fetch-Helferfunktion
async function api(path, method = 'GET', body) {
  const res = await fetch(API_URL + path, {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  return res.json();
}

// Elemente
const authOverlay  = document.getElementById('authOverlay');
const authTitle    = document.getElementById('authTitle');
const authUser     = document.getElementById('authUsername');
const authPass     = document.getElementById('authPassword');
const authSubmit   = document.getElementById('authSubmit');
const toggleLink   = document.getElementById('toggleLink');
const authMsg      = document.getElementById('authMsg');

const topbar       = document.getElementById('topbar');
const sidebar      = document.getElementById('sidebar');
const mainContent  = document.getElementById('mainContent');
const coinsSpan    = document.getElementById('coins');

let isLogin = true;    // toggle zwischen Login/Signup
let balance = 0;

// Umschaltung Login ↔ Signup
toggleLink.onclick = () => {
  isLogin = !isLogin;
  authTitle.textContent = isLogin ? 'Anmelden' : 'Registrieren';
  authSubmit.textContent = isLogin ? 'Anmelden' : 'Registrieren';
  toggleLink.textContent = isLogin ? 'Registrieren' : 'Anmelden';
  authMsg.textContent = '';
};

// Auth abschicken
authSubmit.onclick = async () => {
  authMsg.textContent = '';
  if (!authUser.value || !authPass.value) {
    authMsg.textContent = 'Bitte beide Felder ausfüllen';
    return;
  }
  const path = isLogin ? '/login' : '/signup';
  const result = await api(path, 'POST', {
    username: authUser.value,
    password: authPass.value
  });
  if (result.error) {
    authMsg.textContent = result.error;
  } else {
    balance = result.coins;
    startApp();
  }
};

// App starten nach erfolgreicher Auth
function startApp() {
  coinsSpan.textContent = balance;
  authOverlay.classList.add('hidden');
  topbar.classList.remove('hidden');
  sidebar.classList.remove('hidden');
  mainContent.classList.remove('hidden');
  loadSections();
}

// Beispiel-Daten mit FontAwesome-Icons
const categories = {
  originals: [
    { title:'Crash',     icon:'fa-solid fa-rocket' },
    { title:'Dice',      icon:'fa-solid fa-dice'   },
    { title:'Mines',     icon:'fa-solid fa-bomb'   },
    { title:'Plinko',    icon:'fa-solid fa-circle-dot' },
    { title:'Tower',     icon:'fa-solid fa-cubes'  },
    { title:'Coinflip',  icon:'fa-solid fa-coins'  }
  ],
  popular: [
    { title:'Sweet Bonanza', icon:'fa-solid fa-candy-cane' },
    { title:'Avia Masters',  icon:'fa-solid fa-plane'      },
    { title:'Brawl Pirates', icon:'fa-solid fa-skull'      },
    { title:'Tile Masters',  icon:'fa-solid fa-th-large'   },
    { title:'Penalty Shoot', icon:'fa-solid fa-futbol'     },
    { title:'B-Ball Blitz',  icon:'fa-solid fa-basketball' }
  ],
  slots: [
    { title:'Gates of Olympus', icon:'fa-solid fa-water' },
    { title:'Zeus vs Hades',    icon:'fa-solid fa-bolt'  },
    { title:'Sugar Rush',       icon:'fa-solid fa-apple-whole' }
  ]
};

// Sektionen befüllen
function loadSections() {
  Object.keys(categories).forEach(cat => {
    const row = document.getElementById(`row-${cat}`);
    categories[cat].forEach(g => {
      const card = document.createElement('div');
      card.className = 'game-card';
      card.innerHTML = `
        <i class="${g.icon} fa-4x"></i>
        <span>${g.title}</span>`;
      // Hier kann man onclick hinzufügen, z.B. Blackjack öffnen
      row.append(card);
    });
  });
}
