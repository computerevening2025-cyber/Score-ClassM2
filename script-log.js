const FIREBASE_URL = "https://point-classm2-default-rtdb.firebaseio.com/";

async function loginSystem(e) {
    if (e) e.preventDefault();

    // ดึง Element ช่องกรอกข้อมูล
    const userEl = document.getElementById("userInput");
    const passEl = document.getElementById("passInput");

    const userInput = userEl.value.trim();
    const passInput = passEl.value.trim();

    if (!userInput || !passInput) {
        return Swal.fire({
            icon: 'warning',
            title: 'แจ้งเตือน!',
            text: 'กรุณากรอกชื่อผู้ใช้ และ ระหัสผ่าน!',
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
                title: 'แจ้งเตือน!',
                text: 'ยังไม่ได้ตั้งค่า Admin ใน Firebase!',
                confirmButtonColor: '#1a73e8'
            });
        }

        // ตรวจสอบทั้ง Username และ Password ให้ตรงกับ Firebase
        if (userInput === adminData.username && passInput === adminData.password) {
            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ!',
                text: 'เข้าสู่ระบบสำเร็จ!',
                confirmButtonColor: '#28a745'
            }).then(() => {
                sessionStorage.setItem("isAdminLoggedIn", "true");
                window.location.href = "point_std.html";
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'ผิดพลาด',
                text: 'ชื่อผู้ใช้ หรือ ระหัสผ่านไม่ถูกต้อง!',
                confirmButtonColor: '#dc3545'
            });
        }

    } catch (err) {
        console.error("Login Error:", err);
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อ!");
    }
}
