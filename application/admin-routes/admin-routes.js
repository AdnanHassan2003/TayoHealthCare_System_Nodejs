var adminController = require('../admin-controller/admin');// admin routes


module.exports = function (app) {
  app.route('/').get(adminController.admin);
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
  
  

  


    
}
