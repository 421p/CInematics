<?php

namespace Cinematics\Entity;

use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\OneToOne;
use Doctrine\ORM\Mapping\Table;

/** @Entity
 * @Table(name="movies")
 */
class Movie implements \JsonSerializable
{

    /** @Id @Column(type="integer") */
    private $id;

    /** @Column(type="string") */
    private $name;

    /** @OneToOne(targetEntity="Category")
     * @JoinColumn(name="cat_id", referencedColumnName="id")
     */
    private $category;

    /** @Column(type="string") */
    private $description;

    /** @Column(type="string", name="youtube_link") */
    private $youtubeLink;

    /** @Column(type="string") */
    private $year;

    /** @Column(type="string") */
    private $language;

    /** @Column(type="string") */
    private $country;

    /** @Column(type="string") */
    private $budget;

    /** @Column(type="string") */
    private $time;

    /** @Column(type="string") */
    private $genres;

    /** @Column(type="string") */
    private $actors;

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
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param mixed $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * @return mixed
     */
    public function getActors()
    {
        return $this->actors;
    }

    /**
     * @param mixed $actors
     */
    public function setActors($actors)
    {
        $this->actors = $actors;
    }

    /**
     * @return mixed
     */
    public function getGenres()
    {
        return $this->genres;
    }

    /**
     * @param mixed $genres
     */
    public function setGenres($genres)
    {
        $this->genres = $genres;
    }

    /**
     * @return mixed
     */
    public function getCountry()
    {
        return $this->country;
    }

    /**
     * @param mixed $country
     */
    public function setCountry($country)
    {
        $this->country = $country;
    }

    /**
     * @return mixed
     */
    public function getTime()
    {
        return $this->time;
    }

    /**
     * @param mixed $time
     */
    public function setTime($time)
    {
        $this->time = $time;
    }

    /**
     * @return mixed
     */
    public function getLanguage()
    {
        return $this->language;
    }

    /**
     * @param mixed $language
     */
    public function setLanguage($language)
    {
        $this->language = $language;
    }

    /**
     * @return mixed
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param mixed $description
     */
    public function setDescription($description)
    {
        $this->description = $description;
    }

    /**
     * @return mixed
     */
    public function getCategory()
    {
        return $this->category;
    }

    /**
     * @param mixed $category
     */
    public function setCategory($category)
    {
        $this->category = $category;
    }

    /**
     * @return mixed
     */
    public function getBudget()
    {
        return $this->budget;
    }

    /**
     * @param mixed $budget
     */
    public function setBudget($budget)
    {
        $this->budget = $budget;
    }

    /**
     * @return mixed
     */
    public function getYoutubeLink()
    {
        return $this->youtubeLink;
    }

    /**
     * @param mixed $youtubeLink
     */
    public function setYoutubeLink($youtubeLink)
    {
        $this->youtubeLink = $youtubeLink;
    }

    /**
     * @return mixed
     */
    public function getYear()
    {
        return $this->year;
    }

    /**
     * @param mixed $year
     */
    public function setYear($year)
    {
        $this->year = $year;
    }

    function jsonSerialize()
    {
        return [
            'MovieID' => $this->id,
            'Category' => $this->category->getName(),
            'Title' => $this->name,
            'Year' => $this->year,
            'Country' => $this->country,
            'Genre' => $this->genres,
            'Budget' => $this->budget,
            'Time' => $this->time,
            'Lang' => $this->language,
            'Actors' => $this->actors,
            'About' => $this->description,
            'Video' => $this->youtubeLink
        ];
    }
}