# Voting Application (Backend Only)

## 1. About Project

This project is a backend-only implementation of a voting application. Its primary goal is to provide functionality where users can cast their vote for a given set of candidates. The focus is on building robust **models** and **routes** to support the voting process while enforcing appropriate access control and business logic.

---

## 2. Functionality

- **User Sign Up & Sign In**
  - Users can create an account and log in using their Aadhar card number (as a unique government ID) and password.
- **View Candidates**
  - Users can view the list of all available candidates.
- **Voting**
  - Each user can vote for one candidate only; after voting, the user cannot vote again.
- **Live Vote Counts**
  - There is a route to fetch all candidates sorted by their current vote counts, updated live.
- **User Data**
  - Each user's record includes one unique government ID proof (e.g., Aadhar card number).
- **Admin Role**
  - There is a single admin account that can manage the candidate table (add/update/delete candidates) but cannot vote.
- **Password Management**
  - Users can change their passwords.
- **Authentication**
  - Login is only possible using Aadhar card number and password.
- **Voting Restrictions**
  - Admin cannot vote under any circumstances.

---

## 3. Routes (APIs)

Below are the required API endpoints to implement the described functionality:

### 1) User Authentication

- `POST /signup`  
  Create a new user account.

- `POST /login`  
  Log in to an existing account.  
  **Credentials:** Aadhar card number + password

---

### 2) Voting

- `GET /candidates`  
  Get the list of all candidates.

- `POST /vote/:candidateId`  
  Vote for a specific candidate by their ID.

---

### 3) Vote Counts

- `GET /vote/counts`  
  Retrieve the list of candidates sorted by their vote counts (live results).

---

### 4) User Profile

- `GET /profile`  
  Retrieve the logged-in user's profile information.

- `PUT /profile/password`  
  Change the user's password.

---

### 5) Admin Candidate Management

- `POST /candidates`  
  Create a new candidate.  
  **(Admin only)**

- `PUT /candidates/:candidateId`  
  Update an existing candidate.  
  **(Admin only)**

- `DELETE /candidates/:candidateId`  
  Delete a candidate from the list.  
  **(Admin only)**

---

## Additional Notes

- Ensure all sensitive actions are authenticated and authorized.
- Only the admin can manage candidates; only users can vote.
- Each user must have exactly one unique government ID proof.
- No user (including admin) can vote more than once.

---
