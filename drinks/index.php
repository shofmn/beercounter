<?php

/*
  Documentation

  Drink Types:
    0: beer
    1: longdrink

  Gender:
    0: male
    1: female

  Weight: Grams
  Height: Centimeter
  Age: Years
*/

require_once 'conf.php';
require_once 'database.php';
require_once 'drinkService.php';
require_once 'userService.php';

$drinkService = new DrinkService($db_host, $db_login, $db_password, $db_name);
$userService = new UserService($db_host, $db_login, $db_password, $db_name);

// Add drink
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

  if (!isset($_POST['userid']) || is_int($_POST['userid'])) {
    http_response_code(400);
    print "Missing POST parameter 'userid' or parameter value needs to be of type integer";
    exit;
  }

  $user = $userService->getById($_POST['userid']);

  if (!$user) {
    http_response_code(404);
    print "User not found with id=" . $_POST['userid'];
    exit;
  }

  if (!isset($_POST['type']) || !($_POST['type'] == 1 || $_POST['type'] == 0)) {
    http_response_code(400);
    print "Missing POST parameter 'type' or parameter value needs to be either 0 for beer or 1 for longdrink";
    exit;
  }

  $type = $_POST['type'];

  $drinkId = $drinkService->addAndSave($user['id'], date("Y-m-d H:i:s"), $type);

  $beerDrinkCount = $drinkService->getCountByUserId($user['id'], 0); 
  $longDrinkCount = $drinkService->getCountByUserId($user['id'], 1);

  if ($type == 0)
    $beerDrinkCount++; // Plus 1 because the one that has been persistet is not counted in this request
  if ($type == 1)
    $longDrinkCount++; // Plus 1 because the one that has been persistet is not counted in this 

  http_response_code(201);

  $drinkName = null;
  if ($_POST['type'] == 0) {
    $drinkName = "beer";
  }
  else {
    $drinkName = "longdrink";
  }

  echo "One more " . $drinkName . " for " . $user['nickname'] . " (" . $beerDrinkCount . " beers, " . $longDrinkCount . " longdrinks)";
  exit;
}

// Get drinks
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
  header('Content-Type: application/json');
  http_response_code(200);
  echo json_encode($drinkService->getAll());
  exit;
}

// Delete last drink
if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {

  $parts = parse_url($_SERVER['REQUEST_URI']);
  parse_str($parts['query'], $query);
  if(!$query['userid'] || is_int($query['userid'])) {
    http_response_code(400);
    print "Missing URL parameter 'userid' or parameter value needs to be of type integer";
    exit;
  }

  $user = $userService->getById($query['userid']);

  if (!$user) {
    http_response_code(404);
    print "User not found with id=" . $_DELETE['userid'];
    exit;
  }

  $drinkService->deleteLastByUserId($user['id']);
  http_response_code(200);
  echo $user['nickname'] . "'s last drink has been deleted";
  exit;
}

// Not implemented
if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
  http_response_code(405);
  exit;
}
?>
