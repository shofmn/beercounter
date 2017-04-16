<?php
class DrinkService extends Database {
    private $drinks = array();

    public function __construct($host, $user, $password, $dbname) {
        parent::__construct($host, $user, $password, $dbname); // Call parent constructor

        // Get drinks from db
        $sql = "SELECT * FROM drink";
        $Recordset = parent::$database->query($sql);

        while($Record = $Recordset->fetch_assoc()) {
            $this->drinks[] = $Record;
        }
        $Recordset->free();
    }

    public function __destruct() {
        parent::__destruct();
    }

    public function addAndSave($user, $drinkdate, $type) {
        // Prevent SQL injection
        $user = parent::$database->real_escape_string($user);

        // Save drink to db
        $query = "INSERT INTO drink SET userid = " . $user . ", drinkdate = '" . $drinkdate . "', type = " . $type;
        $querySuccessful = parent::$database->query($query);

        if (!$querySuccessful)
          echo parent::$database->error;

        $drinkId = parent::$database->insert_id;

        return $drinkId;
    }

    public function deleteLastByUserId($userId) {
        $sql = "DELETE FROM drink WHERE userid = " . $userId . " ORDER BY id DESC LIMIT 1";
        parent::$database->query($sql);
    }

    public function getAll() {
        return $this->drinks;
    }

    public function getById($id) {
        foreach ($this->drinks as $drink) {
            if($drink['id'] == $id)
                return $drink;
        }
    }

    public function getCountByUserId($userId, $type) {
      $drinkCount = 0;
      foreach ($this->drinks as $drink) {
        if($drink['userid'] == $userId && $drink['type'] == $type) {
          $drinkCount++;
        }
      }
      return $drinkCount;
    }

    public function printAll() {
      $printString = "[";
      foreach ($this->drinks as $key => $drink) {
        $printString += "{\"id\":" . $drink['id'] . ",\"userid\":\"" . $drink['userid'] . "\",\"drinkdate\":\"" . $drink['drinkdate'] . "\",\"type\":" . $drink['type'] . "},";
      }
      rtrim($printString, ",");
      $printString += "]";
      echo $printString;
    }
}
?>
