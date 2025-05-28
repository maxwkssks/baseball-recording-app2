// script.js
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const form = document.getElementById("recordForm");
const tableBody = document.querySelector("#recordTable tbody");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("editId").value;
  const name = document.getElementById("playerName").value;
  const position = document.getElementById("position").value;
  const atBats = Number(document.getElementById("atBats").value);
  const hits = Number(document.getElementById("hits").value);
  const homeRuns = Number(document.getElementById("homeRuns").value);

  try {
    if (id) {
      await updateDoc(doc(window.db, "records", id), {
        name, position, atBats, hits, homeRuns
      });
      alert("수정 완료!");
    } else {
      await addDoc(collection(window.db, "records"), {
        name, position, atBats, hits, homeRuns, date: new Date().toISOString()
      });
      alert("기록 저장 완료!");
    }
    form.reset();
    loadRecords();
  } catch (err) {
    console.error("오류 발생", err);
    alert("처리 실패");
  }
});

function formatAverage(atBats, hits) {
  if (atBats === 0) return "-";
  const avg = (hits / atBats).toFixed(3);
  return avg.substring(1); // ".345" → "345"
}

async function loadRecords() {
  tableBody.innerHTML = "";
  const q = query(collection(window.db, "records"), orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((docItem) => {
    const data = docItem.data();
    const avg = formatAverage(data.atBats, data.hits);
    const date = new Date(data.date).toLocaleString();
    const row = `<tr>
      <td>${data.name}</td>
      <td>${data.position}</td>
      <td>${data.atBats}</td>
      <td>${data.hits}</td>
      <td>${data.homeRuns}</td>
      <td>${avg}</td>
      <td>${date}</td>
      <td><button onclick="editRecord('${docItem.id}', ${data.atBats}, ${data.hits}, ${data.homeRuns}, '${data.name}', '${data.position}')">수정</button></td>
      <td><button onclick="deleteRecord('${docItem.id}')">삭제</button></td>
    </tr>`;
    tableBody.innerHTML += row;
  });
}

window.editRecord = function (id, atBats, hits, homeRuns, name, position) {
  document.getElementById("editId").value = id;
  document.getElementById("playerName").value = name;
  document.getElementById("position").value = position;
  document.getElementById("atBats").value = atBats;
  document.getElementById("hits").value = hits;
  document.getElementById("homeRuns").value = homeRuns;
}

window.deleteRecord = async function (id) {
  if (!confirm("정말 삭제하시겠습니까?")) return;
  await deleteDoc(doc(window.db, "records", id));
  loadRecords();
};

document.getElementById("exportBtn").addEventListener("click", () => {
  const table = document.getElementById("recordTable");
  const html = table.outerHTML;
  const url = 'data:application/vnd.ms-excel,' + encodeURIComponent(html);
  const link = document.createElement("a");
  link.href = url;
  link.download = "baseball_records.xls";
  link.click();
});

window.addEventListener("load", loadRecords);
