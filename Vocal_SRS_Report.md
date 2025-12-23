
# Software Requirements Specification

## Project: Vocal (Language Learning Platform)

**Course Code:** INT222  
**Course Name:** Advance Web Development  
**Student Name:** Piyush Singh  
**Registration Number:** 12310729  

---

## TABLE OF CONTENTS

1. [INTRODUCTION](#1-introduction)  
    1.1 [Purpose](#11-purpose)  
    1.2 [Scope](#12-scope)  
    1.3 [Definitions, Acronyms, and Abbreviations](#13-definitions-acronyms-and-abbreviations)  
    1.4 [References](#14-references)  
    1.5 [Overview](#15-overview)  

2. [GENERAL DESCRIPTION](#2-general-description)  
    2.1 [Product Perspective](#21-product-perspective)  
    2.2 [Product Functions](#22-product-functions)  
    2.3 [User Characteristics](#23-user-characteristics)  
    2.4 [General Constraints](#24-general-constraints)  
    2.5 [Assumptions and Dependencies](#25-assumptions-and-dependencies)  

3. [SPECIFIC REQUIREMENTS](#3-specific-requirements)  
    3.1 [External Interface Requirements](#31-external-interface-requirements)  
        3.1.1 [User Interfaces](#311-user-interfaces)  
        3.1.2 [Hardware Interfaces](#312-hardware-interfaces)  
        3.1.3 [Software Interfaces](#313-software-interfaces)  
        3.1.4 [Communications Interfaces](#314-communications-interfaces)  
    3.2 [Functional Requirements](#32-functional-requirements)  
        3.2.1 [User Registration & OTP Verification](#321-user-registration-otp-verification)  
        3.2.2 [User Login & Authentication](#322-user-login-authentication)  
        3.2.3 [Course Management](#323-course-management)  
        3.2.4 [Listening Feature](#324-listening-feature)  
        3.2.5 [Vocabulary Feature](#325-vocabulary-feature)  
        3.2.6 [Speaking Practice Feature](#326-speaking-practice-feature)  
        3.2.7 [Progress Tracking Feature](#327-progress-tracking-feature)  
        3.2.8 [Admin Management Feature](#328-admin-management-feature)  
    3.5 [Non-Functional Requirements](#35-non-functional-requirements)  
        3.5.1 [Performance](#351-performance)  
        3.5.2 [Reliability](#352-reliability)  
        3.5.3 [Availability](#353-availability)  
        3.5.4 [Security](#354-security)  
        3.5.5 [Maintainability](#355-maintainability)  
        3.5.6 [Portability](#356-portability)  
    3.7 [Design Constraints](#37-design-constraints)  
    3.9 [Other Requirements](#39-other-requirements)  

4. [ANALYSIS MODELS](#4-analysis-models)  
    4.1 [Data Flow Diagrams (DFD)](#41-data-flow-diagrams-dfd)  

A. [APPENDICES](#a-appendices)  
    A.1 [Appendix 1 – Glossary](#a1-appendix-1-glossary)  
    A.2 [Appendix 2 – Future Enhancements](#a2-appendix-2-future-enhancements)  

---

<div style="page-break-after: always;"></div>

# 1. INTRODUCTION

## 1.1 Purpose
The purpose of this Software Requirements Specification (SRS) is to document the complete set of requirements for the **Vocal Language Learning Platform**. This document details the functional and non-functional requirements, system constraints, and behavioral expectations of the system. It is intended for the project stakeholders, including the development team, project supervisors, and future maintainers, to understand the system architecture, features, and operational parameters. The primary goal of *Vocal* is to provide an interactive, web-based environment for users to improve their language skills through structured courses, listening exercises, vocabulary drills, and speaking practice.

## 1.2 Scope
*Vocal* is a comprehensive web-based application designed to facilitate language acquisition. The system allows users to register, enroll in language courses, and practice various linguistic skills. 
The software subsystem includes:
- **User Module:** Registration with OTP verification, secure login, profile management, and dashboard access.
- **Learning Modules:** Interactive courses, text-to-speech enabled listening lessons, vocabulary flashcards/lists, and speech-recognition based speaking practice.
- **Admin Module:** Content management interfaces for creating courses, lessons, and managing users.
- **Progress Tracking:** Real-time analytics of user performance across different modules.

The application interacts with a centralized database to store user progress and course content and utilizes external APIs for advanced features like text-to-speech and potential speech analysis. The scope focuses on providing a responsive, intuitive interface suitable for students and professionals alike.

## 1.3 Definitions, Acronyms, and Abbreviations
| Term | Definition |
|------|------------|
| **SRS** | Software Requirements Specification |
| **OTP** | One-Time Password |
| **UI/UX** | User Interface / User Experience |
| **API** | Application Programming Interface |
| **HTTP/HTTPS** | Hypertext Transfer Protocol / Secure |
| **JSON** | JavaScript Object Notation |
| **JWT** | JSON Web Token (used for secure authentication) |
| **DBMS** | Database Management System |
| **Admin** | Administrator with elevated privileges to manage content |
| **Client** | The front-end user interface running in the browser |
| **Server** | The back-end application handling logic and database operations |

## 1.4 References
1. IEEE Std 830-1998, IEEE Recommended Practice for Software Requirements Specifications.
2. Web Content Accessibility Guidelines (WCAG) 2.1.
3. *Vocal* Project Conceptual Design Document.
4. Course Syllabus for INT222: Advance Web Development.

## 1.5 Overview
The remainder of this document provides a detailed description of the *Vocal* platform. 
- **Section 2** describes the general factors that affect the product and its requirements, including user characteristics and constraints.
- **Section 3** provides the specific validation, functional, and system requirements in detail.
- **Section 4** presents analysis models including data flow descriptions.
- **Appendices** typically contain a glossary and future enhancement plans.

---

# 2. GENERAL DESCRIPTION

## 2.1 Product Perspective
*Vocal* is a self-contained web-based software product. It functions as a standalone platform but interacts with a larger ecosystem of web technologies.
- **System Interface:** It operates within standard web browsers (Chrome, Firefox, Safari, Edge) and connects to a backend server via RESTful APIs.
- **User Interface:** The product provides a modern, responsive specific interface for different user roles (Student, Admin).
- **Communication:** It utilizes standard HTTP protocols for client-server communication and SMTP services for email-based OTP delivery.

## 2.2 Product Functions
The major functions of the system include:
1.  **Authentication & Authorization:**
    -   Secure user registration with Email OTP validation.
    -   Role-based login (Student/Admin).
    -   Password recovery and management.
2.  **Course Delivery System:**
    -   Displaying available courses and lessons.
    -   Tracking completion status of lessons.
3.  **Interactive Learning Tools:**
    -   **Listening Hub:** delivering audio content and verifying comprehension.
    -   **Vocabulary Builder:** presenting words, definitions, and usage examples.
    -   **Speaking Practice:** allowing users to speak and receive feedback (simulated or API-based).
4.  **Administrative Control:**
    -   Dashboard for viewing system stats.
    -   Tools to create, update, and delete courses and lessons.
5.  **Analytics:**
    -   Visualizing user progress on the dashboard.
    -   Calculating skill points or progress percentages.

## 2.3 User Characteristics
The user community for *Vocal* is classified into two primary categories:

### 1. Learners (Students/Professionals)
-   **Skill Level:** Varies from beginner to advanced in target languages; basic to intermediate computer literacy.
-   **Expectations:** Intuitive navigation, instant feedback on exercises, visually appealing interface, and reliable progress tracking.
-   **Usage Pattern:** Frequent, short sessions for practice (daily/weekly).

### 2. Administrators
-   **Skill Level:** High computer literacy; familiar with content management concepts.
-   **Expectations:** Efficient tools for data entry (course creation), reliable user management, and system overview capability.
-   **Usage Pattern:** Intermittent usage for content updates and system maintenance.

## 2.4 General Constraints
-   **Network Connectivity:** The system requires a stable internet connection to fetch course content and verify OTPs.
-   **Browser Compatibility:** The application must render correctly on all modern HTML5-compliant browsers.
-   **Hardware Limitations:** The client-side application must be lightweight enough to run on average consumer hardware (laptops, desktops) without significant lag.
-   **Regulatory Policy:** User data (email, passwords) must be stored securely, complying with basic privacy standards.

## 2.5 Assumptions and Dependencies
-   **Assumption:** Users have access to a device with a working microphone for Speaking Practice features.
-   **Assumption:** The email service provider used for OTPs allows for sufficient daily throughput.
-   **Dependency:** The system depends on the availability of the hosting environment (server uptime and database connectivity).
-   **Dependency:** The logic relies on browser support for Web Speech API (for text-to-speech and speech-recognition).

---

# 3. SPECIFIC REQUIREMENTS

## 3.1 External Interface Requirements

### 3.1.1 User Interfaces
The user interface is designed to be responsive and accessible.
-   **General Layout:** A consistent navigation bar (Dashboard, Courses, Listening, Vocabulary, Profile).
-   **Dashboard:** A personalized hub showing progress bars, recent activity, and quick links to daily tasks.
-   **Course Pages:** clearly structured lists of lessons with visual indicators for "Locked", "Unlocked", and "Completed" states.
-   **Responsive Design:** The UI adjusts layout for desktop, tablet, and mobile breakpoints using fluid grids and flexible images.

### 3.1.2 Hardware Interfaces
-   **Client Side:** Standard input devices (Keyboard, Mouse/Touchpad) and Audio I/O (Speakers for listening, Microphone for speaking).
-   **Server Side:** Standard server infrastructure with disk space for database storage and sufficient RAM for handling concurrent API requests.

### 3.1.3 Software Interfaces
-   **Operating System:** 
    -   *Server:* Platform independent (runs on any OS supporting the runtime environment, e.g., Linux, Windows, macOS).
    -   *Client:* OS agnostic, running within the web browser.
-   **Database:** A NoSQL document-oriented database is used to store unstructured and semi-structured data like User Profiles, Course hierarchical structures, and Vocabulary lists.
-   **APIs:**
    -   Web Speech API (Browser native) for TTS and STT features.
    -   SMTP Service Interface for generic email transmission.

### 3.1.4 Communications Interfaces
-   **Protocol:** HTTPS (Hypertext Transfer Protocol Secure) for all client-server communication to ensure data encryption in transit.
-   **Data Format:** JSON (JavaScript Object Notation) is used for all API request and response payloads.
-   **Email:** SMTP protocol for sending OTP and notification emails.

## 3.2 Functional Requirements

### 3.2.1 User Registration & OTP Verification
**Introduction:** 
New users must create an account to access the platform. To prevent spam and verify identity, an email-based OTP (One-Time Password) system is verified.

**Inputs:**
-   Full Name
-   Email Address
-   Password (and Confirmation)
-   OTP Code (received via email)

**Processing:**
1.  User submits registration form.
2.  System validates input format (e.g., valid email syntax, password strength).
3.  System checks if email already exists in the `User` database.
4.  If unique, System generates a 6-digit random OTP and sends it to the provided email.
5.  System stores a temporary hash of the OTP with an expiration time.
6.  User enters the OTP on the verification page.
7.  System compares entered OTP with stored hash.
8.  If match, a new `User` record is created in the database.

**Outputs:**
-   Success message ("Registration Successful").
-   Redirect to Login Page.
-   Email containing the OTP.

**Error Handling:**
-   *Invalid Email:* Display "Please enter a valid email address."
-   *Existing User:* Display "User already exists."
-   *Incorrect OTP:* Display "Invalid OTP. Please try again."
-   *Expired OTP:* Display "OTP expired. Resend OTP."

### 3.2.2 User Login & Authentication
**Introduction:**
Registered users must authenticate to access their personalized dashboard and progress.

**Inputs:**
-   Email Address
-   Password

**Processing:**
1.  User submits credentials.
2.  System retrieves the user record based on email.
3.  System compares the hashed password in the database with the hashed input password.
4.  If valid, the system generates a session token (JWT).
5.  The token is returned to the client and stored for subsequent requests.

**Outputs:**
-   Authentication Token (stored in local storage/cookies).
-   Redirect to User Dashboard.
-   User profile data (name, role).

**Error Handling:**
-   *User Not Found:* Display "Invalid credentials."
-   *Wrong Password:* Display "Invalid credentials."
-   *Server Error:* Display "Login failed. Please try again later."

### 3.2.3 Course Management
**Introduction:**
The core of the learning experience. Users can browse courses, enroll (implicitly or explicitly), and complete lessons.

**Inputs:**
-   User selection (Click on Course, Click on Lesson).
-   Admin inputs (Create/Edit Course Title, Description, Level).

**Processing:**
1.  **View Courses:** System queries the `Course` collection and returns a list of active courses.
2.  **View Lessons:** specific to a course, system queries `Lesson` collection linked to the Course ID.
3.  **Unlock Mechanism:** System checks `User` progress. Lesson N is accessible only if Lesson N-1 is completed.
4.  **Completion:** When a user finishes a lesson, the system updates the `User`'s `progress` array.

**Outputs:**
-   List of Courses (Cards with Title, Image).
-   Lesson content (Video, Text, Quiz).
-   Updated Progress indicators (Checkmarks).

**Error Handling:**
-   *Content Unavailable:* Display "Lesson content not found."
-   *Access Denied:* Prevent access to locked lessons and display "Complete previous lesson to unlock."

### 3.2.4 Listening Feature
**Introduction:**
A dedicated module for improving listening comprehension using audio tracks or text-to-speech synthesis.

**Inputs:**
-   User initiates "Start Listening".
-   System selects a `ListeningLesson` (e.g., a dialogue or passage).

**Processing:**
1.  System retrieves the text/audio configuration for the specific level.
2.  Data is sent to the client.
3.  Client uses Web Speech API or HTML5 Audio to play the content.
4.  User may answer comprehension questions related to the audio.
5.  System evaluates answers.

**Outputs:**
-   Audio playback.
-   Visual text (optional/transcript).
-   Score/Feedback on comprehension.

**Error Handling:**
-   *Audio Error:* Display "Unable to play audio."
-   *Browser Incompatibility:* Display "Your browser does not support text-to-speech."

### 3.2.5 Vocabulary Feature
**Introduction:**
Allows users to learn new words, their meanings, and usage.

**Inputs:**
-   User navigates to "Vocabulary".
-   Filter selection (Level 1, Level 2, etc.).

**Processing:**
1.  System queries `Vocabulary` collection.
2.  Returns a list of words with definitions, types (noun/verb), and example sentences.
3.  Client renders flashcards or a list view.
4.  User can mark words as "Learned".

**Outputs:**
-   Vocabulary Cards.
-   Pronunciation audio (via TTS).

**Error Handling:**
-   *Empty List:* Display "No vocabulary available for this level."

### 3.2.6 Speaking Practice Feature
**Introduction:**
Provides an interactive way for users to practice pronunciation and speaking confidence.

**Inputs:**
-   Microphone Input (Voice).
-   Target phrase (displayed on screen).

**Processing:**
1.  System displays a sentence to read aloud.
2.  User activates the microphone.
3.  Client captures audio and converts it to text using Speech-to-Text API.
4.  System compares the Transcribed Text with the Target Text.
5.  Accuracy score is calculated based on word matching.

**Outputs:**
-   Real-time transcription.
-   Feedback (Match/No Match).
-   Accuracy Percentage.

**Error Handling:**
-   *Microphone Access Denied:* Display "Please allow microphone access to use this feature."
-   *No Speech Detected:* Display "We didn't hear you. Please try again."

### 3.2.7 Progress Tracking Feature
**Introduction:**
Aggregates user data to show learning velocity and achievements.

**Inputs:**
-   Implicit inputs from completing Lessons, Listening exercises, and Vocabulary tasks.

**Processing:**
1.  System aggregates "completed" flags from the User profile.
2.  Calculates percentages (e.g., 5/10 lessons = 50%).
3.  Updates the Activity Log (e.g., "Practiced Speaking on [Date]").

**Outputs:**
-   Dashboard Charts/Graphs.
-   Numeric stats (Total Words Learned, Courses Completed).
-   Calendar Heatmap of activity.

**Error Handling:**
-   *Data Sync Error:* Display cached data if the server is unreachable.

### 3.2.8 Admin Management Feature
**Introduction:**
Restricted area for platform administrators to manage content and users.

**Inputs:**
-   Admin credentials.
-   Form data for creating Courses/Lessons.

**Processing:**
1.  **Auth Check:** Middleware verifies if the user has `role: 'admin'`.
2.  **Content Management:** Admin submits a new course form -> System validates and inserts into `Course` collection.
3.  **User Management:** Admin views list of users -> System returns paginated `User` data.

**Outputs:**
-   Admin Dashboard with system stats.
-   CRUD (Create, Read, Update, Delete) interfaces forms.
-   Confirmation messages ("Course Created Successfully").

**Error Handling:**
-   *Unauthorized Access:* Redirect to Home/Login with "Access Denied."
-   *Validation Error:* "Title is required."

## 3.5 Non-Functional Requirements

### 3.5.1 Performance
-   **Response Time:** The system should respond to user interactions (e.g., clicking a lesson) within 2 seconds under normal load.
-   **Throughput:** The system should support multiple concurrent users (e.g., 50+) without significant degradation in service speed.
-   **Page Load:** Initial dashboard load should be under 3 seconds on standard broadband connections.

### 3.5.2 Reliability
-   **Data Integerity:** User progress must be saved reliably. In case of browser crash, progress within a session might be lost, but completed milestones must be persistent in the database.
-   **Uptime:** The system should aim for 99% uptime during active course periods.

### 3.5.3 Availability
-   The application should be accessible 24/7.
-   Maintenance windows should be scheduled during off-peak hours (e.g., late night weekends).

### 3.5.4 Security
-   **Password Storage:** All user passwords must be hashed (e.g., using bcrypt) before storage. They must never be stored in plain text.
-   **Authentication:** Access to private routes (Dashboard, Learning) requires a valid authentication token.
-   **Input Validation:** All server-side inputs must be validated to prevent Injection attacks (NoSQL Injection) and XSS (Cross-Site Scripting).
-   **HTTPS:** All data transmission must occur over an encrypted channel.

### 3.5.5 Maintainability
-   **Code Structure:** The codebase should follow a modular architecture (separation of generic concerns: Client vs Server, Models vs Routes).
-   **Documentation:** Code should be self-documenting with comments for complex logic.
-   **Scalability:** The database structure should allow adding new courses and languages without schema changes.

### 3.5.6 Portability
-   **Web Interface:** The web application should function identically on Windows, macOS, and Linux via standard browsers.
-   **Mobile Compatibility:** The UI must be responsive, ensuring functional usability on tablets and smartphones.

## 3.7 Design Constraints
-   **Technology Stack:** The system is constrained to use JavaScript-based technologies (Node.js runtime environment) for unification of development.
-   **Database:** Must use a schema-less or flexible schema database (MongoDB) to accommodate varying lesson structures.
-   **Time:** The project must be completed within the academic semester timeframe.

## 3.9 Other Requirements
-   **Legal:** The application must include a Privacy Policy statement regarding the collection of emails.
-   **Language Support:** The interface is currently in English, teaching target languages.

---

# 4. ANALYSIS MODELS

## 4.1 Data Flow Diagrams (DFD)

### Level 0 DFD (Context Diagram)
The Context Diagram represents the entire *Vocal* system as a single process "Language Learning Platform" interacting with external entities. 
-   **Entities:**
    -   **Student:** Sends registration data, login credentials, and course progress data to the system. Receives content (audio, text), feedback, and progress reports.
    -   **Admin:** Sends course content and management commands. Receives system reports and user lists.
-   **Process:** The central "Vocal System" handles all processing.
-   **Flow:** Data flows from Students/Admins into the System, and processed information (Content, Reports) flows back to them.

### Level 1 DFD
The Level 1 DFD breaks down the main system into major sub-processes:
1.  **Auth Process:** Handles "Register", "Login", and "OTP Verify". It interacts with the *User Data Store*.
2.  **Learning Process:** Manages "Take Lesson", "Practice Listening", "Practice Speaking". It reads from the *Course Data Store* and *Vocabulary Data Store* and writes to the *User Progress Store*.
3.  **Admin Process:** Manages "Add Course", "Update Content". It writes to the *Course* and *Vocabulary Data Stores*.
4.  **Reporting Process:** Aggregates data from *User Progress Store* to generate the Dashboard view for the Student.

---

# A. APPENDICES

## A.1 Appendix 1 – Glossary
-   **Dashboard:** The main landing page for a logged-in user displaying their specific stats.
-   **Flashcard:** A digital card representing a vocabulary word, with the word on one side and definition/image on the other.
-   **MERN:** MongoDB, Express.js, React, Node.js (The underlying technology stack).
-   **REST:** Representational State Transfer, a style of software architecture.
-   **Schema:** The organization or structure for a database.

## A.2 Appendix 2 – Future Enhancements
-   **Gamification:** Adding badges, leaderboards, and daily streaks to increase user engagement.
-   **Social Features:** Allowing users to add friends and compete in language challenges.
-   **Mobile App:** Developing a native mobile application (iOS/Android) for offline learning.
-   **AI Tutor:** Implementing an advanced AI Chatbot for open-ended conversation practice.
