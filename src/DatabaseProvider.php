<?php

namespace Cinematics;

use Doctrine;

class DatabaseProvider
{

    private $doctrine;

    function __construct($connectionString)
    {
        $configuration = new Doctrine\DBAL\Configuration();
        $this->doctrine = Doctrine\DBAL\DriverManager::getConnection([
            'url' => $connectionString
        ], $configuration);
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
     * @param null $name
     * @return array
     */
    function getHallsInfo($name = null)
    {

        return $name == null ?
            $this->doctrine->fetchAll('SELECT * FROM halls;') : $this->doctrine->fetchAll('SELECT * FROM halls WHERE id = ?', [$name]);
    }

    /**
     * @return array
     */
    function getMovies() : array
    {
        return $this->doctrine->fetchAll('call getMovies();');
    }

    /**
     * @param $id string
     * @return array
     */
    function getSeanceInfo($id) : array
    {

        $seats = $this->doctrine->fetchAll('call getSeanceInfo(?);', [$id]);
        $prices = $this->doctrine->fetchAll('call getSeancePrices(?);', [$id]);


//        $data = json_decode($json, true);
//
//        $light = 11;
//        $heavy = 21;
//        $iterator = 0;
//
//        foreach($data as $row){
//            $iterator++;
//            $statement = $this->pdo->prepare("insert into mappedHalls(row, seat, `index`, type, hall_id) values (?,?,?,?,?);");
//            $statement->execute([$row['row'], $row['col'], $iterator, $row['type'] == 'Легковик' ? $light : $heavy, 2]);
//            var_dump($statement->errorInfo());
//        }
        array_walk($seats, function(&$current) {
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


        array_walk($results, function(&$current) use ($seances) {

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