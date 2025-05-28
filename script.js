// script.js
import {
  collection, addDoc, getDocs, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

function calculateAverage(atBats, hits) {
  if (atBats === 0) return "-";
  const avg = (hits / atBats).toFixed(3);
  return avg.substring(1);
}

document.getElementById("recordForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById("playerName").value,
    atBats: Number(document.getElementById("atBats").value),
    hits: Number(document.getElementById("hits").value),
    doubleHits: Number(document.getElementById("doubleHits").value),
    tripleHits: Number(document.getElementById("tripleHits").value),
    homeRuns: Number(document.getElementById("homeRuns").value),
    steals: Number(document.getElementById("steals").value),
    walks: Number(document.getElementById("walks").value),
    date: new Date().toISOString()
  };

  await addDoc(collection(window.db, "batters"), data);
  alert("기록 저장 완료!");
  document.getElementById("recordForm").reset();
  loadRecords();
});

async function loadRecords() {
  const tbody = document.querySelector("#recordTable tbody");
  tbody.innerHTML = "";
  const q = query(collection(window.db, "batters"), orderBy("date", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach(doc => {
    const d = doc.data();
    const date = new Date(d.date).toLocaleString();
    const avg = calculateAverage(d.atBats, d.hits);
    tbody.innerHTML += `<tr>
      <td>${d.name}</td>
      <td>${d.atBats}</td>
      <td>${d.hits}</td>
      <td>${d.doubleHits}</td>
      <td>${d.tripleHits}</td>
      <td>${d.homeRuns}</td>
      <td>${d.steals}</td>
      <td>${d.walks}</td>
      <td>.${avg}</td>
      <td>${date}</td>
    </tr>`;
  });
}

window.addEventListener("load", loadRecords);
