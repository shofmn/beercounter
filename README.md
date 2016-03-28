# Beer Counter

A simple PHP and Javascript app that helps you to count your beers at an event. It consits of a *Beer Counter* page that shows how many beers you amd your friends have drunken so far and a seperate chart page that shows the beer consumption over time.

# How to run

1. Upload all files to a webserver that supports PHP and MySQL
2. Create the necessary table in the database by running the following SQL command:

```sql
CREATE TABLE `beer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(21) NOT NULL,
  `drinkdate` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1;
```

3. Adjust the conf.php
4. Enjoy! Use `/chart` to access the chart

# How to add a beer
Simply do a HTTP POST request to `/beers` including the parameter `user` (that contains your or your friends username). That's it.

# Notes
* Don't look at the code. It was developed in 3 days during [Revision demoparty](https://www.revision-party.net), while partying hard and under the heavy influence of alcohol.
* Seriously, don't look at the code. All you need to know is that it just works.
* The calculation of the amount of beer you drink is under the assumption that each beer has a volume of 0.3 liters.
* The application uses **no authentication**, so be careful with whom you share the link, especially the HTTP POST resource to add a beer. However, this gives you the possibility to easily call this URL from any IoT device (such as an bluetooth button).

# Used external libraries/tools
* jQuery
* Chart.js
* font-awesome
