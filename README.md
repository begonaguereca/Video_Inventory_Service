# YouTube Clone 

We created a back-end clone of Youtube that aims to answer the question- do people abandon videos at a higher rate during day hours vs evening hours over the course of a week, on a week by week basis view?

The Video Inventory service will receive videos to write into the Video Inventory database from the Front-End Service. The data will be in the shape of an object. The information will have all of the fields below: 

## Roadmap

View the project roadmap: 
https://docs.google.com/document/d/1Z3ak0rcvqoNN1aCBgzrOLC5G-eoMp7ocuvOSZkGyu_Q/edit#

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

# Table of Contents

1. [Requirements](#requirements)
1. [Development](#development)
1. [Data Schema](#DataSchema)
1. [Architecture diagram](#Architecturediagram)
1. [Route: New Video to Upload](#Route:New Video to Upload)
1. [Route: Video Length Request](#Route:Video Length Request)

## Requirements

- Node 6.9.0
- Redis 3.2.0
- MySQL 2.15.0

## Data Schema 

The data will be serialized into a SQL database because it has to store relational data and maintain a high level of integrity for the data. The Video Inventory database serves as the principal source of truth for the recording of videos, and  a SQL database satisfies ACID (Atomicity, Consistency, Isolation and Duration) principals. The video _statistics table include variables that would be updated frequently by the user. Whereas the video_inventoy  table has variables that would not be changed frequently

<img width="616" alt="screen shot 2018-01-31 at 5 03 23 pm" src="https://user-images.githubusercontent.com/19557880/35655897-256d4e3a-06a9-11e8-9bf9-5e6cccc71c86.png">

## Architecture diagram

<img width="651" alt="screen shot 2018-01-31 at 5 03 31 pm" src="https://user-images.githubusercontent.com/19557880/35655966-7960c436-06a9-11e8-97ad-448a09abfda7.png">

## Route: New Video to Upload

A video upload request is dropped onto the Que by Front-End Service. The worker will check the Que and picks up a pending video. The video is then written into the Video Inventory database. The worker then drops a video upload event onto the Que and picks up any pending video that needs to be sent to the Event service. 

<img width="544" alt="screen shot 2018-01-31 at 5 03 50 pm" src="https://user-images.githubusercontent.com/19557880/35655994-a2d56db2-06a9-11e8-9198-a623959eb518.png">

## Route: Video Length Request

A video length request is dropped onto the Que by the Abandonment Calculator Service. The worker will check the Que and pick up a pending request. The request is then read from the Video Inventory database. The worker then drops a video length onto the Que and picks up any pending responses that needs to be sent to the Abandonment Calculator Service. 

<img width="632" alt="screen shot 2018-01-31 at 5 03 55 pm" src="https://user-images.githubusercontent.com/19557880/35656012-c2cc32fe-06a9-11e8-9464-cc46f26fcf63.png">


