<?php
require_once 'conf.php';
require_once 'database.php';
require_once 'beerService.php';

$beerService = new BeerService($db_host, $db_login, $db_password, $db_name);

// Add beer
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

  if (!isset($_POST['user']) || strlen($_POST['user']) < 1) {
    http_response_code(400);
    print "Missing POST parameter 'user' or parameter needs to contain at least 1 character";
    exit;
  }

  $user = $_POST['user'];
  $beerId = $beerService->addAndSave($user, date("Y-m-d H:i:s"));
  $beerCount = $beerService->getCountByName($user) + 1; // Plus 1 because the one that has been persistet is not counted in this request
  http_response_code(201);
  echo "One more beer for " . $user . " (" . $beerCount . ")";
  exit;
}

// Get beers
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
  header('Content-Type: application/json');
  http_response_code(200);
  echo json_encode($beerService->getAll());
  exit;
}

// Not implemented
if ($_SERVER['REQUEST_METHOD'] == 'PUT' || $_SERVER['REQUEST_METHOD'] == 'DELETE') {
  http_response_code(405);
  exit;
}
?>
