## Etap 1 – Frontend React + konteneryzacja (Docker)

Tutaj stworzyłem prosta apkę tylko na froncie. 

### Funkcjonalność aplikacji
- Górny pasek z logo **training-app**
- Ekran startowy:
  - przycisk **+**
  - tekst **add session**
  - licznik **Succesfull sessions: X**
- Po rozpoczęciu sesji:
  - losowana jest liczba kliknięć od **5 do 20**
  - użytkownik musi kliknąć dokładnie wskazaną liczbę razy
  - po sukcesie pojawia się komunikat **Success!**
  - aplikacja wraca do ekranu głównego i zwiększa licznik sesji

### Architektura etapu
Na tym etapie projekt składa się wyłącznie z warstwy frontendowej:



### Konteneryzacja
skonteneryzowana przy użyciu Dockera.

Proces budowania:
1. Budowanie aplikacji w obrazie Node.js
2. Serwowanie statycznych plików przy pomocy **nginx**

Pliki kluczowe:
- `frontend/Dockerfile`

### Uruchomienie lokalne

```bash
cd frontend
npm install
npm run dev

 ### uruchomienie w dokerze 

cd frontend
docker build -t training-frontend .
docker run -p 8081:80 training-frontend  (dałem 8081 bo mam 8080 zajęte)
