const cron = require("node-cron");
const Appointment = require("../model/appointment.js");
const Patient = require("../model/patient.js");
const Doctor = require("../model/doctor.js");
const Shifts = require("../model/shifts.js");
const { send_notification } = require("../controller/utils.js");

function scheduleAppointmentReminders() {
  cron.schedule("* * * * *", async () => {
    console.log("🚀 appointment reminder cron triggered");

    try {
      const now = new Date();
      const fiveMinutesLater = new Date(now.getTime() + 5 * 60 * 1000);

      // find appointments scheduled in next 5 min and not notified
      const appointments = await Appointment.find({
        appointment_date: { $gte: now, $lte: fiveMinutesLater },
        reminderSent: { $ne: true },
        status: 1,
      });

      for (const appt of appointments) {
        const patient = await Patient.findById(appt.patient_id);
        const doctor = await Doctor.findById(appt.doctor_id);
        const shift = appt.shifts_id
          ? await Shifts.findById(appt.shifts_id)
          : null;

        const shiftInfo = shift
          ? `${shift.day} at ${shift.time}`
          : "your scheduled time";

        // notify patient
        if (patient && patient.token) {
          send_notification(
            {
              token: patient.token,
              title: "Appointment Reminder",
              message: `You have an appointment on ${appt.appointment_date} (${shiftInfo}). Please be ready.`,
              dataPayload: {
                type: "appointment_reminder",
                appointmentId: appt._id.toString(),
              },
            },
            (err, result) => {
              if (err) {
                console.log("❌ patient notification error", err);
              } else {
                console.log("✅ patient notification sent", result);
              }
            }
          );
        }

        // notify doctor
        if (doctor && doctor.token) {
          send_notification(
            {
              token: doctor.token,
              title: "Appointment Reminder",
              message: `You have an appointment with ${
                patient ? patient.name : "a patient"
              } on ${appt.appointment_date} (${shiftInfo}).`,
              dataPayload: {
                type: "appointment_reminder",
                appointmentId: appt._id.toString(),
              },
            },
            (err, result) => {
              if (err) {
                console.log("❌ doctor notification error", err);
              } else {
                console.log("✅ doctor notification sent", result);
              }
            }
          );
        }

        // mark as notified
        appt.reminderSent = true;
        await appt.save();
      }
    } catch (e) {
      console.error("❌ cron appointment error", e.message);
    }
  });
}

module.exports = { scheduleAppointmentReminders };
