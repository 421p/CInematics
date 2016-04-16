<?php

namespace Cinematics\Entities;

use Cinematics\Entity\Seance;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\OneToOne;
use Doctrine\ORM\Mapping\Table;

/** @Entity
 * @Table(name="tickets")
 */

class Ticket
{
    /** @Id @Column(type="integer")
     * @GeneratedValue
     */
    private $id;

    /** @ManyToOne(targetEntity="seances")
     * @JoinColumn(name="seans_id", referencedColumnName="id")
     */
    private $seance;

    /** @OneToOne(targetEntity="mappedhalls")
     * @JoinColumn(name="seat", referencedColumnName="index")
     */
    private $seat;

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
    public function getSeat() : Seat
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
    public function getSeance() : Seance
    {
        return $this->seance;
    }

    /**
     * @param mixed $seance
     */
    public function setSeance($seance)
    {
        $this->seance = $seance;
    }
}