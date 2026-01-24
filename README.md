# Tag

[My Notes](notes.md)

Tag. It's tag. It'll be a real time online multiplayer version of the classic playground game. There's a lot of potential features to be added here, such as powerups, maps, custom skins, and all the like. Down the road, we'll see just which features get added, but the core gameplay loop will be the eternal game of tag.

## 🚀 Specification Deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] Proper use of Markdown: I looked up markdown syntax and made sure to follow proper conventions
- [x] A concise and compelling elevator pitch: I made the pitch (see below)
- [x] Description of key features: I listed some key features I'd like for now. Subject to change depending on how things go.
- [x] Description of how you will use each technology: I described what each technology is for.
- [x] One or more rough sketches of your application. Images must be embedded in this file using Markdown image references: I included sketches of each HTML page as well as a sequence diagram showing the communication that happens when someone is tagged.

### Elevator pitch

Did you play tag on the playground? Why does such a basic game have so much appeal? Whatever the reason, tag was fun as a kid, and it can still be fun even when your friends are farther away than they used to be. Imagine the chaos of a real time online multiplayer game of tag enhanced by powerups, custom art, and more. A simple game to pull friends together to chat, laugh, and maybe cause a little mamyhem along the way. Are you ready to play?

### Design

![Login Screen](img/login.png)

This is the login/create account screen. This will be the default page when the server is first hit.

![Profile Screen](img/profile.png)

After logging in, the user will be sent here. This screen shows gameplay statistics and customization options. Here is also where the user can create and join games.

![Game Screen](img/game.png)

This is the main gameplay screen. In the middle is the actual game. On the left is a screen showing the other players in the room, and on the right shows the user and their stats for the round.

```mermaid
sequenceDiagram
    actor Player1
    actor Player2
    actor Player3
    Player1->>Server: Moved left
    Server -->>Player2: Player1 left
    Server -->>Player3: Player1 left
    Server -->>Player1: Player1 tagged Player3
    Server -->>Player2: Player1 tagged Player3
    Server -->>Player3: Player1 tagged Player3

```

The server will act as the brain of the game. It will keep track of player locations and when someone is tagged.

### Key features

- Real time online multiplayer
- Individual player statistics are recorded
- Player skins are customizable
- Rooms can be created and joined by players so friends can play together
- Obstacles and powerups make rounds diverse

### Technologies

I am going to use the required technologies in the following ways.

- **HTML** - Frameworking the pages. There will be three pages: the login/create account page, the profile page, and the game page. Hyperlinks will allow users to navigate from page to page. The game screen will be drawn with a `<canvas>` or using a grid of boxes
- **CSS** - Style the pages to be consistent with each other and look appealing. This will mainly be a desktop/tablet application, so things may not look right on mobile.
- **React** - Update the game screen, pull up modals for creating/joining games, update the statistics to track them live, etc...
- **Service** - Backend endpoints for:
    - Create account
    - Login
    - Update profile (change skin, name, etc...)
    - Create a game
    - Join a game
    - Game actions (moving, being tagged, etc...)
    - Exit a game (intentionally or because of crash or disconnection)
    - Google Gemini or AWS Bedrock API to analyze game statistics using AI
- **DB/Login** - Storing profile preferences and statistics and login credentials. The user can't join or create a game without being authenticated.
- **WebSocket** - Movements, tags, pickups, etc... will be broadcasted by the server to all players so that they can play simultaneously.

## 🚀 AWS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Server deployed and accessible with custom domain name** - [My server link](https://goplaytag.click).

## 🚀 HTML deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **HTML pages** - I added four pages: index, profile, create-account, and game
- [x] **Proper HTML element usage** - I've got main, header, and section tags where appropriate, and the anchor tags all work. I also split things into tables where it was appropriate. For now, some things are laying out vertically instead of horizontally, but I'll use CSS to fix that later.
- [x] **Links** - The Github link is in the footer of every page. All the other links on the pages work properly! (I know, I clicked 'em all).
- [x] **Text** - There's text where it's needed. It looks like text.
- [x] **3rd party API placeholder** - On the profile page, there's a placeholder for where I'll make a call to the Google Gemini API to analyze some captured game statistics.
- [x] **Images** - There's a bunch of SVGs representing skins for the game as well as a custom made (and strikingly beautiful) logo.
- [x] **Login placeholder** - There's a login page. It doesn't do anything yet, but it's there.
- [x] **DB data placeholder** - There's placeholders showing game statistics. These statistics, as well as user preferences, will be saved per user.
- [x] **WebSocket placeholder** - The game is going to be controlled entirely by websocket.

## 🚀 CSS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Visually appealing colors and layout. No overflowing elements.** - An AI helped me get a color pallette, and from there, I set everything up.
- [x] **Use of a CSS framework** - I mostly used styles I created myself, but I implemented Tailwind via their CDN to take care of layouts and responsive elements.
- [x] **All visual elements styled using CSS** - I got rid of the `<br/>` tags and things and made all the styling come from the stylesheets.
- [x] **Responsive to window resizing using flexbox and/or grid display** - I used flexbox and media queiries to get things to resize when the screen becomes to small. Basically, cards stack and the game screen can swap between different sizes to stay visible.
- [x] **Use of a imported font** - I got the [Oxanium](https://fonts.google.com/specimen/Oxanium) font from Google Fonts and plugged it in
- [x] **Use of different types of selectors including element, class, ID, and pseudo selectors** - I used class, element, id, and pseudo selectors across the different stylesheets.

## 🚀 React part 1: Routing deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Bundled using Vite** - I did not complete this part of the deliverable.
- [ ] **Components** - I did not complete this part of the deliverable.
- [ ] **Router** - I did not complete this part of the deliverable.

## 🚀 React part 2: Reactivity deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **All functionality implemented or mocked out** - I did not complete this part of the deliverable.
- [ ] **Hooks** - I did not complete this part of the deliverable.

## 🚀 Service deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Node.js/Express HTTP service** - I did not complete this part of the deliverable.
- [ ] **Static middleware for frontend** - I did not complete this part of the deliverable.
- [ ] **Calls to third party endpoints** - I did not complete this part of the deliverable.
- [ ] **Backend service endpoints** - I did not complete this part of the deliverable.
- [ ] **Frontend calls service endpoints** - I did not complete this part of the deliverable.
- [ ] **Supports registration, login, logout, and restricted endpoint** - I did not complete this part of the deliverable.

## 🚀 DB deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Stores data in MongoDB** - I did not complete this part of the deliverable.
- [ ] **Stores credentials in MongoDB** - I did not complete this part of the deliverable.

## 🚀 WebSocket deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Backend listens for WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Frontend makes WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Data sent over WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **WebSocket data displayed** - I did not complete this part of the deliverable.
- [ ] **Application is fully functional** - I did not complete this part of the deliverable.
