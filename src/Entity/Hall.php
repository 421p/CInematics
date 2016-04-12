<?php

namespace Cinematics\Entity;

use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Table;
use JsonSerializable;

/**
 * @Entity
 * @Table(name="halls")
 */
class Hall implements JsonSerializable
{
    /** @Id @Column(type="integer")
     * @GeneratedValue
     */

    private $id;

    /** @Column(type="string") */
    private $name;

    /** @Column(type="integer") */
    private $size;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * @return int
     */
    public function getSize() : int
    {
        return $this->size;
    }

    /**
     * @param int $size
     */
    public function setSize(int $size)
    {
        $this->size = $size;
    }

    function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'size' => $this->size
        ];
    }
}