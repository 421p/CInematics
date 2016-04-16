<?php

namespace Cinematics\Repositories;

use Doctrine\ORM\EntityRepository;
use Cinematics\Entities\Movie;

class MovieRepository extends EntityRepository
{
    public function getAll() {
        return $this->_em->createQueryBuilder()
            ->select('m')
            ->from(Movie::class, 'm')
            ->getQuery()
            ->getResult();
    }
}