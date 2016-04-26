<?php

namespace Cinematics\Socials;

use League\OAuth2\Client\Provider\Facebook as FacebookProvider;
use League\OAuth2\Client\Provider\FacebookUser;

class Facebook extends FacebookProvider
{
    private $token;

    public function __construct($args)
    {
        parent::__construct($args);

    }

    public function createToken(string $code)
    {
        $this->token = parent::getAccessToken(
            'authorization_code',
            [
                'code' => $code,
            ]
        );
    }

    public function getToken()
    {
        return $this->token;
    }

    public function getUser() : FacebookUser
    {
        return parent::getResourceOwner($this->token);
    }
}