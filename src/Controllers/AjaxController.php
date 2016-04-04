<?php

namespace Cinematics\Controllers;

use Cinematics\DatabaseProvider;
use Silex\ControllerCollection;
use Silex\Route;
use Symfony\Component\HttpFoundation\Request;

class AjaxController
{
    private $model;
    private $router;

    function __construct(ControllerCollection $router, DatabaseProvider $model)
    {
        $this->model = $model;
        $this->router = $router;
        $this->initRoutes();
    }

    /**
     * @return ControllerCollection
     */
    public function getRouter() {
        return $this->router;
    }

    private function initRoutes()
    {
        $this->router->get('/', function () {
            return json_encode([
                'Api Version' => '0.0.2',
                'Author' => 'Mykola Prokopenko'
            ]);
        });

        $this->router->match('/add/movie', function (Request $request) {
            $data = json_decode(urldecode($request->getQueryString()), true);
            return json_encode(['what' => $this->model->addMovie($data)]);
        });

        $this->router->match('/add/seance', function (Request $request) {
            $data = json_decode(urldecode($request->getQueryString()), true);
            return json_encode(['what' => $this->model->addSeance($data)]);
        });

        $this->router->match('/add/ticket', function (Request $request) {
            $data = json_decode(urldecode($request->getQueryString()), true);
            return json_encode(['what' => $this->model->sellTicket($data)]);
        });

        $this->router->match('/json', function (Request $request) {
            $arr = json_decode(urldecode($request->getQueryString()), true);
            return json_encode($arr);
        });

        $this->router->match('/halls', function () {
            return json_encode($this->model->getHallsInfo(), JSON_NUMERIC_CHECK);
        });

        $this->router->match('/halls/{name}', function ($name) {
            return json_encode($this->model->getHallsInfo($name), JSON_NUMERIC_CHECK);
        });

        $this->router->match('/seances/{id}', function ($id) {
            return json_encode($this->model->getSeanceInfo($id), JSON_NUMERIC_CHECK);
        });

        $this->router->match('/seances/{from}/{to}', function ($from, $to) {
            return json_encode($this->model->getSeancesBetweenDates($from, $to), JSON_NUMERIC_CHECK);
        });

        $this->router->match('/movies', function () {
            return json_encode($this->model->getMovies());
        });
    }
}