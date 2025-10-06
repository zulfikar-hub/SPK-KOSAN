import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, MessageCircle, Mail, Phone } from "lucide-react"
import Link from "next/link"

export default function FAQPage() {
  const faqs = [
    {
      question: "Apa keuntungan utama sistem ini?",
      answer:
        "Sistem ini membantu memilih kosan terbaik dengan cepat dan objektif berdasarkan data. Dengan menggunakan metode TOPSIS, keputusan tidak lagi berdasarkan intuisi semata, melainkan perhitungan matematis yang sistematis dan dapat dipertanggungjawabkan.",
    },
    {
      question: "Bisa menambahkan kriteria baru?",
      answer:
        "Ya, sistem ini fleksibel dan dapat disesuaikan dengan kebutuhan. Anda bisa menambahkan kriteria baru seperti keamanan, kebersihan, atau akses transportasi umum melalui pengaturan kriteria di dashboard.",
    },
    {
      question: "Outputnya apa saja?",
      answer:
        "Sistem menghasilkan ranking kosan berdasarkan skor TOPSIS, grafik perbandingan, tabel detail hasil analisis, serta laporan yang dapat diekspor dalam bentuk CSV atau PDF untuk dokumentasi dan presentasi.",
    },
    {
      question: "Bagaimana cara kerja perhitungan TOPSIS?",
      answer:
        "TOPSIS bekerja dengan 6 langkah: (1) membuat matriks keputusan, (2) normalisasi matriks, (3) pembobotan, (4) menentukan solusi ideal positif dan negatif, (5) menghitung jarak euclidean, dan (6) menghitung skor preferensi relatif.",
    },
    {
      question: "Apakah sistem ini gratis?",
      answer:
        "Ya, sistem dasar dapat digunakan secara gratis. Untuk fitur lanjutan seperti integrasi dengan platform kampus atau ekspor laporan dalam jumlah besar, tersedia paket premium dengan harga terjangkau.",
    },
    {
      question: "Berapa banyak kosan yang bisa dibandingkan?",
      answer:
        "Tidak ada batasan jumlah kosan yang dapat dibandingkan. Sistem dapat menangani dari 2 hingga ratusan alternatif kosan sekaligus, dengan performa perhitungan yang tetap optimal.",
    },
    {
      question: "Bagaimana menentukan bobot kriteria yang tepat?",
      answer:
        "Bobot kriteria sebaiknya disesuaikan dengan prioritas personal Anda. Misalnya, jika budget terbatas, berikan bobot lebih tinggi pada harga. Jika lokasi sangat penting, tingkatkan bobot jarak. Sistem menyediakan panduan dan saran bobot berdasarkan profil pengguna.",
    },
    {
      question: "Apakah data kosan aman dan terlindungi?",
      answer:
        "Ya, semua data yang Anda masukkan disimpan dengan aman menggunakan enkripsi standar industri. Data pribadi tidak akan dibagikan kepada pihak ketiga tanpa persetujuan eksplisit dari pengguna.",
    },
    {
      question: "Bisakah sistem ini digunakan untuk keputusan lain selain kosan?",
      answer:
        "Tentu saja! Metode TOPSIS dapat diterapkan untuk berbagai keputusan multi-kriteria seperti pemilihan laptop, mobil, investasi, atau bahkan pemilihan universitas. Anda hanya perlu menyesuaikan kriteria dan alternatif yang akan dibandingkan.",
    },
    {
      question: "Bagaimana cara menginterpretasikan skor TOPSIS?",
      answer:
        "Skor TOPSIS berkisar antara 0 hingga 1. Semakin mendekati 1, semakin baik alternatif tersebut. Skor 0.8 ke atas menunjukkan pilihan yang sangat baik, 0.6-0.8 baik, 0.4-0.6 cukup, dan di bawah 0.4 kurang optimal.",
    },
    {
      question: "Apakah tersedia tutorial atau panduan penggunaan?",
      answer:
        "Ya, kami menyediakan tutorial lengkap dalam bentuk video dan dokumentasi tertulis. Tersedia juga contoh kasus nyata dan tips untuk memaksimalkan penggunaan sistem dalam pengambilan keputusan.",
    },
    {
      question: "Bagaimana jika ada masalah teknis atau bug?",
      answer:
        "Tim support kami siap membantu 24/7. Anda dapat menghubungi kami melalui email, chat, atau formulir kontak. Kami berkomitmen untuk merespon dalam waktu maksimal 24 jam dan menyelesaikan masalah dengan cepat.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <HelpCircle className="h-3 w-3 mr-1" />
            FAQ
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Pertanyaan yang <span className="text-primary">Sering Diajukan</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Temukan jawaban untuk pertanyaan umum tentang sistem penunjang keputusan TOPSIS dan cara penggunaannya
          </p>
        </div>

        {/* FAQ Accordion */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Pertanyaan Umum</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>

        {/* Quick Start Guide */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Panduan Cepat</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Langkah mudah untuk memulai menggunakan sistem TOPSIS
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <CardTitle>Daftar Kosan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Masukkan data kosan yang ingin dibandingkan beserta informasi harga, jarak, fasilitas, dan rating
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <CardTitle>Atur Bobot</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sesuaikan bobot setiap kriteria berdasarkan prioritas dan kebutuhan personal Anda
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <CardTitle>Hitung TOPSIS</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Klik tombol hitung dan biarkan sistem melakukan analisis TOPSIS secara otomatis
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  4
                </div>
                <CardTitle>Lihat Hasil</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Analisis ranking kosan terbaik dan ekspor laporan untuk dokumentasi atau presentasi
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tips Section */}
        <section className="mb-16">
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Tips Penggunaan Optimal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Menentukan Bobot Kriteria</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Prioritaskan kriteria yang paling penting bagi Anda</li>
                    <li>• Pastikan total bobot = 100%</li>
                    <li>• Pertimbangkan kondisi finansial dan kebutuhan</li>
                    <li>• Sesuaikan dengan jarak ke kampus atau tempat kerja</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Input Data yang Akurat</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Gunakan data terbaru dan terverifikasi</li>
                    <li>• Pastikan satuan pengukuran konsisten</li>
                    <li>• Cek kembali informasi harga dan fasilitas</li>
                    <li>• Gunakan rating dari sumber terpercaya</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact Support */}
        <section>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Masih Ada Pertanyaan?</CardTitle>
              <p className="text-muted-foreground">
                Tim support kami siap membantu Anda 24/7. Jangan ragu untuk menghubungi kami!
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <Mail className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Email Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Kirim email ke{" "}
                    <a href="mailto:hello@domainanda.com" className="text-primary hover:underline">
                      hello@domainanda.com
                    </a>
                  </p>
                  <p className="text-xs text-muted-foreground">Respon dalam 24 jam</p>
                </div>

                <div className="space-y-2">
                  <MessageCircle className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Live Chat</h3>
                  <p className="text-sm text-muted-foreground">Chat langsung dengan tim support</p>
                  <Button variant="outline" size="sm">
                    Mulai Chat
                  </Button>
                </div>

                <div className="space-y-2">
                  <Phone className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Konsultasi</h3>
                  <p className="text-sm text-muted-foreground">
                    Jadwalkan konsultasi gratis untuk integrasi enterprise
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard">Mulai Sekarang</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
