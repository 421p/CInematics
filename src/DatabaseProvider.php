<?php

namespace Cinematics;

use Cinematics\Entities\Hall;
use Cinematics\Entities\Movie;
use Cinematics\Entities\Seance;
use Cinematics\Entities\SeatType;
use Cinematics\Repositories\MovieRepository;
use Cinematics\Repositories\SeanceRepository;
use DateTime;
use Doctrine;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Tools\Setup;

class DatabaseProvider
{

    private $doctrine;
    private $em;

    /**
     * @var MovieRepository
     */
    private $movieRepository;

    /** @var  SeanceRepository */
    private $seanceRepository;

    function __construct($dbParams)
    {
        $config = Setup::createAnnotationMetadataConfiguration([__DIR__ . '/Entities'], true);
        $this->em = EntityManager::create($dbParams, $config);;
        $this->movieRepository = $this->em->getRepository(Movie::class);
        $this->seanceRepository = $this->em->getRepository(Seance::class);
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
        /** @var Seance $seance */
        $seance = $this->em->find(Seance::class, intval($id));

        return [
            'prices' => $this->seanceRepository->getSeancePrices($seance),
            'seats' => $this->seanceRepository->getSeanceInfo($seance)
        ];

//        $seats = $this->doctrine->fetchAll('call getSeanceInfo(?);', [$id]);
//        $prices = $this->doctrine->fetchAll('call getSeancePrices(?);', [$id]);
//
//        array_walk($seats, function (&$current) {
//            $current['isFree'] = $current['isFree'] > 0;
//        });
//        //var_dump($data);
//
//        return [
//            'prices' => $prices,
//            'seats' => $seats
//        ];

    }


    function getSeancesBetweenDates(DateTime $from, DateTime $to) : array
    {
        $queryResults = $this->em->createQueryBuilder()
            ->select('s')
            ->from(Seance::class, 's')
            ->where('s.date between ?0 and ?1')
            ->setParameters([$from, $to])
            ->getQuery()->getResult();

        return from($queryResults)
            ->select(function (Seance $s) : Movie {
                return $s->getMovie();
            })
            ->distinct(function (Movie $m) {
                return $m->getId();
            })->select(function (Movie $movie) use ($queryResults) {

                return array_merge($movie->jsonSerialize(), [
                    'Sessions' =>
                        from($queryResults)->where(function (Seance $s) use ($movie) {
                            return $s->getMovie()->getId() === $movie->getId();
                        })
                            ->select(function (Seance $s) {
                                return [
                                    'SeanceID' => $s->getId(),
                                    'Hall' => $s->getHall()->getId(),
                                    'Session' => $s->getDate()->format('Y-m-d H:i'),
                                    'Price' => round($s->getPrice(), 2)
                                ];
                            })->toList()
                ]);
            })->toArray();
    }

}