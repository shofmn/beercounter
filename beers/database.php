<?php
class Database {
    protected static $database;

    // Constructor
    protected function __construct($host, $user, $password, $dbname) {
        Error_reporting(E_ALL);

        if(!isset(self::$database))
            self::$database = new MySQLi($host, $user, $password, $dbname); // Open db


        if(self::$database->errno)
            throw new Exception("Database error");
    }

    // Destructor
    protected function __destruct() {
        //self::$database->close(); // Close db - usually not necessary
    }
}
?>
