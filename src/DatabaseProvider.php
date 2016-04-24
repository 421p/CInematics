<?php

namespace Cinematics;

use Cinematics\Entities\Category;
use Cinematics\Entities\Hall;
use Cinematics\Entities\Movie;
use Cinematics\Entities\Seance;
use Cinematics\Entities\Ticket;
use Cinematics\Entities\User;
use Cinematics\Repositories\MovieRepository;
use Cinematics\Repositories\SeanceRepository;
use DateTime;
use Doctrine;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Tools\Setup;
use Symfony\Component\HttpKernel\Exception\HttpException;

class DatabaseProvider
{

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

    function sellTicket(array $data) : string
    {

        if (null === $seance = $this->seanceRepository->findOneBy(['id' => $data['SeanceId']])) {
            throw new HttpException(404, 'No such seance');
        }

        if (null === $seat = intval($data['SeatIndex'])) {
            throw new HttpException(400, 'Empty seat, really?');
        }

        $ticketsInfo = $this->seanceRepository->getTicketsForSeance($seance)
            ->select(function (Ticket $ticket) {
                return $ticket->getSeat();
            })->toList();

        if (in_array($seat, $ticketsInfo)) {
            throw new HttpException(403, 'Seat is not free.');
        }

        /** @var Seance $seance */
        $ticket = new Ticket($seance, $seat);

        $this->em->persist($ticket);
        $this->em->flush();

        return 'success';
    }

    function addSeance(array $data) : string
    {

        /** @var Hall $hall */
        if (null === $hall = $this->em->find(Hall::class, $data['Hall'])) {
            throw new HttpException(404, 'no such hall');
        }

        /** @var Movie $movie */
        if (null === $movie = $this->em->find(Movie::class, $data['Movie'])) {
            throw new HttpException(404, 'no such movie');
        }

        if (null === $price = $data['Price']) {
            throw new HttpException(400, 'Parameter price does not set.');
        }


        if (null === $date = new DateTime($data['Date'])) {
            throw new HttpException(400, 'no date set');
        }

        $seance = new Seance($movie, $hall, $price, $date);

        $this->em->persist($seance);
        $this->em->flush();

        return 'success';

    }

    public function addMovie(array $data) : string
    {

        /** @var Category $category */
        $category = current(
            $this->em->createQueryBuilder()
                ->select('c')
                ->from(Category::class, 'c')
                ->where('c.name = ?0')
                ->setParameters([$data['Category']])
                ->getQuery()->getResult()
        );

        if (null === $title = $data['Title']) {
            throw new HttpException(400, 'Parameter title does not set.');
        };
        if (null === $about = $data['About']) {
            throw new HttpException(400, 'Parameter about does not set.');
        };
        if (null === $video = $data['Video']) {
            throw new HttpException(400, 'Parameter video does not set.');
        };
        if (null === $year = $data['Year']) {
            throw new HttpException(400, 'Parameter year does not set.');
        };
        if (null === $lang = $data['Lang']) {
            throw new HttpException(400, 'Parameter lang does not set.');
        };
        if (null === $country = $data['Country']) {
            throw new HttpException(400, 'Parameter country does not set.');
        };
        if (null === $budget = $data['Budget']) {
            throw new HttpException(400, 'Parameter budget does not set.');
        };
        if (null === $time = $data['Time']) {
            throw new HttpException(400, 'Parameter time does not set.');
        };
        if (null === $genre = $data['Genre']) {
            throw new HttpException(400, 'Parameter genre does not set.');
        };
        if (null === $actors = $data['Actors']) {
            throw new HttpException(400, 'Parameter actors does not set.');
        };

        if (null !== $this->movieRepository->findOneBy(['name' => $title])) {
            throw new \Exception('Movie already exists.');
        }

        $movie = new Movie(
            $category,
            $title,
            $year,
            $country,
            $genre,
            $budget,
            $time,
            $lang,
            $actors,
            $about,
            $video
        );

        $this->em->persist($movie);
        $this->em->flush();

        return 'success';

    }


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

    function getMovies() : array
    {
        return $this->em->getRepository(Movie::class)->getAll();
    }

    function getSeanceInfo($id) : array
    {
        /** @var Seance $seance */
        $seance = $this->em->find(Seance::class, intval($id));

        return [
            'prices' => $this->seanceRepository->getSeancePrices($seance),
            'seats' => $this->seanceRepository->getSeanceInfo($seance)
        ];

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

    public function getEntityManager()
    {
        return $this->em;
    }

    public function assertApiKey(string $key, string $level)
    {
        /** @var User $user */
        $user = current(
            $this->em->createQueryBuilder()
                ->select('u')
                ->from(User::class, 'u')
                ->where('u.apiKey = ?0')
                ->setParameters([$key])
                ->getQuery()
                ->getResult()
        );

        if (!$user) {
            throw new HttpException(403, 'no api key found');
        }

        if ($user->getRole() !== $level) {
            throw new HttpException(401, 'cannot access');
        }
    }

    public function restLogin(array $params)
    {
        /** @var User $user */
        $user = current(
            $this->em->createQueryBuilder()
                ->select('u')
                ->from(User::class, 'u')
                ->where('u.name = ?0')
                ->setParameters([$params['username']])
                ->getQuery()
                ->getResult()
        );

        if (!$user) {
            throw new HttpException(401, 'wrong username or password.');
        }

        if (password_verify($params['password'], $user->getPasswordHash())) {
            return ['apiKey' => $user->getApiKey()];
        } else {
            throw new HttpException(401, 'wrong username or password.');
        }
    }

}