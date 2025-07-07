const cron = require("node-cron");
const Appointment = require("../model/appointment.js");
const Patient = require("../model/patient.js");
const Doctor = require("../model/doctor.js");
const Shifts = require("../model/shifts.js");
const { send_notification } = require("../controller/utils.js");
const moment = require("moment");

function scheduleAppointmentReminders() {
  cron.schedule("* * * * *", async () => {
    console.log("🚀 appointment reminder cron triggered");

    try {
      const now = moment();
      const fiveMinutesLater = moment().add(5, "minutes");

      // find appointments scheduled for today and not yet reminded
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

        // check if today matches shift day
        const today = moment().format("dddd");
        if (shift.day !== today) continue;

        // check if shift time is within the next 5 minutes
        const shiftTimeMoment = moment(
          shift.time,
          "hh:mm A"
        ); // parse shift time like "03:15 PM"

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

          // notify patient
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

          // notify doctor
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

          // mark appointment as notified
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

module.exports = { scheduleAppointmentReminders };
