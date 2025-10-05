import { db, storage } from "../firebase.js";
import {
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

let studentsData = [];

export async function fetchStudents() {
  try {
    const snapshot = await getDocs(collection(db, "users"));
    studentsData = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((s) => s.role === "student");
    return studentsData;
  } catch (err) {
    console.error("Error loading students: ", err);
    return [];
  }
}

export function getStatusBadge(status) {
  switch (status) {
    case "Active": return "badge-success";
    case "Pending": return "badge-warning";
    case "Completed": return "badge-info";
    case "Dropped": return "badge-danger";
    default: return "";
  }
}

export async function generateStudentID(division, admissionDate) {
    const year = new Date(admissionDate).getFullYear();
    const prefix = division === "CAPT" ? "CAPT" : division === "LBS" ? "LBS" : "GA";
    const q = query(collection(db, "users"), where("division", "==", division));
    const sameDivision = await getDocs(q);
    let maxNum = 0;
    sameDivision.docs.forEach(s => {
      const match = (s.data().studentID || "").match(/\d+$/);
      if (match) maxNum = Math.max(maxNum, parseInt(match[0]));
    });
    const runningNum = (maxNum + 1).toString().padStart(4, "0");
    return `${prefix}-${year}-${runningNum}`;
}

export function buildStudentPayload(data, studentID, photoURL) {
    const payload = {
        studentID,
        division: data.division,
        name: data.name,
        gender: data.gender,
        dob: data.dob,
        age: data.age,
        guardianName: data.guardianName,
        guardianOccupation: data.guardianOccupation,
        address: data.address,
        district: data.district,
        state: data.state,
        country: data.country,
        zip: data.zip,
        email: data.email,
        mobile: data.mobile,
        school: data.school,
        admissionDate: data.admissionDate,
        photoURL,
        registrationStatus: data.registrationStatus,
        paymentStatus: data.paymentStatus,
        remarks: data.remarks,
        role: 'student',
        autoGenerateID: data.autoGenerateID === 'on',
    };

    if (data.division === 'CAPT') {
        payload.course = data.course;
        payload.courseDuration = data.courseDuration;
        payload.batchTiming = data.batchTiming;
        payload.feePlan = data.feePlan;
        payload.optionalAddons = data.optionalAddons;
    } else if (data.division === 'LBS') {
        payload.course = data.course;
        payload.preferredSchedule = data.preferredSchedule;
        payload.courseLevel = data.courseLevel;
        payload.feeStructure = data.feeStructure;
        payload.internshipOption = data.internshipOption === 'on';
    } else if (data.division === 'Gama') {
        payload.currentGrade = data.currentGrade;
        payload.schoolName = data.schoolName;
        payload.guardianConsent = data.guardianConsent === 'on';
        payload.batchPreference = data.batchPreference;
        payload.feePlan = data.feePlan;
    }
    return payload;
}
