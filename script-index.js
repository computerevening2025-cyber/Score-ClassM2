const FIREBASE_URL = "https://point-classm2-default-rtdb.firebaseio.com/";

async function searchStudentScores(e) {
    if (e) e.preventDefault();

    // ดึงค่าช่องเลือกเดือน
    const monthEl = document.getElementById('monthSelect') || document.getElementById('selectedMonth');
    
    // ดึงค่าช่องกรอกรหัส (เช็กทั้งสอง id)
    const codeEl = document.getElementById('studentCodeInput') || document.getElementById('studentId');

    if (!monthEl || !codeEl) {
        return alert("ไม่พบช่องเลือกเดือนหรือช่องกรอกรหัสใน HTML! (เช็ก id ใน HTML)");
    }

    const selectedMonth = monthEl.value;
    const stdCode = codeEl.value.trim();

    if (!selectedMonth) {
        return Swal.fire({
            icon: 'warning',
            title: 'ແຈ້ງເຕືອນ!',
            text: 'ກະລຸນາເລືອກເດືອນ!',
            confirmButtonColor: '#1a73e8'
        });
    }

    if (!stdCode) {
        return Swal.fire({
            icon: 'warning',
            title: 'ແຈ້ງເຕືອນ!',
            text: 'ກະລຸນາປ້ອນລະຫັດນັກຮຽນ!',
            confirmButtonColor: '#1a73e8'
        });
    }

    try {
        const cleanBaseUrl = FIREBASE_URL.replace(/\/+$/, "");
        const res = await fetch(`${cleanBaseUrl}/students.json`);
        if (!res.ok) throw new Error(`HTTP Error status:${res.status}`);

        const allStudents = await res.json() || {};
        const studentData = allStudents[stdCode];

        const scoreTableBody = document.getElementById('scoreTableBody');
        const studentInfo = document.getElementById('studentInfo');
        const resultCard = document.getElementById('resultCard');

        const totalScoreEl = document.getElementById('totalScoreVal');
        const avgScoreEl = document.getElementById('avgScoreVal');
        const rankEl = document.getElementById('rankVal');

        if (scoreTableBody) scoreTableBody.innerHTML = '';

        if (!studentData) {
            if (resultCard) resultCard.style.display = "none";
            return Swal.fire({
                icon: 'error',
                title: 'ບໍ່ພົບຂໍ້ມູນ!',
                text: `ບໍ່ພົບຂໍ້ມູນນັກຮຽນລະຫັດ ${stdCode}!`,
                confirmButtonColor: '#dc3545'
            });
        }

        const monthKey = `m_${selectedMonth}`;
        const monthScores = studentData.scores ? studentData.scores[monthKey] : null;

        if (!monthScores) {
            if (resultCard) resultCard.style.display = "none";
            return Swal.fire({
                icon: 'warning',
                title: 'ບໍ່ພົບຂໍ້ມູນ!',
                text: `ບໍ່ພົບຂໍ້ມູນຄະແນນໃນເດືອນ ${selectedMonth}!`,
                confirmButtonColor: '#e6a23c'
            });
        }

        if (resultCard) resultCard.style.display = "block";
        if (studentInfo) {
            const nicknameText = studentData.nickname ? ` (${studentData.nickname})` : '';
            studentInfo.innerHTML = `<strong>ຊື່:</strong> ${studentData.name}${nicknameText} | <strong>ລະຫັດ:</strong> ${stdCode}`;
        }

        let total = 0;
        let count = 0;

        for (const [subject, score] of Object.entries(monthScores)) {
            const numScore = parseFloat(score) || 0;
            total += numScore;
            count++;

            if (scoreTableBody) {
                scoreTableBody.innerHTML += `
                    <tr>
                        <td>${subject}</td>
                        <td>${numScore}</td>
                    </tr>
                `;
            }
        }

        const avg = count > 0 ? (total / count).toFixed(2) : "0.00";

        // คำนวณอันดับ
        let studentList = [];
        for (const [id, std] of Object.entries(allStudents)) {
            if (std.scores && std.scores[monthKey]) {
                let stdTotal = 0;
                for (const s of Object.values(std.scores[monthKey])) {
                    stdTotal += parseFloat(s) || 0;
                }
                studentList.push({ id: id, total: stdTotal });
            }
        }

        studentList.sort((a, b) => b.total - a.total);
        const rankIndex = studentList.findIndex(item => item.id === stdCode);
        const rank = rankIndex !== -1 ? rankIndex + 1 : '-';

        if (totalScoreEl) totalScoreEl.innerText = total.toFixed(1);
        if (avgScoreEl) avgScoreEl.innerText = avg;
        if (rankEl) rankEl.innerText = rank;

    } catch (err) {
        console.error("Search Error Details:", err);
        Swal.fire({
            icon: 'error',
            title: 'ຜິດພາດ!',
            text: 'ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່!',
            confirmButtonColor: '#dc3545'
        });
    }
}
