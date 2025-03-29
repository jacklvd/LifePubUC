# LifePub

**Purpose**: Enhance student engagement in campus life.

## 🛠 Technologies

<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://ui.shadcn.com/"><img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="NodeJS"></a>
  <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"></a>
  <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"></a>
  <a href="https://aws.amazon.com/"><img src="https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS"></a>
  <a href="https://github.com/features/actions"><img src="https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white" alt="GitHub Actions"></a>
  <a href="https://www.figma.com/"><img src="https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white" alt="Figma"></a>
</div>

### Features:

**Event Listings**: Find and join nearby events (like Eventbrite).
**Item Exchange**: Platform for exchanging textbooks, equipment, and merch (like Facebook Marketplace).

**Goals**:
Build a stronger campus community.
Encourage participation in activities.
Support peer-to-peer item sharing and reduce waste.

## Project Description:

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

## Design Schema: Student Marketplace Flow

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

## Design Schema: Modular Components Overview

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

## Design Schema: High-Level System Architecture

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

### Timeline

Link to the [Timeline](https://drive.google.com/file/d/1u4js-25v6d6zLAlpdISRgHBBA9TRQKFY/view?usp=sharing)

## License

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

## Authors

- [@jacklvd](https://www.github.com/jacklvd)
- [@BinniesLite](https://github.com/BinniesLite)
