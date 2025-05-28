import {
  collection, addDoc, getDocs, query, orderBy,
  doc, getDoc, updateDoc, deleteDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

function calculateAverage(atBats, hits) {
  if (atBats === 0) return "-";
  const avg = (hits / atBats).toFixed(3);
  return avg.substring(1);
}

document.getElementById("recordForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const editId = document.getElementById("editId").value;

  const data = {
    name: document.getElementById("playerName").value,
    position: document.getElementById("positionType").value,
    atBats: Number(document.getElementById("atBats").value),
    hits: Number(document.getElementById("hits").value),
    doubleHits: Number(document.getElementById("doubleHits").value),
    tripleHits: Number(document.getElementById("tripleHits").value),
    homeRuns: Number(document.getElementById("homeRuns").value),
    steals: Number(document.getElementById("steals").value),
    walks: Number(document.getElementById("walks").value),
    date: new Date().toISOString()
  };

  if (editId) {
    await updateDoc(doc(window.db, "batters", editId), data);
    alert("기록이 수정되었습니다.");
  } else {
    await addDoc(collection(window.db, "batters"), data);
    alert("기록 저장 완료!");
  }

  document.getElementById("recordForm").reset();
  document.getElementById("editId").value = "";
  loadRecords();
});

async function loadRecords() {
  const tbody = document.querySelector("#recordTable tbody");
  tbody.innerHTML = "";
  const q = query(collection(window.db, "batters"), orderBy("date", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach(docSnap => {
    const d = docSnap.data();
    const id = docSnap.id;
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
      <td>
        <button onclick="editRecord('${id}')">수정</button>
        <button onclick="deleteRecord('${id}')">삭제</button>
      </td>
    </tr>`;
  });
}

window.editRecord = async function (id) {
  const ref = doc(window.db, "batters", id);
  const snap = await getDoc(ref);
  const d = snap.data();

  document.getElementById("editId").value = id;
  document.getElementById("playerName").value = d.name;
  document.getElementById("positionType").value = d.position || "";
  document.getElementById("atBats").value = d.atBats;
  document.getElementById("hits").value = d.hits;
  document.getElementById("doubleHits").value = d.doubleHits;
  document.getElementById("tripleHits").value = d.tripleHits;
  document.getElementById("homeRuns").value = d.homeRuns;
  document.getElementById("steals").value = d.steals;
  document.getElementById("walks").value = d.walks;
};

window.deleteRecord = async function (id) {
  if (confirm("정말 삭제하시겠습니까?")) {
    await deleteDoc(doc(window.db, "batters", id));
    alert("삭제되었습니다.");
    loadRecords();
  }
};

window.addEventListener("load", loadRecords);
