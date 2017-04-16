# Beer Counter

A simple PHP and Javascript app that helps you to count your beers and longdrinks at an event. It consits of a *Beer Counter* page that shows how many drinks you and your friends have drunk so far and a separate chart page that shows the drink consumption over time (see screenshots below).

# Setup

1. Upload all files to a webserver that supports PHP and MySQL
2. Create the necessary table in the database by running the following SQL command:

```sql
CREATE TABLE `drink` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `drinkdate` datetime NOT NULL,
  `type` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nickname` varchar(21) NOT NULL,
  `gender` binary(1) NOT NULL,
  `weight` bigint(6) NOT NULL,
  `height` smallint(6) NOT NULL,
  `age` smallint(6) NOT NULL,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `name` (`nickname`),
  FULLTEXT KEY `name_2` (`nickname`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
```

3. Adjust the `conf.php` file
4. Add the users to your database using a DB tools such as PHPMyAdmin
5. Enjoy! Use `/chart` to access the chart

# How to add a beer
Simply do a HTTP POST request to `/drinks` including the parameter `user` (that contains your or your friends handle) and the parameter `type` (0 for a beer, 1 for a longdrink). That's it.

# Notes
* Don't look at the code. It was developed in 3 days during [Revision demoparty](http://www.revision-party.net), while partying hard and under the heavy influence of alcohol. (**Update**: Also the v3 version was developed drunken :) )
* Seriously, don't look at the code. All you need to know is that it just works.
* The calculation of the amount of alcohol you drink is under the assumption that each beer has a volume of 0.3 liters.
* The application uses **no authentication**, so be careful with whom you share the link, especially the HTTP POST resource to add a beer. However, this gives you the possibility to easily call this URL from any IoT device (such as a bluetooth button) without setting up OAuth or any other authentication method.

# Used external libraries/tools
* [jQuery](https://jquery.com/)
* [Chart.js](http://www.chartjs.org/)
* [Font Awesome](http://fontawesome.io/)

# Screenshots

![Image of Beer Counter Website](https://cloud.githubusercontent.com/assets/2188617/25071942/addc29c8-22c3-11e7-9be9-3cb706ae084b.png)

![Image of Beer Consumption Chart](https://cloud.githubusercontent.com/assets/2188617/25071943/b2d67226-22c3-11e7-9c2c-82c21a287b32.png)
