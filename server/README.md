<p align="center">
  <h1 align="center">Server side code</h1>

  <p align="center">
    <h3 align="center">The Backend code of Darkhold</h3>
    <p align="center" >
      <a href="https://darkhold.siddhantkumarsingh.me/">Live Demo</a>
    </p>
    <br />
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

The backend code of DarkHold is responsible for managing and securing user data using Hybrid Cryptography, as well as providing authentication and data management systems for efficient and secure cloud storage and sharing.
<br />

### Built With
[<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">](https://www.typescriptlang.org/) [<img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node-dot-js&logoColor=white">](https://nodejs.org/en/)
[<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white">](https://expressjs.com/) [<img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white">](https://www.mongodb.com/)
<br />


<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

* **npm** or **yarn**

### Installation

1. Clone the source repo

2. Install NPM packages
   ```sh
   npm i or yarn
   ```
4. Ceate a `.env` file with following environment variables.
   ```JS
   PORT = 'ENTER YOUR PORT HERE'
   MONGO_URI = 'ENTER YOUR MONGO URI HERE'
   JWT_SECRET = 'ENTER YOUR JWT SECRET FOR JSON WEB TOKENS'
   SALT = 'ENTER A SECRET STRING'
   AES_IV = 'ENTER A SECRET STRING WHICH WILL BE USED TO CREATE IV FOR AES'
   KDF_SALT = 'ENTER A SECRET STRING WHICH WILL BE USED AS A SALT FOR KDF'

   AWS_ACCESS_KEY_ID = 'ENTER YOUR AWS ACCESS KEY ID'
   AWS_SECRET_ACCESS_KEY = 'ENTER YOUR AWS SECRET ACCESS KEY'
   AWS_REGION = 'ENTER YOUT AWS REGION'
   AWS_BUCKET_NAME = 'ENTER YOUR AWS BUCKET NAME'

   RSA_PUBLIC_KEY = 'ENTER YOUR PUBLIC RSA KEY'
   RSA_PRIVATE_KEY = 'ENTER YOUR PRIVATE RSA KEY'
   ```
5. Start the server
   ```JS
   npm run dev or yarn dev
   ```
   The server will listen on PORT specified in the `.env` file.


<!-- CONTACT -->
## Contact

[<img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white">](https://www.linkedin.com/in/siddhant-kumar-singh-/) [<img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white"></img>](mailto:singhsiddhantkumar@gmail.com)
