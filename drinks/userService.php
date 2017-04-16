<?php
class UserService extends Database {
    private $users = array();

    public function __construct($host, $user, $password, $dbname) {
        parent::__construct($host, $user, $password, $dbname); // Call parent constructor

        // Get users from db
        $sql = "SELECT * FROM user";
        $Recordset = parent::$database->query($sql);

        while($Record = $Recordset->fetch_assoc()) {
            $this->users[] = $Record;
        }
        $Recordset->free();
    }

    public function __destruct() {
        parent::__destruct();
    }

    public function addAndSave($user, $gender, $weight, $height, $age) {
        // Prevent SQL injection
        $user = parent::$database->real_escape_string($user);

        // Save user to db
        $query = "INSERT INTO user SET nickname = '" . $user . "', gender = " . $gender . ", type = " . $weight . ", height = " . $height . ", age = " . $age;
        parent::$database->query($query);
        $userId = parent::$database->insert_id;

        return $userId;
    }

    public function getAll() {
        return $this->users;
    }

    public function getById($id) {
        foreach ($this->users as $user) {
            if($user['id'] == $id)
                return $user;
        }
        return null;
    }

    public function printAll() {
      $printString = "[";
      foreach ($this->users as $key => $user) {
        $printString += "{\"id\":" . $user['id'] . ",\"nickname\":\"" . $user['nickname'] . "\",\"gender\":" . $user['gender'] . ",\"weight\":" . $user['weight'] . ",\"height\":" . $user['height'] . ",\"age\":" . $user['age'] . "},";
      }
      rtrim($printString, ",");
      $printString += "]";
      echo $printString;
    }
}
?>
