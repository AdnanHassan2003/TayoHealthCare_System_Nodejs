var Appointment = require("../model/appointment.js");
var Patient = require("../model/patient.js");
var Doctor = require("../model/doctor.js");
var Shifts = require("../model/shifts.js");
var cron = require("node-cron");
var send_notification = require("../controller/utils.js");
var moment = require("moment");

function scheduleAppointmentReminders() {
  cron.schedule("* * * * *", async () => {
    console.log("🚀 appointment reminder cron triggered");

    try {
      const now = moment();
      const fiveMinutesLater = moment().add(5, "minutes");

      const appointments = await Appointment.find({
        reminderSent: { $ne: true },
        status: 1,
      });

      for (const appt of appointments) {
        const patient = await Patient.findById(appt.patient_id);
        const doctor = await Doctor.findById(appt.doctor_id);
        const shift = appt.shifts_id
          ? await Shifts.findById(appt.shifts_id)
          : null;

        if (!shift) continue;

        const today = moment().format("dddd");
        if (shift.day !== today) continue;

        const shiftTimeMoment = moment(shift.time, "hh:mm A");

        const shiftToday = moment().set({
          hour: shiftTimeMoment.get("hour"),
          minute: shiftTimeMoment.get("minute"),
          second: 0,
          millisecond: 0,
        });

        if (
          shiftToday.isSameOrAfter(now) &&
          shiftToday.isSameOrBefore(fiveMinutesLater)
        ) {
          console.log(
            `🔔 Sending reminder for appointment ${appt._id} at shift time ${shift.time}`
          );

          if (patient && patient.token) {
            send_notification(
              {
                token: patient.token,
                title: "Appointment Reminder",
                message: `You have an appointment on ${appt.appointment_date} with shift ${shift.day} at ${shift.time}. Please be ready.`,
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

          if (doctor && doctor.token) {
            send_notification(
              {
                token: doctor.token,
                title: "Appointment Reminder",
                message: `You have an appointment with ${
                  patient ? patient.name : "a patient"
                } today (${shift.day}) at ${shift.time}.`,
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

          appt.reminderSent = true;
          await appt.save();
        } else {
          console.log(
            `⏰ Shift ${shift.day} ${shift.time} is not within next 5 minutes — skipping.`
          );
        }
      }
    } catch (e) {
      console.error("❌ cron appointment error", e.message);
    }
  });
}

module.exports = {
  scheduleAppointmentReminders
};
