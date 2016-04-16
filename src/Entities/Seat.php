<?php

namespace Cinematics\Entities;

use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\Table;

/** @Entity
 * @Table(name="mappedhalls")
 */
class Seat
{

    /** @Id @Column(type="integer")
     * @GeneratedValue
     */
    private $id;

    /** @Column(type="integer") */
    private $row;

    /** @Column(type="integer") */
    private $seat;

    /** @Column(type="integer") */
    private $index;

    /** @ManyToOne(targetEntity="Hall")
     * @JoinColumn(name="hall_id", referencedColumnName="id")
     */
    private $hall;

    /** @ManyToOne(targetEntity="SeatType")
     * @JoinColumn(name="type", referencedColumnName="id")
     */
    private $type;

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
    public function getHall() : Hall
    {
        return $this->hall;
    }

    /**
     * @param mixed $hall
     */
    public function setHall($hall)
    {
        $this->hall = $hall;
    }

    /**
     * @return mixed
     */
    public function getIndex()
    {
        return $this->index;
    }

    /**
     * @param mixed $index
     */
    public function setIndex($index)
    {
        $this->index = $index;
    }

    /**
     * @return mixed
     */
    public function getSeat()
    {
        return $this->seat;
    }

    /**
     * @param mixed $seat
     */
    public function setSeat($seat)
    {
        $this->seat = $seat;
    }

    /**
     * @return mixed
     */
    public function getRow()
    {
        return $this->row;
    }

    /**
     * @param mixed $row
     */
    public function setRow($row)
    {
        $this->row = $row;
    }

    /**
     * @return mixed
     */
    public function getType() : SeatType
    {
        return $this->type;
    }

    /**
     * @param mixed $type
     */
    public function setType($type)
    {
        $this->type = $type;
    }


}