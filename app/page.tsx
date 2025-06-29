import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Award, TrendingUp, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">ScientificWorks</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-500 hover:text-gray-900">
                Xüsusiyyətlər
              </a>
              <a href="#services" className="text-gray-500 hover:text-gray-900">
                Xidmətlər
              </a>
              <a href="#about" className="text-gray-500 hover:text-gray-900">
                Haqqımızda
              </a>
              <a href="#contact" className="text-gray-500 hover:text-gray-900">
                Əlaqə
              </a>
            </nav>
            <div className="flex space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Giriş</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Qeydiyyat</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4" variant="secondary">
              Elmi İşlər Platforması
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Elmi Tədqiqatlarınızı
              <span className="text-blue-600"> Paylaşın</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Elmi məqalələrinizi, tədqiqatlarınızı və layihələrinizi peşəkar platformamızda paylaşın. Akademik icma ilə
              əlaqə qurun və karyeranızı inkişaf etdirin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="w-full sm:w-auto">
                  İndi Başlayın
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Daha Ətraflı
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Niyə ScientificWorks?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Elmi tədqiqatçılar üçün xüsusi olaraq hazırlanmış güclü alətlər və xidmətlər
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Məqalə Paylaşımı</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Elmi məqalələrinizi asanlıqla yükləyin və geniş auditoriya ilə paylaşın
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Akademik Şəbəkə</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Digər tədqiqatçılarla əlaqə qurun və birgə layihələr həyata keçirin</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Award className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Sertifikatlaşdırma</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>İşləriniz üçün rəsmi sertifikatlar əldə edin və karyeranızı gücləndin</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Analitika</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>İşlərinizin təsirini izləyin və detallı statistikalar əldə edin</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Xidmətlərimiz</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Elmi fəaliyyətinizi dəstəkləyən geniş xidmət spektri
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Tədqiqatçılar üçün</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Məqalə Dərc Etmə</h4>
                    <p className="text-gray-600">Elmi məqalələrinizi peşəkar formatda dərc edin</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Həmkar Axtarışı</h4>
                    <p className="text-gray-600">Sahənizdə işləyən digər tədqiqatçıları tapın</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Layihə İdarəetməsi</h4>
                    <p className="text-gray-600">Tədqiqat layihələrinizi effektiv idarə edin</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Təşkilatlar üçün</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-blue-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Korporativ Hesab</h4>
                    <p className="text-gray-600">Təşkilatınız üçün xüsusi hesab və imkanlar</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-blue-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Analitik Hesabatlar</h4>
                    <p className="text-gray-600">Detallı performans və təsir hesabatları</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-blue-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-900">API İnteqrasiyası</h4>
                    <p className="text-gray-600">Mövcud sistemlərinizlə inteqrasiya</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Elmi Karyeranızı İndi Başladın</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Minlərlə tədqiqatçının qoşulduğu platformada yerinizi alın və elmi təsiriniziartırın
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary">
              Pulsuz Qeydiyyat
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <BookOpen className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">ScientificWorks</span>
              </div>
              <p className="text-gray-400">Elmi tədqiqatçılar üçün yaradılmış peşəkar platform</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Xidmətlər</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Məqalə Dərc Etmə</li>
                <li>Tədqiqat Layihələri</li>
                <li>Akademik Şəbəkə</li>
                <li>Sertifikatlaşdırma</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Dəstək</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Yardım Mərkəzi</li>
                <li>Əlaqə</li>
                <li>FAQ</li>
                <li>Texniki Dəstək</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Əlaqə</h3>
              <ul className="space-y-2 text-gray-400">
                <li>info@scientificworks.az</li>
                <li>+994 12 345 67 89</li>
                <li>Bakı, Azərbaycan</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ScientificWorks. Bütün hüquqlar qorunur.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
