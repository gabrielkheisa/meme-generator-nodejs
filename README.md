# Meme generator rewritten on Node.js

This repository contains a previous <a href="https://github.com/gabrielkheisa/meme-generator">LEMP stack meme generator</a>, rewritten on Node.js along with necessary steps to set up and run the app.

## Getting Started

### 1. Explore docker-compose.yml
Take a look at the docker-compose.yml file to understand the services and configurations defined for Docker or create a Docker external network "meme-generator-net" or create a <b>docker-compose.yml</b> file and copy this configuration:

```yml
# ./docker-compose.yml
version: '3'

networks:
  meme-generator-net:
    external: true
    name: "meme-generator-net"

services:
  app:
    image: adhocore/lemp:8.1
    # For different app you can use different names. (eg: )
    container_name: memegenerator
    volumes:
      # app source code
      - ./meme-generator-nodejs:/var/www/html
      # db data persistence
      # Here you can also volume php ini settings
      # - /path/to/zz-overrides:/usr/local/etc/php/conf.d/zz-overrides.ini
    ports:
      - 3000:3000
    environment:
      MYSQL_ROOT_PASSWORD: supersecurepwd
      MYSQL_DATABASE: appdb
      MYSQL_USER: dbusr
      MYSQL_PASSWORD: securepwd
      # for postgres you can pass in similar env as for mysql but with PGSQL_ prefix
    networks:
      - "meme-generator-net"
    restart: always

volumes:
  db_data: {}
```
### 2. Run the Docker container
Run the container using Docker Compose:
```bash
docker-compose up -d
```

### 3. Clone the Repository
Clone this repository to your local machine:

```bash
git clone https://repo.gabrielkheisa.xyz/gabrielkheisa/meme-generator-nodejs.git
cd meme-generator-nodejs
```

### 4. Bash into the Container
Access the container's terminal/bash, look for it using "docker ps":
```bash
docker exec -it <container_name> bash
```
Update the repository:
```bash
apk update
```

### 5. Backup SQL table structure
Backup the file <b>table_structure_ronaldo.sql</b> from the repository or via terminal by logging into MySQL
```bash
mysql -u root -p
```
with the password <b>supersecurepwd</b> . Then, select database <b>appdb</b>
```bash
use appdb;
```
and backup the table structure
```bash
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: app:3306
-- Generation Time: Nov 27, 2023 at 10:35 AM
-- Server version: 10.6.14-MariaDB
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `appdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `meme_ronaldo`
--

CREATE TABLE `meme_ronaldo` (
  `id` int(11) NOT NULL,
  `text` varchar(120) NOT NULL,
  `value` varchar(9) NOT NULL,
  `status` varchar(1) NOT NULL DEFAULT '0',
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `meme_ronaldo`
--
ALTER TABLE `meme_ronaldo`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `meme_ronaldo`
--
ALTER TABLE `meme_ronaldo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
```
### 6. Install Python, video renderer, NPM, and all of the requirements
For video renderer purposes:
```bash
apk add --no-cache python3 py3-pip
apk add make automake gcc g++ subversion python3-dev
apk add ffmpeg
pip3 install --upgrade pip
pip3 install mysql-connector-python==8.0.29
pip3 install python-dotenv
apk add npm
```
### 7.  Install Node.js Development or Production Tools
In this case, for development only, use nodemon, else use pm2:
```bash
npm install -g nodemon
```
### 8.  Configure .env File
Create a .env file in the root directory and add necessary configurations:
```
DB_HOST=localhost
DB_USER=dbusr
DB_PASSWORD=securepwd
DB_NAME=appdb
PORT=3000
```
### 9.  Start the Node.js App
Run the application using npm, in a detached session using Linux screen:
```bash
apk add screen
```
Create a screen session for npm:
```bash
screen
```
Install dependencis:
```bash
npm install
```
Run the application using npm:
```bash
npm start
```
Detach from the screen, using <b>CTRL + A</b> then <b>CTRL + D</b>
### 10.  Run the Python video renderer script
Create a screen session for Python video renderer:
```bash
screen
```
Execute the Python video renderer script:
```bash
cd videos
python render.py
```
Detach from the screen, using <b>CTRL + A</b> then <b>CTRL + D</b>
###  11. Access the Server Endpoint
Navigate to http://localhost:3000 or the configured endpoint in your browser to access the server.

### Additional Notes:
- Modify configurations in docker-compose.yml for custom setups.
- Ensure proper permissions and access rights when running docker commands.
