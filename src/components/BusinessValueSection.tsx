import { Building, Search, Sliders, Palette } from 'lucide-react'
import { Link } from 'react-router-dom'

const BusinessValueSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Strona, Która Pracuje dla Twojego Biznesu na Śląsku – 24/7
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            W dzisiejszych czasach każda firma może mieć stronę internetową. Prawdziwe pytanie brzmi: czy Twoja strona aktywnie pracuje na Twój sukces? Wiele witryn to tylko ładne, ale pasywne wizytówki. My podchodzimy do tego inaczej. Traktujemy profesjonalne tworzenie stron internetowych dla firm na Śląsku jako budowę najważniejszego narzędzia marketingowego w Twoim arsenale – narzędzia, które generuje realne zyski.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
            <div className="flex items-center space-x-4 mb-6">
              <Building className="h-10 w-10 text-orange-500" />
              <h3 className="text-2xl font-bold text-gray-900">
                🚀 Od cyfrowej ulotki do maszyny sprzedażowej
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Przestarzała strona to cyfrowy odpowiednik zamkniętego biura. Nowoczesna, dobrze zaprojektowana witryna to Twój najlepszy handlowiec, który pracuje bez przerwy. Naszym celem jest zaprojektowanie strony internetowej dla Twojej firmy w Bielsku-Białej, Katowicach czy Gliwicach, która nie tylko informuje, ale przede wszystkim przekonuje i konwertuje odwiedzających w płacących klientów. Analizujemy ścieżkę Twojego klienta, by każde kliknięcie prowadziło go do złożenia zapytania lub dokonania zakupu.
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
            <div className="flex items-center space-x-4 mb-6">
              <Search className="h-10 w-10 text-orange-500" />
              <h3 className="text-2xl font-bold text-gray-900">
                🔍 Lokalna widoczność w Google
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Zastanawiasz się, jak pozyskać klientów z internetu na Śląsku? Odpowiedzią jest strategiczne SEO. To nie magia, a przemyślany proces, dzięki któremu Twoja firma staje się widoczna dla osób aktywnie szukających Twoich usług. Dbamy o to, by optymalizacja strony pod kątem SEO dla firmy lokalnej była fundamentem projektu. Dzięki temu, gdy potencjalny klient wpisze w Google "usługi budowlane Częstochowa" lub "dobry prawnik Rybnik", znajdzie właśnie Ciebie, a nie konkurencję.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
            <div className="flex items-center space-x-4 mb-6">
              <Sliders className="h-10 w-10 text-orange-500" />
              <h3 className="text-2xl font-bold text-gray-900">
                ⚙️ Pełna kontrola dzięki systemowi CMS
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Boisz się, że po stworzeniu strony będziesz uzależniony od programisty przy każdej drobnej zmianie? Rozwiewamy te obawy. Każda tworzona przez nas responsywna strona internetowa z CMS w Gliwicach (i na całym Śląsku) daje Ci pełną swobodę. Otrzymujesz od nas intuicyjne narzędzie, dzięki któremu samodzielnie dodasz nowy wpis na blogu, zaktualizujesz cennik czy opublikujesz zdjęcia z ostatniej realizacji – szybko, prosto i bez dodatkowych kosztów.
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
            <div className="flex items-center space-x-4 mb-6">
              <Palette className="h-10 w-10 text-orange-500" />
              <h3 className="text-2xl font-bold text-gray-900">
                🎨 Design, który buduje zaufanie
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Wizerunek w sieci ma znaczenie. Dlatego tworzymy indywidualne projekty stron www dla firm z Tychów, Zabrza i całego regionu, które są nie tylko estetyczne i zgodne z Twoją marką, ale przede wszystkim budują zaufanie i profesjonalny autorytet. Co więcej, myślimy przyszłościowo. Nasze rozwiązania są skalowalne, co oznacza, że Twoja strona będzie mogła rosnąć i ewoluować razem z Twoim biznesem – od prostej wizytówki, po rozbudowany portal czy sklep internetowy.
            </p>
          </div>
        </div>

        <div className="text-center mt-16">
          <Link
            to="/kontakt"
            className="inline-flex items-center space-x-2 bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span>Porozmawiajmy o Twoim projekcie</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default BusinessValueSection