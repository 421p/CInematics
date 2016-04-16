<?php

namespace Cinematics\Controllers;

use Cinematics\DatabaseProvider;
use DateTime;
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
            return new JsonResponse($this->model->getHallsInfo());
        });

        $this->router->get('/halls/{id}', function($id) {
            return new JsonResponse($this->model->getHallsInfo($id));
        });

        $this->router->get('/seances/{id}', function($id) {
            return new JsonResponse($this->model->getSeanceInfo($id));
        });

        $this->router->get('/seances/{from}/{to}', function($from, $to) {

            $dateFrom = null;
            $dateTo = null;

            try {
                $dateFrom = new DateTime($from);
                $dateTo = new DateTime($to);
            } catch (\Exception $e) {
                throw new \Exception("Can't parse string to date");
            }

            return new JsonResponse($this->model->getSeancesBetweenDates($dateFrom, $dateTo));
        });

        $this->router->get('/movies', function() {
            return new JsonResponse($this->model->getMovies());
        });
    }
}