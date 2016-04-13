<?php

namespace Cinematics;

use Cinematics\Repositories\MovieRepository;
use Doctrine;
use Doctrine\ORM\Tools\Setup;
use Doctrine\ORM\EntityManager;

use Cinematics\Entities\Hall;
use Cinematics\Entities\Movie;

class DatabaseProvider
{

    private $doctrine;
    private $em;

    /**
     * @var MovieRepository
     */
    private $movieRepository;

    function __construct($dbParams)
    {
        $config = Setup::createAnnotationMetadataConfiguration([__DIR__ . '/Entities'], true);
        $this->em = EntityManager::create($dbParams, $config);;
        $this->movieRepository = $this->em->getRepository(Movie::class);
    }


    /**
     * @param array $ticket
     * @return string
     */
    function sellTicket(array $ticket) : string
    {
        try {
            $this->doctrine->executeUpdate("
                call sellTicket(?,?);
            ", [
                $ticket['SeanceId'], //int
                $ticket['SeatIndex'] // int
            ]);
        } catch (\Throwable $e) {
            return $e->getMessage();
        }

        return 'success';
    }


    /**
     * @param $seance array
     * @return string result
     */
    function addSeance(array $seance) : string
    {

        try {
            $this->doctrine->executeUpdate("
            call addSeance(?,?,?,?);
        ", [
                $seance['Hall'], //string
                $seance['Movie'], //string
                $seance['Price'], //decimal
                $seance['Date'] //string
            ]);
        } catch (\Exception $e) {
            return $e->getMessage();
        }

        return 'success';

    }

    /**
     * @param $movie array
     * @return string result
     */
    function addMovie(array $movie) : string
    {

        try {
            $this->doctrine->executeUpdate("

            call addMovie(?,?,?,?,?,?,?,?,?,?,?);

        ", [
                $movie['Title'],
                $movie['Category'],
                $movie['About'],
                $movie['Video'],
                $movie['Year'],
                $movie['Lang'],
                $movie['Country'],
                $movie['Budget'],
                $movie['Time'],
                $movie['Genre'],
                $movie['Actors']
            ]);
        } catch (\Exception $e) {
            return $e->getMessage();
        }

        return 'success';

    }


    /**
     * @param null $id
     * @return mixed
     */
    function getHallsInfo($id = null)
    {
        return $id != null ?

            $this->em->find(Hall::class, $id) :
            $this->em->createQueryBuilder()
                ->select('h')
                ->from(Hall::class, 'h')
                ->getQuery()
                ->getResult();
    }

    /**
     * @return array
     */
    function getMovies() : array
    {
        $movieRep = $this->em->getRepository(Movie::class);

        return $movieRep->getAll();

//        return $this->em->createQueryBuilder()
//            ->select('m')
//            ->from(Movie::class, 'm')
//            ->getQuery()
//            ->getResult();
    }

    /**
     * @param $id string
     * @return array
     */
    function getSeanceInfo($id) : array
    {

        $seats = $this->doctrine->fetchAll('call getSeanceInfo(?);', [$id]);
        $prices = $this->doctrine->fetchAll('call getSeancePrices(?);', [$id]);

        array_walk($seats, function (&$current) {
            $current['isFree'] = $current['isFree'] > 0;
        });
        //var_dump($data);

        return [
            'prices' => $prices,
            'seats' => $seats
        ];

    }


    /**
     * @param $from string
     * @param $to string
     * @return array of seances
     */
    function getSeancesBetweenDates(string $from, string $to) : array
    {

        $results = $this->doctrine->fetchAll("call getSeancesExtended(?, ?);", [$from, $to]);

        $seances = $this->doctrine->fetchAll("call getSeances(?, ?);", [$from, $to]);


        array_walk($results, function (&$current) use ($seances) {

            $moviesArray = explode(',', $current['Sessions']);
            $current['Sessions'] = [];

            foreach ($moviesArray as $movieID) {
                foreach ($seances as $seance) {
                    if ($seance['id'] == $movieID) {
                        $current['Sessions'][] = [
                            'SeanceID' => $seance['id'],
                            'Hall' => $seance['hall'],
                            'Session' => $seance['date'],
                            'Price' => round($seance['price'], 2)
                        ];
                    }
                }
            }
        });


        return $results;
    }

}