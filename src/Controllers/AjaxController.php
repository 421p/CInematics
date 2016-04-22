<?php

namespace Cinematics\Controllers;

use Cinematics\DatabaseProvider;
use Cinematics\Entities\User;
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
    public function getRouter()
    {
        return $this->router;
    }

    private function initRoutes()
    {
        $this->router->get('/', function () {
            return json_encode([
                'Api Version' => '0.0.3',
                'Author' => 'Mykola Prokopenko'
            ]);
        });

        $this->router->post('/rest_login', function (Request $request) {
            return new JsonResponse($this->model->restLogin($request->request->all()));
        });

        $this->router->post('/add/movie', function (Request $request) {

            $apiKey = $request->headers->get('Cinematics-Api-Key');;
            $this->model->assertApiKey($apiKey, 'admin');

            $data = $request->request->all();

            return new JsonResponse(['what' => $this->model->addMovie($data)]);
        });

        $this->router->post('/add/seance', function (Request $request) {

            $apiKey = $request->headers->get('Cinematics-Api-Key');;
            $this->model->assertApiKey($apiKey, 'admin');

            $data = $request->request->all();

            return new JsonResponse(['what' => $this->model->addSeance($data)]);
        });

        $this->router->post('/add/ticket', function (Request $request) {
            $apiKey = $request->headers->get('Cinematics-Api-Key');;
            $this->model->assertApiKey($apiKey, 'admin');

            $data = $request->request->all();

            return new JsonResponse(['what' => $this->model->sellTicket($data)]);
        });

        $this->router->get('/halls', function () {
            return new JsonResponse($this->model->getHallsInfo());
        });

        $this->router->get('/halls/{id}', function ($id) {
            return new JsonResponse($this->model->getHallsInfo($id));
        });

        $this->router->get('/seances/{id}', function ($id) {
            return new JsonResponse($this->model->getSeanceInfo($id));
        });

        $this->router->get('/seances/{from}/{to}', function ($from, $to) {

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

        $this->router->get('/movies', function () {
            return new JsonResponse($this->model->getMovies());
        });
    }
}