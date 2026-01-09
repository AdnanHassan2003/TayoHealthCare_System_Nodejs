# Tayo Health Care: A Comprehensive Telemedicine Management System

## Brief Description

This repository presents a full-stack telemedicine healthcare management system designed to facilitate remote healthcare delivery and administration. The system provides a comprehensive platform for managing patient-doctor interactions, appointment scheduling, medical consultations, laboratory services, and administrative operations within a healthcare ecosystem.

The implementation addresses key challenges in modern healthcare delivery by integrating appointment management, real-time notifications, automated reminders, prescription management, and laboratory request workflows into a unified platform. The system supports both web-based administrative interfaces and mobile application integration through RESTful APIs, enabling seamless communication between patients, healthcare providers, and administrative staff.

## Associated Research Paper

**Paper Title:** [Title of the Research Paper]

**Authors:**  
- [Author Name 1]  
- [Author Name 2]  
- [Additional Authors as applicable]

**Institution:** [Institution Name]

**Publication Status:** [Submitted / Accepted / Published]

**Journal/Conference:** [If applicable, specify the venue]

**DOI/URL:** [If published, provide DOI or URL]

## System Overview

### Purpose

The Tayo Health Care system is designed to streamline healthcare service delivery through digital transformation. The platform enables healthcare institutions to manage patient appointments, facilitate telemedicine consultations, process laboratory requests, maintain medical records, and handle administrative tasks through an integrated web-based interface and mobile application backend.

### Key Features

- **Appointment Management**: Comprehensive scheduling system with automated reminders, shift-based availability, and status tracking
- **User Management**: Multi-role support for administrators, doctors, patients, and general users with role-based access control
- **Telemedicine Support**: Consultation management and remote healthcare delivery capabilities
- **Laboratory Services**: Lab request processing, test result management, and record keeping
- **Prescription Management**: Digital prescription creation, storage, and retrieval
- **Payment Processing**: Transaction management and payment tracking
- **Hospital Management**: Multi-hospital support with facility-specific configurations
- **Feedback System**: Patient feedback collection and analysis
- **Messaging System**: Internal communication between system users
- **Reporting and Analytics**: Automated report generation for appointments, payments, hospitals, and feedback
- **Push Notifications**: Real-time notifications via Firebase Cloud Messaging (FCM)
- **Automated Reminders**: Scheduled appointment reminders using cron jobs
- **Self-Management Tools**: Patient self-service features for health management

### Target Users

- **Healthcare Administrators**: System administrators managing healthcare facilities, users, and system configurations
- **Medical Practitioners**: Doctors managing appointments, consultations, prescriptions, and patient records
- **Patients**: End-users booking appointments, accessing medical records, and receiving healthcare services
- **Laboratory Staff**: Personnel processing lab requests and managing test results
- **Researchers**: Academic researchers studying telemedicine systems and healthcare informatics

## System Architecture

### High-Level Architecture

The system follows a Model-View-Controller (MVC) architectural pattern with a three-tier architecture:

1. **Presentation Layer**: HTML views rendered using EJS templating engine, providing administrative web interfaces
2. **Application Layer**: Express.js-based RESTful API server handling business logic, request routing, and data processing
3. **Data Layer**: MongoDB database for persistent data storage with Mongoose ODM for schema management

The architecture supports both synchronous web-based interactions and asynchronous API calls for mobile application integration. Session management is implemented using Express sessions with Redis support for production environments, ensuring scalability and performance.

### Main Technologies Used

**Backend Framework:**
- Node.js (JavaScript runtime)
- Express.js 4.17.1 (Web application framework)

**Database:**
- MongoDB (NoSQL database)
- Mongoose 5.13.23 (Object Data Modeling library)

**Authentication & Security:**
- Express Session (Session management)
- Redis 2.8.0 (Session store for production)
- bcryptjs 2.4.3 (Password hashing)
- JWT (JSON Web Tokens for API authentication)

**Task Scheduling:**
- node-cron 4.2.0 (Cron job scheduling for automated reminders)

**Notifications:**
- fcm-node 1.6.1 (Firebase Cloud Messaging integration)
- node-gcm 1.1.2 (Google Cloud Messaging)

**File Processing:**
- Multer 1.4.2 (File upload handling)
- ExcelJS 4.2.0 (Excel file generation)
- xlsx 0.16.9 (Spreadsheet processing)

**Utilities:**
- moment-timezone 0.5.27 (Date and time manipulation)
- express-validator 6.10.0 (Input validation)
- password-validator 5.1.1 (Password strength validation)
- nodemailer 6.5.0 (Email functionality)

**Frontend:**
- EJS 2.7.2 (Embedded JavaScript templating)
- Bootstrap (CSS framework via AdminLTE)
- jQuery (JavaScript library)

## Installation and Setup

### Prerequisites

Before installing the system, ensure the following software is installed on your system:

- **Node.js**: Version 14.x or higher (recommended: LTS version)
- **MongoDB**: Version 4.4 or higher
- **Redis**: Version 6.0 or higher (required for production environment)
- **npm**: Node Package Manager (comes with Node.js)
- **Git**: For cloning the repository

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   cd TayoHealthCare_System_Nodejs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Create and configure the following environment files in the root directory:
   
   - `setting_strings.env`: System settings configuration
   - `admin_strings.env`: Administrator-related strings
   - `error_success_strings.env`: Error and success message strings
   - `constants.env`: Application constants
   
   Example `setting_strings.env`:
   ```
   app_name=Tayo Health Care
   jwt_secret=YourSecretKeyHere
   time_zone=Africa/Johannesburg
   time_zone_hour=3
   currency_code=R
   currency_code_usd=$
   ```

4. **Configure database connection:**
   
   Edit `config/mongoose.js` to set your MongoDB connection string:
   - For development: Update the `DB_URL` variable
   - For production: Configure MongoDB credentials and connection parameters

5. **Configure Firebase Cloud Messaging (FCM):**
   
   Place your Firebase service account key file (`serviceAccountKey.json`) in the root directory for push notification functionality.

6. **Set environment mode:**
   
   In `index.js`, set the environment:
   ```javascript
   process.env.NODE_ENV = "development"  // or "production"
   ```

### Frontend Setup

The frontend is integrated within the Express application and does not require separate installation. Static assets are served from the `public` directory, and views are rendered from the `application/views` directory.

### Configuration Steps

1. **Database Initialization:**
   - Ensure MongoDB is running on your system
   - The application will automatically create the database `telemedicine_db` on first connection
   - Database models are automatically registered on application startup

2. **Session Configuration:**
   - For development: Sessions are stored in memory
   - For production: Configure Redis connection in `config/express.js`

3. **File Upload Configuration:**
   - Upload directories are automatically created in the `uploads` folder
   - Ensure proper file system permissions for the uploads directory

4. **Cron Job Configuration:**
   - Appointment reminder cron jobs are automatically started on application launch
   - Configure timezone settings in `application/Cron/AppointmentCron.js` if needed

5. **Port Configuration:**
   - Default port: 2003
   - Modify in `index.js` or set `PORT` environment variable

## Usage

### How to Run the System

1. **Start MongoDB:**
   ```bash
   mongod
   ```

2. **Start Redis (for production only):**
   ```bash
   redis-server
   ```

3. **Start the application:**
   ```bash
   npm start
   ```
   
   Or using nodemon for development:
   ```bash
   nodemon index.js
   ```

4. **Access the system:**
   - Web interface: Open `http://localhost:2003` in your web browser
   - API endpoints: Available at `http://localhost:2003/[endpoint]`

### Typical Workflow

1. **Administrator Login:**
   - Access the admin login page
   - Authenticate with administrator credentials
   - Access the dashboard for system management

2. **User Management:**
   - Create and manage doctor accounts
   - Register and manage patient accounts
   - Configure user roles and permissions

3. **Appointment Scheduling:**
   - Configure doctor shifts and availability
   - Patients book appointments through mobile app (API) or web interface
   - System sends automated reminders 5 minutes before appointments

4. **Consultation Process:**
   - Doctors access patient appointments
   - Conduct consultations (in-person or telemedicine)
   - Create prescriptions and lab requests as needed

5. **Laboratory Services:**
   - Doctors create lab requests for patients
   - Laboratory staff process requests and upload results
   - Results are accessible to doctors and patients

6. **Payment Processing:**
   - Payments are recorded for appointments and services
   - Transaction history is maintained for reporting

7. **Reporting:**
   - Generate reports for appointments, payments, hospitals, and feedback
   - Export data to Excel format for analysis

### API Usage

The system provides RESTful API endpoints for mobile application integration. Key endpoints include:

- Authentication: `/login_DoctorAndPatient`, `/register_Patient`, `/register_Doctor`
- Appointments: `/booking_Appointement`, `/patient_appointements`, `/doctor_appointements`
- Consultations: `/conseltaion`, `/save_conseltaion`
- Prescriptions: `/save_prescription`, `/patient_prescriptions`, `/doctor_prescriptions`
- Laboratory: `/save_LabRequest`, `/save_labs_record`, `/patient_labs`, `/doctor_labs`
- Payments: `/payPayement`, `/bookAndPay`
- Notifications: `/patient_notification`, `/doctor_notification`

API requests should include appropriate authentication tokens and follow the expected request format as defined in the controller implementations.

## Validation / Evaluation

The system has been validated through functional testing and scenario-based evaluation:

### Functional Testing

- **User Authentication**: Validated login, registration, and session management for all user roles
- **Appointment Management**: Tested appointment creation, scheduling, status updates, and cancellation workflows
- **Data Validation**: Input validation using express-validator for API endpoints and password validation for user accounts
- **File Upload**: Verified image and document upload functionality for profiles and lab reports
- **Notification System**: Tested push notification delivery to patients and doctors
- **Cron Jobs**: Validated automated appointment reminder functionality

### Scenario-Based Testing

- **End-to-End Workflows**: Complete patient journey from registration to appointment booking, consultation, prescription, and payment
- **Multi-User Scenarios**: Concurrent access by multiple users (doctors, patients, administrators)
- **Error Handling**: Validation of error responses and exception handling for invalid inputs
- **Data Integrity**: Verification of database constraints, unique constraints, and referential integrity

### System Validation

The system demonstrates:
- **Reliability**: Consistent operation under normal usage conditions
- **Scalability**: Architecture supports horizontal scaling with Redis session management
- **Security**: Password hashing, session management, and input validation implemented
- **Usability**: Intuitive web interface for administrative tasks

Note: For research publication, additional validation metrics, performance benchmarks, and user study results should be documented separately in the associated research paper.

## Technologies Used

### Core Technologies
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling

### Supporting Libraries
- **bcryptjs**: Password hashing
- **express-session**: Session management
- **connect-redis**: Redis session store
- **node-cron**: Task scheduling
- **fcm-node**: Firebase Cloud Messaging
- **multer**: File upload handling
- **moment-timezone**: Date/time manipulation
- **express-validator**: Input validation
- **exceljs**: Excel file generation
- **nodemailer**: Email functionality
- **ejs**: Template engine

### Development Tools
- **nodemon**: Development server with auto-reload
- **dotenv**: Environment variable management

## Repository Structure

```
TayoHealthCare_System_Nodejs/
├── application/
│   ├── controller/
│   │   └── utils.js                 # Utility functions
│   ├── Cron/
│   │   └── AppointmentCron.js       # Automated appointment reminders
│   ├── model/                       # Mongoose data models
│   │   ├── admin.js
│   │   ├── appointment.js
│   │   ├── doctor.js
│   │   ├── patient.js
│   │   ├── hospital.js
│   │   ├── Payment.js
│   │   ├── prescription.js
│   │   ├── labs.js
│   │   ├── LabRequest.js
│   │   └── [other models]
│   ├── telemedicine-controller/
│   │   └── telemedicine-controller.js  # Main business logic
│   ├── telemedicine-routes/
│   │   └── telemedicine-routes.js      # Route definitions
│   └── views/                       # EJS templates
│       ├── index.html
│       ├── home.html
│       ├── header.html
│       └── [other views]
├── config/
│   ├── express.js                   # Express configuration
│   ├── mongoose.js                  # MongoDB connection
│   └── data/                        # Temporary file storage
├── public/                          # Static assets
│   ├── css/                         # Stylesheets
│   ├── js/                          # Client-side JavaScript
│   ├── plugins/                     # Third-party plugins
│   └── fonts/                       # Font files
├── uploads/                         # User-uploaded files
├── data/                            # Application data
├── index.js                         # Application entry point
├── package.json                     # Dependencies and scripts
├── LICENSE                          # License file
├── serviceAccountKey.json           # Firebase credentials (not in repo)
├── setting_strings.env              # System settings
├── admin_strings.env                # Admin strings
├── error_success_strings.env        # Error/success messages
└── constants.env                    # Application constants
```

## License

This project is licensed under the MIT License.

Copyright (c) 2026 Adnan Hassan Abdullhi

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Citation

If you use this software in your research, please cite the associated research paper. A BibTeX citation template is provided below:

```bibtex
@article{tayohealthcare2024,
  title={[Title of the Research Paper]},
  author={[Author Name 1] and [Author Name 2] and [Additional Authors]},
  journal={[Journal Name]},
  year={2024},
  publisher={[Publisher]},
  doi={[DOI if available]},
  url={[URL if available]},
  note={Software available at: \url{[Repository URL]}}
}
```

For conference publications:

```bibtex
@inproceedings{tayohealthcare2024,
  title={[Title of the Research Paper]},
  author={[Author Name 1] and [Author Name 2] and [Additional Authors]},
  booktitle={[Conference Name]},
  year={2024},
  pages={[Page Numbers]},
  doi={[DOI if available]},
  url={[URL if available]},
  note={Software available at: \url{[Repository URL]}}
}
```

## Acknowledgements

We acknowledge the contributions of the following:

- The open-source community for the excellent libraries and frameworks that made this project possible
- Healthcare professionals who provided domain expertise and feedback during system development
- Research participants who contributed to system validation and evaluation

Special thanks to all contributors and reviewers who have helped improve this system.

## Contact Information

For questions, issues, or collaboration inquiries regarding this research software:

**Principal Investigator / Corresponding Author:**  
[Name]  
[Institution]  
Email: [email address]

**Technical Contact:**  
Abdirahim Yusuf  
Email: [email address]

**Repository Maintainer:**  
[Name]  
Email: [email address]

For bug reports and feature requests, please use the issue tracker in this repository.

---

**Note for Reviewers and Researchers:** This software accompanies a peer-reviewed research publication. The system has been implemented and validated as described in the associated paper. For detailed methodology, experimental results, and analysis, please refer to the published research paper.
