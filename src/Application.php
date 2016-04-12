<?php

namespace Cinematics;

use Cinematics\Controllers\AjaxController;
use Cinematics\Controllers\RenderController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Silex\Application as SilexApplication;
use Symfony\Component\Yaml\Yaml;

class Application extends SilexApplication
{

    private $model;
    private $config;
    private $twig;

    function __construct()
    {
        parent::__construct();
        $this['debug'] = true;
        $this->config = Yaml::parse(file_get_contents(__DIR__ . '/../config/config.yml'));
        $this->model = new DatabaseProvider($this->config['connectionString']);
        $this->twig = new \Twig_Environment(new \Twig_Loader_Filesystem(__DIR__ . '/../www/views'));
        $this->init();
        $this->initRoutes();
    }

    private function init()
    {
        $this->after(function (Request $request, Response $response) {
            $response->headers->set('Access-Control-Allow-Origin', '*');
            $response->headers->set('Access-Control-Allow-Methods', 'GET, POST');
            $response->headers->set('Access-Control-Allow-Headers', 'accept, content-type');
        });
    }

    private function initRoutes()
    {
        $this->mount('/',
            (new RenderController($this['controllers_factory'], $this->twig))->getRouter());
        $this->mount('/ajax',
            (new AjaxController($this['controllers_factory'], $this->model))->getRouter());
    }

}