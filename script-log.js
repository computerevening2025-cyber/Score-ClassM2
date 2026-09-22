const FIREBASE_URL = "https://point-classm2-default-rtdb.firebaseio.com/";

async function loginSystem(e) {
    if (e) e.preventDefault();

    // ดึง Element ช่องกรอกข้อมูล
    const userEl = document.getElementById("userInput");
    const passEl = document.getElementById("passInput");

    // if (!userEl || !passEl) {
    //     return alert("ไม่พบช่องกรอก username หรือ password ใน HTML! (เช็ก id ใน HTML)");
    // }

    const userInput = userEl.value.trim();
    const passInput = passEl.value.trim();

    if (!userInput || !passInput) {
        return Swal.fire({
            icon: 'warning',
            title: 'ແຈ້ງເຕືອນ!',
            text: 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ ແລະ ລະຫັດຜ່ານ!',
            confirmButtonColor: '#1a73e8'
        });
    }

    try {
        const cleanBaseUrl = FIREBASE_URL.replace(/\/+$/, "");
        const res = await fetch(`${cleanBaseUrl}/user/Admin.json`);
        const adminData = await res.json();

        if (!adminData) {
            return Swal.fire({
            icon: 'warning',
            title: 'ແຈ້ງເຕືອນ!',
            text: 'ກຍັງບໍ່ທັນຕັ້ງຄ່າ Admin ໃນ Firebase!',
            confirmButtonColor: '#1a73e8'
            });
        }

        // ตรวจสอบทั้ง Username และ Password ให้ตรงกับ Firebase
        if (userInput === adminData.username && passInput === adminData.password) {
            Swal.fire({
                icon: 'success',
                title: 'ສຳເລັດ!',
                text: 'ເຂົ້າสู่ລະບົບສຳເລັດ!',
                confirmButtonColor: '#28a745'
            }).then(() => {
                sessionStorage.setItem("isAdminLoggedIn", "true");
                window.location.href = "point_std.html";
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'ຜິດພາດ',
                text: 'ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ!',
                confirmButtonColor: '#dc3545'
            });
        }

    } catch (err) {
        console.error("Login Error:", err);
        alert("ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່!");
    }

}
