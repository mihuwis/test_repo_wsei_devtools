# training-app

Prosta aplikacja webowa do „treningu klikania”, przygotowana jako projekt zaliczeniowy (DevOps).
Projekt jest rozwijany etapami. Aktualnie zawiera frontend (React/Vite) oraz backend (API) z bazą danych PostgreSQL uruchamiane przez Docker Compose.

---

## Jak działa aplikacja

1. Na stronie głównej widoczny jest pasek z logo **training-app**, przycisk **+ add session** oraz licznik:
   **Succesfull sessions: X**
2. Po kliknięciu **+ add session** startuje sesja treningowa:
   - losowana jest liczba kliknięć **X** (od 5 do 20),
   - użytkownik musi kliknąć przycisk dokładnie **X** razy,
   - po sukcesie pojawia się komunikat **Success!**,
   - aplikacja wraca do ekranu głównego i zwiększa licznik udanych sesji.
3. Licznik udanych sesji jest przechowywany w bazie danych **PostgreSQL**, więc pozostaje zachowany po odświeżeniu strony i restarcie kontenerów.

---

## Architektura (Etap 2)

Projekt składa się z 3 serwisów uruchamianych w Docker Compose:

- **frontend**: React (Vite) zbudowany do statycznych plików i serwowany przez **nginx**
- **api**: proste API w Node.js/Express, zapisujące i odczytujące licznik z bazy
- **db**: PostgreSQL (persistencja przez wolumen Docker)

Komunikacja:
- Użytkownik wchodzi na `frontend` (nginx).
- `frontend` proxy’uje zapytania `/api/*` do serwisu `api` po sieci docker-compose.
- `api` łączy się do `db` i zapisuje/odczytuje licznik.

Struktura repo:
```text
training-app/
  frontend/
  api/
  docker-compose.yml
  ```


## Uruchomienie projektu

docker compose up --build

Aplikacja będzie dostępna pod adresem:

   - http://localhost:8081

   Zatrzymanie kontenerów
   docker compose down

   zatrzymanie z usunieciem bazy 
   docker compose down -v

## Testowanie działania 
```bash
   Status kontenerów 
   docker compose ps
```


Healhchek API 
curl http://localhost:8081/api/health

(oczekiwane status:OK)

Sprawdzenie licznika 
curl http://localhost:8081/api/stats

Ta linia jest dodana zeby przetestować git hub actions 