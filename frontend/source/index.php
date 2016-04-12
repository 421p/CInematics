<?php

declare(strict_types = 1);

require __DIR__ . '/../vendor/autoload.php';

use Symfony\Component\Debug\ErrorHandler;
use Symfony\Component\Debug\ExceptionHandler;

ErrorHandler::register();
ExceptionHandler::register();

use Cinematics\Application;

$app = new Application();

$app->run();


