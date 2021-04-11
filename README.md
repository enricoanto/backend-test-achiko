# backend-test-achiko

1. start nodemon app.js
2. '/register',
    request:
    - body: 
            {
                username: 'string',
                password: 'string',
            }
    response:
    - status (201)
    1
    - status (400)
            {
                name: 'Bad Request',
                msg: 'Username Already exist'
            }

3. '/login',
    request:
    - body: 
            {
                username: 'string',
                password: 'string',
            }
    response:
    - status (201)
            {
                access_token: 'string'
            }
    - status (401)
            {
                name: 'Unauthorized',
                msg: 'username and password failed'
            }
4. copy access_token to headers
        access_token: 'string'
5. '/profil',
    request:
    - headers:
    access_token: 'string'
    response:
    - status (200) 
             {
                username: 'string',
                password: 'string',
            }

