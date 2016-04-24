<?php

namespace Cinematics\Repositories;

use Cinematics\Entities\Seance;
use Cinematics\Entities\Seat;
use Cinematics\Entities\SeatType;
use Cinematics\Entities\Ticket;
use Doctrine\ORM\EntityRepository;
use YaLinqo\Enumerable;

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
            ->where('seance.id = ?0')
            ->andWhere('seance.hall = seat.hall')
            ->setParameters([$seance->getId()])
            ->getQuery()->getResult();

        $ticketsInfo = $this->getTicketsForSeance($seance)->select(function(Ticket $ticket){
            return $ticket->getSeat();
        })->toList();

        return from($seats)->select(function (Seat $seat) use ($seance, $ticketsInfo) {
            return [
                'row' => $seat->getRow(),
                'seat' => $seat->getSeat(),
                'index' => $seat->getIndex(),
                'type' => $seat->getType()->getName(),
                'isFree' => !in_array($seat->getSeat(), $ticketsInfo)
            ];
        })->toList();
    }

    public function getTicketsForSeance(Seance $seance) : Enumerable{
        return from(
            $this->_em->createQueryBuilder()
                ->select('t')
                ->from(Ticket::class, 't')
                ->innerJoin(Seance::class, 's')
                ->where('s.id = ?0')
                ->setParameters([$seance->getId()])
                ->getQuery()->getResult()
        );
    }
}