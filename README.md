## Team names (include Advisor) and Project Abstract (limit of 400 ascii chars)

**Project Name**: LifePub 

**Purpose**: Enhance student engagement in campus life.

### Features:

**Event Listings**: Find and join nearby events (like Eventbrite).
**Item Exchange**: Platform for exchanging textbooks, equipment, and merch (like Facebook Marketplace).

**Goals**:
Build a stronger campus community.
Encourage participation in activities.
Support peer-to-peer item sharing and reduce waste.

## Project Description (Assignment #2)

Life Pub is a dynamic platform—available as both a mobile app and a website—designed to enrich your student life by keeping you connected and engaged with everything happening on campus. Whether you're looking to join a new club, attend an event, or find a new home for your old textbooks, Life Pub is your one-stop destination to make the most out of your school experience.
Stay Engaged with Campus Activities: Life Pub provides real-time updates on school activities, clubs, and events, making it effortless for you to discover and participate in what's happening around you.
Connect Through Peer-to-Peer Exchanges: Life Pub's peer-to-peer marketplace allows students to exchange or pass on items like textbooks, equipment, and school merchandise. It's a sustainable way to save money, reduce waste, and help out fellow students.
Foster a Stronger Community: At its core, Life Pub is all about building connections. By bringing together various facets of campus life into one accessible platform, we aim to foster a vibrant and supportive student community where everyone can thrive.

## User Stories
## Normal Student Perspective
**As a normal student at UC,**
- I want to be able to:
  - Interact with the app to purchase merchandise.
  - Find events that match my interests or hobbies (pre-defined in the app preferences).
- So that:
  - I can stay up-to-date with current events in the Cincinnati area.

## Student Seller Perspective
**As a student with items to sell (a.k.a. seller),**
- I want to:
  - Interact with the app easily to post my items.
  - Ensure my posts receive a certain number of daily views, increasing the chances of finding potential customers.
- I also want the app to:
  - Facilitate and secure transactions.
  - Avoid requiring numerous procedures to set up my account (e.g., simplified setup compared to TikTok Shop).
## Design Diagrams: Level 0, Level 1 and Level 2
- ![Design Diagrams D0](/Design_Diagram_(D0).png)
- ![Design Diagrams D1](/Design_Diagram_(D1).png)
- ![Design Diagrams D2](/Design_Diagram_(D2).png)
## Description of the Diagrams: including conventions and a brief description of the purpose of each component.

## Design Diagram D0: Student Marketplace Flow
This diagram represents the **data flow within the student marketplace platform**:

1. **Inputs**:
   - **Student Listings**: Items posted by users.
   - **User Profiles**: Data about individual users.
   - **Search Queries**: User-generated searches.

2. **System Components**:
   - **User Input**: Captures data from users.
   - **System**: Processes inputs and generates outputs.

3. **Outputs**:
   - **Marketplace Items**: Search results or listed items.
   - **Connections**: Links between buyers and sellers.
   - **Resources**: Relevant resources or events for students.

This flow demonstrates how user input is transformed into actionable results within the platform.

---

## Design Diagram D1: Modular Components Overview
This diagram highlights the **modular components** of the application:

1. **User Interface**:
   - Provides access through:
     - **Web Interface**
     - **Mobile Interface**

2. **Core Modules**:
   - **Authentication**: Handles user login and security.
   - **User Management**: Manages user profiles and preferences.

3. **Functional Modules**:
   - **Marketplace**:
     - Features a **Transaction System** for secure buying and selling.
   - **Community**:
     - Enables **Resource Sharing** for connecting students.

4. **Data Storage**:
   - Organized into three main databases:
     - **User Data**
     - **Listing Data**
     - **Resource Data**

---

## Design Diagram D2: High-Level System Architecture
This diagram illustrates the architecture of the **Campus Connect app**, breaking it down into the following layers:

1. **Frontend Layer**:
   - Includes the core functionalities such as:
     - **Authentication**
     - **Listing Management**
     - **Search/Filter**
     - **Messaging**
   - These components interact with the backend through APIs or WebSocket connections.

2. **Backend Services**:
   - Comprises various microservices:
     - **User Service**: Manages user-related data and authentication.
     - **Listing Service**: Handles item postings and their details.
     - **Search Service**: Manages the search index for faster and filtered queries.
     - **Message Service**: Facilitates real-time communication between users.
   - Utilizes **validation** and **storage** services to ensure data integrity and secure storage.

3. **External Services**:
   - Integrates with external services such as:
     - **University OAuth** for authentication.
     - **Content Delivery** for hosting media files.
     - **Email Service** for user notifications.

4. **Data Layer**:
   - Stores information in specific databases:
     - **User Database**
     - **Search Database**
     - **File Storage**
     - **Message Database**

## Project Tasks and Timeline (Assignment #5-6)

### Task List
| Task ID | Task Description | Responsible | Priority | Status |
|---------|------------------|-------------|----------|--------|
| 1 | Specify the detailed requirements for the event tracking feature | Hoang Nguyen | High | |
| 2 | Design the database schema for storing event information | Quan Le | High | |
| 3 | Develop RESTful API endpoints for event CRUD operations | Long Vo | High | |
| 4 | Implement user authentication and authorization system | Quan Le | High | |
| 5 | Design the user interface for the event listing and detail pages | Quan Pham | Medium | |
| 6 | Develop frontend components for displaying events | Hoang Nguyen | Medium | |
| 7 | Integrate push notifications for upcoming events | Long Vo & Quan Pham | Low | |
| 8 | Research and select a suitable map API for displaying event locations | Hoang Nguyen & Quan Le | Low | |
| 9 | Implement geolocation-based event filtering | Long Vo | Medium | |
| 10 | Design the user interface for the free food tracking feature | Quan Pham | Medium | |
| 11 | Develop backend logic for managing and updating free food information | Quan Le | Medium | |
| 12 | Create frontend components for displaying and interacting with free food listings | Long Vo | Medium | |
| 13 | Specify the requirements for the marketplace feature | Hoang Nguyen | High | |
| 14 | Design the database schema for marketplace listings | Quan Le | High | |
| 15 | Develop API endpoints for creating, updating, and deleting marketplace listings | Quan Le & Long Vo | High | |
| 16 | Design the user interface for the marketplace feature | Quan Pham | Medium | |
| 17 | Implement frontend components for browsing and posting marketplace items | Quan Pham | Medium | |
| 18 | Develop a search and filter system for marketplace items | Quan Le | Medium | |
| 19 | Integrate a messaging system for marketplace users | Long Vo | Low | |
| 20 | Design and implement a user profile system | Quan Pham & Quan Le | Medium | |
| 21 | Develop a recommendation engine for events and marketplace items | Quan Le | Low | |
| 22 | Implement data analytics and reporting features | Hoang Nguyen & Long Vo | Low | |
| 23 | Conduct usability testing for all main features | Long Vo | High | |
| 24 | Optimize application performance and responsiveness | All team members | Medium | |
| 25 | Document the API and create user guides | Quan Pham | Medium | |
| 26 | Oversee project deadlines and team coordination | Hoang Nguyen | High | |
| 27 | Coordinate communication with the project advisor | Hoang Nguyen | Medium | |
| 28 | Keep track of all pull requests and ensure code quality | Long Vo | High | |
| 29 | Assign programming tasks to team members | Quan Le | High | |
| 30 | Create an overview of the application design in Figma | Quan Pham | High | |
| 31 | Maintain all project documentation and ensure deliverables are recorded | Quan Pham | High | |

Note: Priority levels (High, Medium, Low) have been assigned based on the typical importance of these tasks in a project lifecycle. The team should review and adjust these as needed. The Status column is left blank for the team to update as the project progresses.



### Timeline

Link to the Timeline: https://drive.google.com/file/d/1u4js-25v6d6zLAlpdISRgHBBA9TRQKFY/view?usp=sharing


### Effort Matrix

Link to the Effort Matrix:
https://docs.google.com/document/d/17PhEfPg8uCi_Xp-QmUqM_7modIzHADlYA24vwrh6nVU/edit?usp=drive_link


## ABET Concerns Essay (Assignment #7)

Link to the essay: 
https://drive.google.com/file/d/1u4js-25v6d6zLAlpdISRgHBBA9TRQKFY/view?usp=sharing

## PPT Slideshow (includes ABET Concerns) (Assignment #8)

Link to google doc:
https://docs.google.com/presentation/d/1kMsCP-yr7eLmIw3owozBxf2PejEByKcg2G89E939FXg/edit?usp=sharing


## Self-Assessment Essays (Assignment #3)

Quan Le: https://docs.google.com/document/d/1hQbV365ZZpOAT3V0a0dDD-z3xuq_cu1_6PxtNohWYOE/edit?usp=sharing

*FILL IN YOUR INFO HERE*




## Professional Biographies  (Assignment #1)

Quan Le:

Email: leqn@mail.uc.edu 

portfolio: leqndev.com

**Company 1**: Meta

Experience: Software Engineer Intern

**Company 2**: University of Cincinnati

Experience: Machine Learning Researcher

Project Sought: 

Want to work on project that utilize cloud technologies with machine learning operations to build a project that can solve a business needs or a pain point for end-users

*NEED TO FILL IN YOUR BIOGRAPHIES HERE*

## Budget
- expenses to date or statement that there have not been any.

We have mostly used free resources or tier from AWS, Azure and free resources on youtube so there has not been any extra cost yet. But using ClaudeAI api and google agent there has been some minimal cost 

- show monetary value of donated items and donation sources.

N/A

## Appendix
- include appropriate references, citations, links to code repositories, and meeting notes.
- there should be evidence justifying 45 hours of effort for each team member.
