<?php
require_once("vendor/autoload.php");
// Kickstart the framework
$f3 = Base::instance();

$f3->set('ONERROR', function ($f3) {
    $error = $f3->get('ERROR');
    switch ($error["code"]) {
        case 404:
            $f3->set('ERROR_TITLE', "Page non trouvée");
            $f3->set('ERROR_DESC', "Hélas, la page que vous cherchez n'a pas été trouvée. Voici les détails techniques que vous pouvez transmettre afin de chercher à corriger le problème.");
            echo (new Template())->render('errors/error.htm');
            break;
        case 500:
        default:
            $f3->set('ERROR_TITLE', "Quelque chose s'est mal passé");
            $f3->set('ERROR_DESC', "Pas de panique, les informations ci-dessous devraient donner plus de détails pour aider à corriger le problème.");
            echo (new Template())->render('errors/error.htm');
            break;
    }
});

// Load configuration
$f3->config('app/config/config.ini');
// Define routes
$f3->config('app/config/routes.ini');

$f3->run();
