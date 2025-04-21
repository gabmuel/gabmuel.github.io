// read uploaded .txt into textarea
document.getElementById('fileInput').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById('namesInput').value = reader.result.trim();
  };
  reader.readAsText(file);
});

function generateGroups() {
  const names = document.getElementById('namesInput').value
    .trim().split('\n').filter(n => n);
  const n = parseInt(document.getElementById('groupInput').value, 10);
  const mode = document.querySelector('input[name="mode"]:checked').value;
  const out = document.getElementById('output');

  if (!names.length || !n || n <= 0) {
    out.innerText = 'Enter valid names and a number.';
    return;
  }

  // shuffle
  const shuffled = names.sort(() => Math.random() - 0.5);
  let groups = [];

  if (mode === 'size') {
    const k = Math.floor(shuffled.length / n) || 1;
    groups = Array.from({ length: k }, () => []);
    shuffled.forEach((name, i) => {
      groups[i % k].push(name);
    });
  } else {
    groups = Array.from({ length: n }, () => []);
    shuffled.forEach((name, i) => {
      groups[i % n].push(name);
    });
  }

  // display groups
  out.innerHTML = groups
    .map((g, i) => `<p><strong>Group ${i + 1}:</strong> ${g.join(', ')}</p>`)
    .join('');

  // create opaque (base64) link with original names
  const encoded = btoa(JSON.stringify(names));
  const url = `${location.origin + location.pathname}?data=${encodeURIComponent(encoded)}`;
  out.insertAdjacentHTML(
    'beforeend',
    `<p><a href="${url}" target="_blank">Save names (opaque link)</a></p>`
  );
}