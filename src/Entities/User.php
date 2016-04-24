<?php


namespace Cinematics\Entities;

use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Table;

/** @Entity
 * @Table(name="users")
 */
class User
{
    /** @Id @Column(type="integer")
     * @GeneratedValue
     */
    private $id;

    /** @Column(type="string") */
    private $name;

    /** @Column(type="string", name="api_key") */
    private $apiKey;

    /** @Column(type="string", name="password") */
    private $passwordHash;

    /** @Column(type="integer", name="role_id") */
    private $role;

    public function __construct($name, $password, $role)
    {
        $this->name = $name;

        $this->salt = md5(random_bytes(22));

        $this->passwordHash = password_hash($password, PASSWORD_BCRYPT, [
            'salt' => $this->salt
        ]);

        $this->setRole($role);

        $this->apiKey = md5(random_bytes(12));
    }

    public function getId() : int
    {
        return $this->id;
    }

    public function getName() : string
    {
        return $this->name;
    }

    public function setName(string $name)
    {
        $this->name = $name;
    }

    public function getApiKey() : string
    {
        return $this->apiKey;
    }

    public function setApiKey(string $apiKey)
    {
        $this->apiKey = $apiKey;
    }

    public function getSalt() : string
    {
        return $this->salt;
    }

    public function setSalt(string $salt)
    {
        $this->salt = $salt;
    }

    public function getPasswordHash()
    {
        return $this->passwordHash;
    }


    public function getRole()
    {
        switch ($this->role) {
            case 1 :
                return 'user';
            case 11 :
                return 'moderator';
            case 21 :
                return 'admin';
        }
    }

    public function setRole($role)
    {
        if (!in_array($role, ['user', 'moderator', 'admin'])) {
            throw new \InvalidArgumentException('Wrong role');
        }

        switch ($role) {
            case 'user' :
                $this->role = 1;
                break;
            case 'moderator' :
                $this->role = 11;
                break;
            case 'admin' :
                $this->role = 21;
                break;
        }
    }
}