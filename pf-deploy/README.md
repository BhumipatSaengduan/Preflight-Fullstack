# Note: This version assumes that there is only one instance of the app on VM.

If you plan to deploy multiple instances of the app on the same VM, see `server` branch.

# Get started

- Make `.env` from `.env.example`
- Change `image` names in `docker-compose.yml`
- `docker compose up -d --force-recreate`

# Setup database

- `docker exec -it pf-db bash`
- `psql -U postgres -d mydb`
- Don't forget to change the password.

```
REVOKE CONNECT ON DATABASE mydb FROM public;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
CREATE USER appuser WITH PASSWORD '1234';
CREATE SCHEMA drizzle;
GRANT ALL ON DATABASE mydb TO appuser;
GRANT ALL ON SCHEMA public TO appuser;
GRANT ALL ON SCHEMA drizzle TO appuser;
```

- `docker exec -it pf-backend sh`
- `npm run db:generate`
- `npm run db:migrate`
