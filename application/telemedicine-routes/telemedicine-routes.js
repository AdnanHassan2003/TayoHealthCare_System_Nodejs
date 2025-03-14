var adminController = require('../telemedicine-controller/telemedicine-controller');// admin routes


module.exports = function (app) {
  app.route('/').get(adminController.dashboard);
  app.route('/dashboard').get(adminController.dashboard);
  app.route('/admin').post(adminController.check_admin_login);
  app.route('/admin_list').get(adminController.list_admin);
  app.route('/admin_list').post(adminController.list_admin);
  app.route('/add_admin').get(adminController.add_admin)
  app.route('/add_admin').post(adminController.add_admin)
  app.route('/edit_admin').post(adminController.edit_admin)
  app.route('/update_admin_details').post(adminController.update_admin_details)
  app.route('/save_admin_details').post(adminController.save_admin_details)
  app.route('/delete_admin').post(adminController.delete_admin);
  app.route('/log_out').get(adminController.log_out);
  app.route('/genetare_admin_excel').post(adminController.genetare_admin_excel);
  app.route('/get_admin_session').post(adminController.get_admin_session);
  app.route('/admn_change_admin_pass').post(adminController.admn_change_admin_pass);





  app.route("/menu_list").get(adminController.menu_list)
  app.route("/menu_list").post(adminController.menu_list)
  app.route("/add_menu").post(adminController.add_menu)
  app.route("/add_menu").get(adminController.add_menu)
  app.route("/save_menu").post(adminController.save_menu)





  app.route('/user_list').get(adminController.user_list);
  app.route('/user_list').post(adminController.user_list);
  app.route('/add_user').get(adminController.add_user)
  app.route('/add_user').post(adminController.add_user)
  app.route('/save_user_data').post(adminController.save_user_data)
  app.route('/edit_user').post(adminController.edit_user)
  app.route('/update_user_detail').post(adminController.update_user_detail)
  app.route('/delete_user').post(adminController.delete_user);





  app.route('/doctor_list').get(adminController.doctor_list);
  app.route('/doctor_list').post(adminController.doctor_list);
  app.route('/add_doctor').get(adminController.add_doctor)
  app.route('/add_doctor').post(adminController.add_doctor)
  app.route('/save_doctor_data').post(adminController.save_doctor_data)
  app.route('/edit_doctor').post(adminController.edit_doctor)
  app.route('/update_doctor_detail').post(adminController.update_doctor_detail)
  app.route('/delete_doctor').post(adminController.delete_doctor);





  app.route('/patient_list').get(adminController.patient_list);
  app.route('/patient_list').post(adminController.patient_list);
  app.route('/add_patient').get(adminController.add_patient);
  app.route('/add_patient').post(adminController.add_patient);
  app.route('/save_patient_data').post(adminController.save_patient_data)
  app.route('/edit_patient').post(adminController.edit_patient)
  app.route('/update_patient_detail').post(adminController.update_patient_detail)
  app.route('/delete_patient').post(adminController.delete_patient);





  app.route('/appointment_list').get(adminController.appointment_list);
  app.route('/appointment_list').post(adminController.appointment_list);
  app.route('/add_appointment').get(adminController.add_appointment);
  app.route('/add_appointment').post(adminController.add_appointment);
  app.route('/save_appointment_data').post(adminController.save_appointment_data)
  app.route('/edit_appointment').post(adminController.edit_appointment)
  app.route('/update_appointment_detail').post(adminController.update_appointment_detail)
  app.route('/delete_appointment').post(adminController.delete_appointment);
  
  
  


  app.route('/hospital_list').get(adminController.hospital_list);
  app.route('/hospital_list').post(adminController.hospital_list);
  app.route('/add_hospital').get(adminController.add_hospital);
  app.route('/add_hospital').post(adminController.add_hospital);
  app.route('/save_hospital_data').post(adminController.save_hospital_data)
  app.route('/edit_hospital').post(adminController.edit_hospital)
  app.route('/update_hospital_detail').post(adminController.update_hospital_detail)
  app.route('/delete_hospital').post(adminController.delete_hospital);
  

  
  

  app.route('/payment_list').get(adminController.payment_list);
  app.route('/payment_list').post(adminController.payment_list);
  app.route('/add_payment').get(adminController.add_payment);
  app.route('/add_payment').post(adminController.add_payment);
  app.route('/save_payment_data').post(adminController.save_payment_data)
  app.route('/edit_payment').post(adminController.edit_payment)
  app.route('/update_payment_detail').post(adminController.update_payment_detail)
  app.route('/delete_payment').post(adminController.delete_payment);





  app.route('/message_list').get(adminController.message_list)
  app.route('/message_list').post(adminController.message_list)
  app.route('/add_message').get(adminController.add_message)
  app.route('/add_message').post(adminController.add_message)
  app.route('/save_message_data').post(adminController.save_message_data)
  app.route('/delete_message').post(adminController.delete_message);  





  app.route('/feedback_list').get(adminController.feedback_list);
  app.route('/feedback_list').post(adminController.feedback_list);
  app.route('/add_feedback').get(adminController.add_feedback);
  app.route('/add_feedback').post(adminController.add_feedback);
  app.route('/save_feedback_data').post(adminController.save_feedback_data)
  app.route('/edit_feedback').post(adminController.edit_feedback)
  app.route('/update_feedback_detail').post(adminController.update_feedback_detail)
  app.route('/delete_feedback').post(adminController.delete_feedback);








  // All Apis That Use Our Telemedicine Application
  app.route('/login_DoctorAndPatient').post(adminController.login_DoctorAndPatient);
  app.route('/register_Patient').post(adminController.register_Patient)
  app.route('/getAll_Doctors').post(adminController.getAll_Doctors);
  app.route('/appointements').post(adminController.appointements);
  app.route('/booking_Appointement').post(adminController.booking_Appointement);
  app.route('/payPayement').post(adminController.payPayement);
  

}
