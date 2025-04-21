const ROWS = 10;
const COLS = 10;
const gridEl = document.getElementById('grid');
const namesInput = document.getElementById('namesInput');
const fileInput = document.getElementById('fileInput');
const generateBtn = document.getElementById('generateBtn');
const resetBtn = document.getElementById('resetBtn');
const saveContainer = document.getElementById('saveLinkContainer');

function buildGrid() {
  gridEl.innerHTML = '';
  for (let i = 0; i < ROWS * COLS; i++) {
    const seat = document.createElement('div');
    seat.classList.add('seat', 'inactive');
    seat.addEventListener('click', () => {
      const isActive = seat.classList.toggle('active');
      seat.classList.toggle('inactive', !isActive);
      if (!isActive) seat.textContent = '';
    });
    gridEl.appendChild(seat);
  }
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// on load: build grid then decode `data` param into namesInput & seat states
window.addEventListener('DOMContentLoaded', () => {
  buildGrid();

  const params = new URLSearchParams(location.search);
  const data = params.get('data');
  if (data) {
    try {
      const obj = JSON.parse(atob(decodeURIComponent(data)));
      // restore names list
      if (Array.isArray(obj.names)) {
        namesInput.value = obj.names.join('\n');
      }
      // restore seat activation
      if (Array.isArray(obj.seats)) {
        const seatsEls = Array.from(document.querySelectorAll('.seat'));
        obj.seats.forEach((active, idx) => {
          if (active) {
            seatsEls[idx].classList.add('active');
            seatsEls[idx].classList.remove('inactive');
          }
        });
      }
    } catch (e) {
      console.error('Failed to parse save data:', e);
    }
  }
});

// file upload
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    namesInput.value = e.target.result;
  };
  reader.readAsText(file);
});

// generate seating
generateBtn.addEventListener('click', () => {
  const names = namesInput.value
    .split(/\r?\n/)
    .map(n => n.trim())
    .filter(n => n);
  const seatEls = Array.from(document.querySelectorAll('.seat'));
  const activeSeats = seatEls.filter(s => s.classList.contains('active'));

  if (names.length > activeSeats.length) {
    alert('More names than active seats.');
    return;
  }

  shuffle(names);
  activeSeats.forEach((seat, i) => {
    seat.textContent = names[i] || '';
  });

  // save both names list and seat states
  const seatsState = seatEls.map(s => s.classList.contains('active'));
  const payload = { names, seats: seatsState };
  const encoded = btoa(JSON.stringify(payload));
  const url = `${location.origin + location.pathname}?data=${encodeURIComponent(encoded)}`;
  saveContainer.innerHTML = `<p><a href="${url}" target="_blank">Save layout & names (link)</a></p>`;
});

// reset
resetBtn.addEventListener('click', () => {
  document.querySelectorAll('.seat').forEach(seat => {
    seat.classList.remove('active');
    seat.classList.add('inactive');
    seat.textContent = '';
  });
  namesInput.value = '';
  fileInput.value = '';
  saveContainer.innerHTML = '';
});