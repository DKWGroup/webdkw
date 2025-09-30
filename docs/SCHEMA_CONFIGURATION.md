# Konfiguracja Schema.org i Danych Strukturalnych - AEO Manifesto Page

## 📋 Przegląd

Strona AEOManifestoPage została w pełni skonfigurowana z kompleksowymi danymi strukturalnymi Schema.org, które poprawiają widoczność w wyszukiwarkach i AI.

## ✅ Zaimplementowane Schema

### 1. **WebsiteSchema**
- Typ: `WebSite`
- Lokalizacja: Główny layout strony
- Zawiera: Informacje o stronie, SearchAction, publisher
- Cel: Podstawowe informacje o witrynie dla Google

### 2. **OrganizationSchema**
- Typ: `Organization`
- Lokalizacja: Główny layout strony
- Zawiera: 
  - Dane firmy (nazwa, logo, kontakt)
  - Adres i lokalizacja
  - Social media links
  - Founder information
  - Contact points
  - Areas of expertise
- Cel: Budowanie autorytetu firmy w Google Knowledge Graph

### 3. **ServiceSchema**
- Typ: `Service`
- Lokalizacja: Główny layout strony
- Zawiera:
  - Nazwa usługi: "Pozycjonowanie AI SEO"
  - Opis usługi
  - Cena: 1500 PLN
  - Provider: WebDKW
  - Area served: Poland
- Cel: Wyświetlanie usługi w wynikach wyszukiwania usług

### 4. **FAQSchema**
- Typ: `FAQPage`
- Lokalizacja: Główny layout strony
- Zawiera: 6 pytań i odpowiedzi o AI SEO
- Pytania:
  1. Czym jest AI SEO i dlaczego jest ważne?
  2. Czy moja strona jest niewidoczna w Google AI Overview?
  3. Jakie efekty biznesowe mogę osiągnąć?
  4. Czy AI SEO zastąpi tradycyjne pozycjonowanie?
  5. Ile kosztuje usługa AI SEO?
  6. Po jakim czasie zobaczę rezultaty?
- Cel: Rich snippets w Google (FAQ accordion)

### 5. **BreadcrumbList Schema**
- Typ: `BreadcrumbList`
- Lokalizacja: Główny layout strony
- Struktura:
  1. Strona główna
  2. Usługi
  3. Pozycjonowanie AI
- Cel: Breadcrumb navigation w wynikach wyszukiwania

### 6. **WebPage Schema**
- Typ: `WebPage`
- Lokalizacja: Główny layout strony
- Zawiera:
  - Szczegółowe informacje o stronie
  - mainEntity (Service)
  - Speakable specification dla asystentów głosowych
- Cel: Kontekst strony dla AI i wyszukiwarek

### 7. **CaseStudy Schema**
- Typ: `CaseStudy`
- Lokalizacja: Sekcja case study (MK Helicopters)
- Zawiera:
  - Headline i opis case study
  - Obraz
  - Autor i publisher
  - Keywords
  - Language: pl-PL
- Cel: Wyświetlanie case study w wynikach wyszukiwania

### 8. **Offer Schema (ItemList)**
- Typ: `ItemList` z `Offer` items
- Lokalizacja: Sekcja pakietów
- Zawiera 2 oferty:
  1. **Lokalny Lider** - 1500 PLN/mies
  2. **Lider Branży** - 3000 PLN/mies
- Każda oferta zawiera:
  - Nazwę i opis
  - Cenę w PLN
  - Availability
  - Seller (WebDKW)
  - itemOffered (Service)
- Cel: Rich snippets dla ofert w Google

### 9. **BlogPosting Schema (ItemList)**
- Typ: `ItemList` z `BlogPosting` items
- Lokalizacja: Sekcja featured articles
- Dynamiczne: Pobiera dane z Supabase
- Zawiera dla każdego artykułu:
  - Headline i description
  - Image
  - Daty publikacji i modyfikacji
  - Author i publisher
  - URL i keywords
- Cel: Rich snippets dla artykułów blogowych

## 🎯 Korzyści SEO

### Dla Google Search:
- ✅ Rich snippets (FAQ, breadcrumbs, offers)
- ✅ Knowledge Graph presence
- ✅ Enhanced search results
- ✅ Better CTR (Click-Through Rate)

### Dla Google AI Overview:
- ✅ Strukturalne dane dla AI
- ✅ FAQ markup dla Q&A
- ✅ Service information dla rekomendacji
- ✅ Organization data dla autorytetu

### Dla innych AI (ChatGPT, Gemini, Perplexity):
- ✅ Czytelna struktura danych
- ✅ Kontekst biznesowy
- ✅ FAQ dla odpowiedzi
- ✅ Speakable content dla asystentów głosowych

## 🧪 Testowanie Schema

### 1. Google Rich Results Test
```
https://search.google.com/test/rich-results
```
Wklej URL: `https://webdkw.net/uslugi/pozycjonowanie-ai`

### 2. Schema Markup Validator
```
https://validator.schema.org/
```
Wklej kod źródłowy strony lub URL

### 3. Google Search Console
- Przejdź do: Search Console → Enhancements
- Sprawdź sekcje:
  - FAQ
  - Breadcrumbs
  - Organization

### 4. Ręczna weryfikacja
Otwórz stronę i sprawdź kod źródłowy (Ctrl+U), szukaj:
```html
<script type="application/ld+json">
```

## 📊 Monitoring

### Co monitorować:
1. **Rich Snippets** - Czy pojawiają się w wynikach wyszukiwania
2. **CTR** - Czy wzrósł po dodaniu schema
3. **Impressions** - Czy zwiększyła się widoczność
4. **AI Citations** - Czy strona jest cytowana przez AI

### Narzędzia:
- Google Search Console
- Google Analytics
- Ahrefs / SEMrush
- Manual testing w ChatGPT, Gemini, Perplexity

## 🔄 Aktualizacje

### Kiedy aktualizować schema:
- ✏️ Zmiana cen pakietów
- ✏️ Dodanie nowych FAQ
- ✏️ Zmiana danych kontaktowych
- ✏️ Nowe case studies
- ✏️ Nowe artykuły blogowe (automatyczne)

### Jak aktualizować:
1. Edytuj odpowiedni komponent schema w `src/components/`
2. Lub edytuj inline schema w `AEOManifestoPage.tsx`
3. Przetestuj zmiany w Rich Results Test
4. Deploy na produkcję

## 🎬 Dodanie Video Schema (Opcjonalne)

Gdy dodasz film pionowy w sekcji hero, dodaj VideoObject schema:

```typescript
<Helmet>
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": "Pozycjonowanie AI SEO - Wprowadzenie",
      "description": "Dowiedz się jak AI zmienia zasady gry w SEO",
      "thumbnailUrl": "https://webdkw.net/images/video-poster.jpg",
      "uploadDate": "2024-01-15",
      "duration": "PT2M30S", // Format: PT[hours]H[minutes]M[seconds]S
      "contentUrl": "https://webdkw.net/videos/hero-vertical.mp4",
      "embedUrl": "https://webdkw.net/uslugi/pozycjonowanie-ai",
      "publisher": {
        "@type": "Organization",
        "name": "WebDKW",
        "logo": {
          "@type": "ImageObject",
          "url": "https://webdkw.net/images/webdkw-logo.svg"
        }
      }
    })}
  </script>
</Helmet>
```

## 📝 Checklist Wdrożenia

- [x] WebsiteSchema dodane
- [x] OrganizationSchema dodane
- [x] ServiceSchema dodane
- [x] FAQSchema dodane
- [x] BreadcrumbList dodane
- [x] WebPage Schema dodane
- [x] CaseStudy Schema dodane
- [x] Offer Schema dodane
- [x] BlogPosting Schema dodane
- [ ] VideoObject Schema (gdy wideo będzie gotowe)
- [ ] Przetestowane w Rich Results Test
- [ ] Zweryfikowane w Search Console
- [ ] Monitorowanie CTR rozpoczęte

## 🚀 Następne Kroki

1. **Deploy na produkcję**
2. **Przetestuj wszystkie schema** w Google Rich Results Test
3. **Dodaj stronę do Search Console** (jeśli jeszcze nie dodana)
4. **Poczekaj 1-2 tygodnie** na indeksację
5. **Monitoruj wyniki** w Search Console
6. **Dodaj VideoObject schema** gdy wideo będzie gotowe
7. **Regularnie aktualizuj FAQ** na podstawie pytań klientów

## 💡 Wskazówki

- Schema.org to nie ranking factor, ale **poprawia CTR**
- Rich snippets mogą **zwiększyć CTR o 20-30%**
- FAQ schema jest szczególnie ważne dla **AI Overview**
- Organization schema buduje **autorytet w Knowledge Graph**
- Regularne aktualizacje schema pokazują **aktywność strony**

## 📞 Wsparcie

Jeśli masz pytania lub potrzebujesz pomocy:
- Dokumentacja Schema.org: https://schema.org/
- Google Search Central: https://developers.google.com/search/docs/appearance/structured-data
- Rich Results Test: https://search.google.com/test/rich-results

---

**Ostatnia aktualizacja:** 2024
**Wersja:** 1.0
**Status:** ✅ Gotowe do produkcji