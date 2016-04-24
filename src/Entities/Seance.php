<?php

namespace Cinematics\Entities;

use Cinematics\Entities\Hall;
use Cinematics\Entities\Movie;
use DateTime;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToMany;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\Table;

/** @Entity(repositoryClass="Cinematics\Repositories\SeanceRepository")
 * @Table(name="seances")
 */
class Seance
{
    /** @Id @Column(type="integer")
     * @GeneratedValue
     */
    private $id;

    /** @Column(type="integer") */
    private $price;

    /** @ManyToOne(targetEntity="Hall")
     * @JoinColumn(name="hall_id", referencedColumnName="id")
     */
    private $hall;

    /** @ManyToOne(targetEntity="Movie")
     * @JoinColumn(name="movie_id", referencedColumnName="id")
     */
    private $movie;

    /** @Column(type="datetime") */
    private $date;


    public function __construct(Movie $movie, Hall $hall, $price, Datetime $date)
    {
        $this->movie = $movie;
        $this->hall = $hall;
        $this->price = $price;
        $this->date = $date;
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return mixed
     */
    public function getDate() : \DateTime
    {
        return $this->date;
    }

    /**
     * @param mixed $date
     */
    public function setDate($date)
    {
        $this->date = $date;
    }

    /**
     * @return mixed
     */
    public function getMovie() : Movie
    {
        return $this->movie;
    }

    /**
     * @param mixed $movie
     */
    public function setMovie(Movie $movie)
    {
        $this->movie = $movie;
    }

    /**
     * @return mixed
     */
    public function getPrice()
    {
        return $this->price;
    }

    /**
     * @param mixed $price
     */
    public function setPrice($price)
    {
        $this->price = $price;
    }

    /**
     * @return mixed
     */
    public function getHall() : Hall
    {
        return $this->hall;
    }

    /**
     * @param mixed $hall
     */
    public function setHall(Hall $hall)
    {
        $this->hall = $hall;
    }

}