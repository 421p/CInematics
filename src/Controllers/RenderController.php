<?php

namespace Cinematics\Controllers;


use Cinematics\DatabaseProvider;
use Silex\ControllerCollection;
use Silex\Route;

class RenderController
{
    private $router;
    private $twig;

    function __construct(ControllerCollection $router, \Twig_Environment $twig)
    {
        $this->router = $router;
        $this->twig = $twig;
        $this->initRoutes();
    }

    /**
     * @return ControllerCollection
     */
    public function getRouter() {
        return $this->router;
    }

    private function initRoutes() {
        $this->router->get('/', function(){
            return $this->twig->render('main.html.twig');
        });

        $this->router->get('/admin', function(){
            return $this->twig->render('admin.main.twig');
        });
    }

}