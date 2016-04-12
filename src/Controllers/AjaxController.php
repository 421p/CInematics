<?php

namespace Cinematics\Controllers;

use Cinematics\DatabaseProvider;
use Silex\ControllerCollection;
use Symfony\Component\HttpFoundation\JsonResponse;
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
        $this->router->get('/', function() {
            return json_encode([
                'Api Version' => '0.0.3',
                'Author' => 'Mykola Prokopenko'
            ]);
        });

        $this->router->post('/add/movie', function(Request $request) {
            $data = json_decode(urldecode($request->getQueryString()), true);
            return new JsonResponse(['what' => $this->model->addMovie($data)]);
        });

        $this->router->post('/add/seance', function(Request $request) {
            $data = json_decode(urldecode($request->getQueryString()), true);
            return new JsonResponse(['what' => $this->model->addSeance($data)]);
        });

        $this->router->post('/add/ticket', function(Request $request) {
            $data = json_decode(urldecode($request->getQueryString()), true);
            return new JsonResponse(['what' => $this->model->sellTicket($data)]);
        });

        $this->router->get('/json', function(Request $request) {
            $arr = json_decode(urldecode($request->getQueryString()), true);
            return new JsonResponse($arr);
        });

        $this->router->get('/halls', function() {
            return new JsonResponse($this->model->getHallsInfo(), JSON_NUMERIC_CHECK);
        });

        $this->router->get('/halls/{name}', function($name) {
            return new JsonResponse($this->model->getHallsInfo($name), JSON_NUMERIC_CHECK);
        });

        $this->router->get('/seances/{id}', function($id) {
            return new JsonResponse($this->model->getSeanceInfo($id), JSON_NUMERIC_CHECK);
        });

        $this->router->get('/seances/{from}/{to}', function($from, $to) {
            return new JsonResponse($this->model->getSeancesBetweenDates($from, $to), JSON_NUMERIC_CHECK);
        });

        $this->router->get('/movies', function() {
            return new JsonResponse($this->model->getMovies());
        });
    }
}