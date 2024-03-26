follow these instructions to get postgres running and available to connect via docker

1. `docker run --name [some-name] -e POSTGRES_PASSWORD=[some-password] -d -p 5432:5432 postgres`
2. Install psql on your local machine (on mac, this is via `brew install libpq`)
3. Get interactive shell on your postgres container and confirm the credentials work
   1. `docker exec -it [container_id] bash`
   2. `psql -U [some-name]`
   3. If you have a successful connection, the following command will work: `CREATE DATABASE mytest`
   4. `\q` to exit the psql prompt, `exit` to leave the interactive terminal
4. Connect via psql on your machine: `psql -h localhost -p 5432 -U postgres`
   1. If you do not specify the host, psql will go looking for a socket file in your /tmp dir, which is where pg running _on your bare metal_ would put the link to connect
   2. You'll be prompted for your password, enter your `[some-password]`
   3. You should then be given the psql prompt, from where you can try to list all tables `\l`
5. Ensure the credentials in your server.ts file on the backend are properly specified. If they are, no errors should be thrown