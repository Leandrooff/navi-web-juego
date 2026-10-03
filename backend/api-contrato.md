# Contrato inicial de API

Este contrato sirve para que frontend y backend trabajen sin esperar a que todo este listo.

## Autenticacion

```text
POST /api/login
POST /api/logout
GET /api/me
```

## Cuentos

```text
GET /api/stories
GET /api/stories/{id}
```

## Partidas

```text
POST /api/game-sessions
POST /api/game-sessions/{id}/decisions
POST /api/game-sessions/{id}/finish
```

## Perfiles infantiles

```text
GET /api/child-profiles
POST /api/child-profiles
```

## Reportes

```text
GET /api/reports/children/{id}
GET /api/reports/groups/{id}
```

