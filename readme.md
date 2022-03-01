# The Russo-Ukrainian War Updates

### Project Idea/Description 

With this project I want to highlight and update people on what is going on in Ukraine. During these times it is very important to document war crimes against Ukranian people by their opposition and stop misinformation from spreading on the media. This webapp serves as a tool for people to document The Russo-Ukranian war as it unfolds. A user will be able to browse through latest updates on the war and document war crimes as well as misinformation and save tweets to their profle.


### Choice of API
Most of the data for this app will be pulled form Twitter APIv2, from my experience it has been an effective source especially when it comes to live updates. For this project it will be extremly important to use verified acount tweets.
#### Valid API Proof
![API](./img/apiRef.PNG)


### ERD
![ERD](./img/erdUkraine.png)


### Restful Routing Chart

| Method | Path | Purpose |
| ------ | -------------- | -------------------------------- |
| GET | `/` | home page of the website |
| GET | `/signup` | signup page of the website |
| POST | `/signup` | signup for the website |
| GET | `/login` | login page of the website  |
| GET | `/profile` | profile page of the website  |
| DELETE | `/note/:id` | delete saved note from profile  |
| PUT | `/note/:id` | edit saved note from profile  |
| GET | `/newsfeed` | newsfeed page of the website |
| POST | `/note/:id` | add note to user profile |
| GET | `/noteform` |  note form page of the website |
| GET | `/donations` |  donations page of the website |
| GET | `/about` |  about page of the website |
| GET | `/*` | 404 page of the website |


### Wireframes of all user views
![Wireframes](./img/wireframes.png)


### User Stories
* As a user, I want to sign up for a profile 
* As a user, I want to sign out of my profile 
* As a user, I want to see all important update on The Russo-Ukrainian War
* As a user, I want to document a war crime and I want it to show up on my profile 
* As a user, I want to see full article detail from it's original source 
* As a user, I want to delete any notes I made on any articles 
* As a user, I want to edit any notes I made on any articles 


### MVP goals 
* Authentication 
* Twitter API successfully working 
* Newsfeed page
* Document war crimes form working 
* Notes showing up in my profile page
* Delete/Edit notes

### Stretch goals 
* Implement multiple sources of API, Twitter, Reddit, News 
* Filter them out 
* For each API show what source they've been pulled from 
* Implement image upload