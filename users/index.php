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

require_once '../drinks/conf.php';
require_once '../drinks/database.php';
require_once '../drinks/userService.php';

$userService = new UserService($db_host, $db_login, $db_password, $db_name);

// Get users
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
  header('Content-Type: application/json');
  http_response_code(200);
  echo json_encode($userService->getAll());
  exit;
}

// Not implemented
if ($_SERVER['REQUEST_METHOD'] == 'PUT' || $_SERVER['REQUEST_METHOD'] == 'POST' || $_SERVER['REQUEST_METHOD'] == 'DELETE') {
  http_response_code(405);
  exit;
}
?>
