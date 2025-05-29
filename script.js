import {
  collection, addDoc, getDocs, query, orderBy,
  doc, getDoc, updateDoc, deleteDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

function calculateAverage(atBats, hits) {
  if (atBats === 0) return "-";
  const avg = (hits / atBats).toFixed(3);
  return avg.substring(1);
}

function calculateERA(runsAllowed, innings) {
  if (!innings || innings === 0) return "-";
  return (runsAllowed * 9 / innings).toFixed(2);
}

document.getElementById("recordForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const editId = document.getElementById("editId").value;
  const position = document.getElementById("positionType").value;

  let data = {
    name: document.getElementById("playerName").value,
    position,
    date: new Date().toISOString()
  };

  if (position === "투수") {
    const innings = Number(document.getElementById("innings").value);
    const runsAllowed = Number(document.getElementById("runsAllowed").value);
    const era = calculateERA(runsAllowed, innings);

    data = {
      ...data,
      innings,
      strikeouts: Number(document.getElementById("strikeouts").value),
      pitcherWalks: Number(document.getElementById("pitcherWalks").value),
      hitsAllowed: Number(document.getElementById("hitsAllowed").value),
      homeRunsAllowed: Number(document.getElementById("homeRunsAllowed").value),
      runsAllowed,
      era
    };
  } else {
    data = {
      ...data,
      atBats: Number(document.getElementById("atBats").value),
      hits: Number(document.getElementById("hits").value),
      doubleHits: Number(document.getElementById("doubleHits").value),
      tripleHits: Number(document.getElementById("tripleHits").value),
      homeRuns: Number(document.getElementById("homeRuns").value),
      steals: Number(document.getElementById("steals").value),
      walks: Number(document.getElementById("walks").value),
      rbi: Number(document.getElementById("rbi").value),
      runs: Number(document.getElementById("runs").value)
    };
  }

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
    const avg = calculateAverage(d.atBats ?? 0, d.hits ?? 0);

    if (d.position === "투수") {
      tbody.innerHTML += `<tr>
        <td>${d.name}</td><td>${d.position}</td>
        <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>
        <td>${d.innings}</td><td>${d.strikeouts}</td><td>${d.pitcherWalks}</td><td>${d.hitsAllowed}</td><td>${d.homeRunsAllowed}</td>
        <td>${d.runsAllowed}</td><td>${d.era}</td>
        <td>-</td><td>${date}</td>
        <td><button onclick="editRecord('${id}')">수정</button></td>
        <td><button onclick="deleteRecord('${id}')">삭제</button></td>
      </tr>`;
    } else {
      tbody.innerHTML += `<tr>
        <td>${d.name}</td><td>${d.position}</td>
        <td>${d.atBats}</td><td>${d.hits}</td><td>${d.doubleHits}</td><td>${d.tripleHits}</td><td>${d.homeRuns}</td>
        <td>${d.steals}</td><td>${d.walks}</td><td>${d.rbi ?? "-"}</td><td>${d.runs ?? "-"}</td>
        <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>
        <td>.${avg}</td><td>${date}</td>
        <td><button onclick="editRecord('${id}')">수정</button></td>
        <td><button onclick="deleteRecord('${id}')">삭제</button></td>
      </tr>`;
    }
  });
}

window.editRecord = async function (id) {
  const ref = doc(window.db, "batters", id);
  const snap = await getDoc(ref);
  const d = snap.data();

  document.getElementById("editId").value = id;
  document.getElementById("playerName").value = d.name;
  document.getElementById("positionType").value = d.position || "";

  if (d.position === "투수") {
    document.getElementById("innings").value = d.innings ?? "";
    document.getElementById("strikeouts").value = d.strikeouts ?? "";
    document.getElementById("pitcherWalks").value = d.pitcherWalks ?? "";
    document.getElementById("hitsAllowed").value = d.hitsAllowed ?? "";
    document.getElementById("homeRunsAllowed").value = d.homeRunsAllowed ?? "";
    document.getElementById("runsAllowed").value = d.runsAllowed ?? "";
  } else {
    document.getElementById("atBats").value = d.atBats ?? "";
    document.getElementById("hits").value = d.hits ?? "";
    document.getElementById("doubleHits").value = d.doubleHits ?? "";
    document.getElementById("tripleHits").value = d.tripleHits ?? "";
    document.getElementById("homeRuns").value = d.homeRuns ?? "";
    document.getElementById("steals").value = d.steals ?? "";
    document.getElementById("walks").value = d.walks ?? "";
    document.getElementById("rbi").value = d.rbi ?? "";
    document.getElementById("runs").value = d.runs ?? "";
  }

  toggleFields();
};

window.deleteRecord = async function (id) {
  if (confirm("정말 삭제하시겠습니까?")) {
    await deleteDoc(doc(window.db, "batters", id));
    alert("삭제되었습니다.");
    loadRecords();
  }
};

window.addEventListener("load", loadRecords);
