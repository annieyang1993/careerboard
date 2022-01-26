CryptoCareerBoard
----------------------

CryptoCareerBoard is an online job board where users can search for and filter Web 3 jobs based on experience level, location, skills, and other relevant factors. 
Users can choose to apply to jobs via the "Apply" button, subscribe to the weekly newsletter, or post their own job openings. 

Link to live website: https://cryptocareerboard.com/#/

Features
--------------------
1. Users are able to view all job postings and search for postings by key words.
2. Users are able to filter postings based on experience required, location, skills, and more.
3. Users are able to subscribe to a weekly newsletter via email.
4. Users are able to post their own listings for a set fee per posting. 
<img width="1248" alt="Screen Shot 2022-01-26 at 9 10 34 AM" src="https://user-images.githubusercontent.com/82074442/151178606-089dca57-d3ca-4428-a805-cb66a21004a5.png">

1. Search for key words and filter jobs by popular selections:
-----------------------------------
<img width="1232" alt="Screen Shot 2022-01-26 at 9 11 26 AM" src="https://user-images.githubusercontent.com/82074442/151178605-cdb5fc03-030a-4acb-b665-416f5218f026.png">

2. Subscribe to the weekly newsletter (writes to the subscription doc in Firebase)
<img width="1241" alt="Screen Shot 2022-01-26 at 9 11 43 AM" src="https://user-images.githubusercontent.com/82074442/151178600-48426424-beb6-49be-872a-ee6b81db8d27.png">

3. Post your own job openings (uses Firebase Storage for logo uploads and Stripe API to process payment)
------------------------------------
<img width="1236" alt="Screen Shot 2022-01-26 at 9 12 00 AM" src="https://user-images.githubusercontent.com/82074442/151178596-f91ac61c-83dc-4fde-beb4-fb37836c6d67.png">


Technologies Used
-----------------------
I used React on the frontend and Firebase (Cloud Firestore, Storage and Hosting) for the backend to ensure scalability and performance, as well as Stripe API to process payments. I used React Hooks to reflect changes in the website state. 

Future Features
--------------------------
1. In the future, I'd like to allow user authentication on the job seeker side to facilitate tracking applications and saving job openings in their user profile
2. Track "Apply Now" clicks and Job View metrics for employers.
