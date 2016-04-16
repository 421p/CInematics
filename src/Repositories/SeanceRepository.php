<?php

namespace Cinematics\Repositories;

use Cinematics\Entities\Seance;
use Cinematics\Entities\Seat;
use Cinematics\Entities\SeatType;
use Cinematics\Entities\Ticket;
use Doctrine\ORM\EntityRepository;

class SeanceRepository extends EntityRepository
{
    public function getSeancePrices(Seance $seance)
    {
        return from($this->_em->createQueryBuilder()
            ->select('st')
            ->from(SeatType::class, 'st')
            ->where('st.name != ?0')
            ->setParameters(['default'])
            ->getQuery()->getResult())->select(function (SeatType $st) use ($seance) {
            return $seance->getPrice() * $st->getCoef();
        })->toList();
    }

    public function getSeanceInfo(Seance $seance) : array
    {

        $seats = $this->_em->createQueryBuilder()
            ->select('seat')
            ->from(Seat::class, 'seat')
            ->innerJoin(Seance::class, 'seance')
            ->where('seance = ?0')
            ->setParameters([$seance])
            ->getQuery()->getResult();

        return from($seats)->select(function (Seat $seat) use ($seance) {
            return [
                'row' => $seat->getRow(),
                'seat' => $seat->getSeat(),
                'index' => $seat->getIndex(),
                'type' => $seat->getType()->getName(),
                'isFree' => intval($this->_em->createQueryBuilder()->select('count(t)')
                    ->from(Ticket::class, 't')
                    ->where('t.seance = ?0')
                    ->andWhere('t.seat = ?1')
                    ->setParameters([$seance, $seat])
                    ->getQuery()->getResult()[0][1]) === 0 ? true : false
            ];
        })->toList();
    }
}