DROP DATABASE IF EXISTS Video_Inventory;

CREATE DATABASE Video_Inventory;

USE Video_Inventory;

CREATE TABLE Main (
  id int NOT NULL AUTO_INCREMENT,
  video_url integer NOT NULL,
  published_at varchar(255) NOT NULL,
  channel_id varchar(255) NOT NULL,
  title varchar(255) NOT NULL,
  description varchar(255) NOT NULL,
  thumb_url varchar(255) NOT NULL,
  thumb_width integer NOT NULL,
  thumb_height integer NOT NULL,
  channel_title varchar(255) NOT NULL,
  category_id varchar(255) NOT NULL,
  duration integer NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (ID)
);



CREATE TABLE Statistics (
  id int NOT NULL AUTO_INCREMENT,
  video_id integer NOT NULL,
  view_count integer NOT NULL,
  like_count integer NOT NULL,
  dislike_count integer NOT NULL,
  favorite_count integer NOT NULL,
  comment_count integer NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (video_id) REFERENCES Main(id)
);

CREATE TABLE Tags (
  id int NOT NULL AUTO_INCREMENT,
  video_id integer NOT NULL,
  tag varchar(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (ID),
  FOREIGN KEY (video_id) REFERENCES Main(id)
);



/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/
