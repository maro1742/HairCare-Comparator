# Instrukcja Deploymentu — HairCare Comparator

Poniżej znajdziesz kroki niezbędne do uruchomienia aplikacji na Netlify oraz podpięcia domeny z dhosting.

## 1. Przygotowanie Projektu (Lokalnie)
Aplikacja jest gotowa do wdrożenia. Dodałem plik `public/_redirects`, który jest wymagany przez Netlify, aby poprawnie obsługiwać routing w aplikacji React (SPA).

## 2. Wdrożenie na Netlify

### Opcja A: Połączenie z GitHub (Zalecane)
1. Zaloguj się na [Netlify](https://app.netlify.com/).
2. Kliknij **"Add new site"** -> **"Import an existing project"**.
3. Wybierz GitHub i wskaż repozytorium projektu.
4. Skonfiguruj ustawienia budowania:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Kliknij **"Deploy site"**.

### Opcja B: Manualny Upload (Drag & Drop)
1. Uruchom w terminalu projektowym: `npm run build`.
2. Po zakończeniu powstanie folder `dist`.
3. Przeciągnij folder `dist` do okna Netlify w zakładce "Sites".

## 3. Konfiguracja Zmiennych Środowiskowych (Environment Variables)
W panelu Netlify przejdź do **Site settings** -> **Environment variables** i dodaj:

| Klucz | Wartość |
| :--- | :--- |
| `VITE_SUPABASE_URL` | `https://svpvqsvqqggvyicvgrys.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_aTPfiOjDJKi9OK9T3KxVkw_JDdeDJht` |

> [!IMPORTANT]
> Klucze te są publiczne (prefix `VITE_`), więc muszą być dostępne dla przeglądarki, aby aplikacja mogła łączyć się z bazą danych.

## 4. Podpięcie Domeny z dhosting

### Krok 1: Dodanie domeny w Netlify
1. W panelu Netlify przejdź do **Site settings** -> **Domain management**.
2. Kliknij **"Add custom domain"** i wpisz swoją domenę.
3. Netlify wyświetli rekordy DNS, które musisz dodać (zazwyczaj są to adresy IP lub CNAME).

### Krok 2: Konfiguracja w dhosting
1. Zaloguj się do panelu dhosting.
2. Przejdź do sekcji **Domeny** -> **Zarządzaj DNS**.
3. Masz dwie drogi:
   - **Zalecana (Netlify DNS):** Zmień serwery DNS na te podane przez Netlify (np. `dns1.p01.nsone.net`). To pozwoli Netlify automatycznie zarządzać certyfikatem SSL.
   - **Alternatywna (Rekordy A/CNAME):**
     1. Edytuj rekord `A` dla `wlosowa.pl` i zmień wartość na: `75.2.60.5`
     2. Dodaj/Edytuj rekord `CNAME` dla `www` (lub `www.wlosowa.pl`) i ustaw wartość na: `wlosowa.netlify.app`

## 5. Certyfikat SSL (HTTPS)
Po poprawnej propagacji DNS (może to zająć do 24h), Netlify automatycznie wygeneruje darmowy certyfikat Let's Encrypt. Status sprawdzisz w sekcji **Domain management** -> **HTTPS**.
