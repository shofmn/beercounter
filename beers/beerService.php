<?php
class BeerService extends Database {
    private $beers = array();

    public function __construct($host, $user, $password, $dbname) {
        parent::__construct($host, $user, $password, $dbname); // Call parent constructor

        // Get beers from db
        $sql = "SELECT * FROM beer";
        $Recordset = parent::$database->query($sql);

        while($Record = $Recordset->fetch_assoc()) {
            $this->beers[] = $Record;
        }
        $Recordset->free();
    }

    public function __destruct() {
        parent::__destruct();
    }

    public function addAndSave($user, $drinkdate) {
        // Prevent SQL injection
        $user = parent::$database->real_escape_string($user);

        // Save beer to db
        $query = "INSERT INTO beer SET user = '" . $user . "', drinkdate = '" . $drinkdate . "'";
        parent::$database->query($query);
        $beerId = parent::$database->insert_id;

        return $beerId;
    }

    public function getAll() {
        return $this->beers;
    }

    public function getById($id) {
        foreach ($this->beers as $beer) {
            if($beer['id'] == $id)
                return $beer;
        }
    }

    public function getCountByName($user) {
      $beerCount = 0;
      foreach ($this->beers as $beer) {
        if($beer['user'] == $user) {
          $beerCount++;
        }
      }
      return $beerCount;
    }

    public function printAll() {
      $printString = "[";
      foreach ($this->beers as $key => $beer) {
        $printString += "{\"id\":" . $beer['id'] . ",\"user\":" . $beer['user'] . ",\"drinkdate\":" . $beer['drinkdate'] . "},";
      }
      rtrim($printString, ",");
      $printString += "]";
      echo $printString;
    }
}
?>
