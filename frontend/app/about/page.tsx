
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Badge } from "@/components/ui/badge"
import { Calculator, Target, BarChart3, CheckCircle, ArrowRight, BookOpen } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Tentang TOPSIS
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Metode Pengambilan Keputusan yang <span className="text-primary">Ilmiah</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            TOPSIS (Technique for Order Preference by Similarity to Ideal Solution) adalah metode pengambilan keputusan
            yang menilai alternatif berdasarkan kedekatannya dengan solusi ideal terbaik dan menjauhnya dari solusi
            terburuk. Dengan cara ini, hasil ranking menjadi lebih logis, konsisten, dan adil.
          </p>
        </div>

        {/* What is TOPSIS */}
        <section className="mb-16">
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <BookOpen className="h-6 w-6 text-primary" />
                Apa itu TOPSIS?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg leading-relaxed">
                TOPSIS adalah salah satu metode pengambilan keputusan multi-kriteria (MCDM) yang dikembangkan oleh Hwang
                dan Yoon pada tahun 1981. Metode ini bekerja dengan prinsip bahwa alternatif terbaik adalah yang paling
                dekat dengan solusi ideal positif dan paling jauh dari solusi ideal negatif.
              </p>
              <p className="text-lg leading-relaxed">
                Dalam konteks pemilihan kosan, TOPSIS membantu mengevaluasi berbagai pilihan kosan berdasarkan kriteria
                seperti harga, jarak, fasilitas, dan rating, kemudian memberikan skor objektif untuk setiap alternatif.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* How TOPSIS Works */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Cara Kerja TOPSIS</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Proses perhitungan TOPSIS dilakukan dalam 6 langkah sistematis
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  Membuat Matriks Keputusan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Menyusun data alternatif (kosan) dan kriteria (harga, jarak, fasilitas, rating) dalam bentuk matriks.
                  Setiap baris mewakili satu kosan, dan setiap kolom mewakili satu kriteria.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  Normalisasi Matriks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Mengubah nilai-nilai dalam matriks menjadi bentuk yang dapat dibandingkan dengan menggunakan rumus
                  normalisasi vektor. Hal ini memastikan semua kriteria memiliki skala yang sama.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  Pembobotan Matriks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Mengalikan matriks yang telah dinormalisasi dengan bobot yang telah ditentukan untuk setiap kriteria.
                  Bobot mencerminkan tingkat kepentingan relatif dari setiap kriteria.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  Menentukan Solusi Ideal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Mencari solusi ideal positif (nilai terbaik untuk setiap kriteria) dan solusi ideal negatif (nilai
                  terburuk untuk setiap kriteria). Untuk harga dan jarak, nilai terkecil adalah yang terbaik, sedangkan
                  untuk fasilitas dan rating, nilai terbesar adalah yang terbaik.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    5
                  </div>
                  Menghitung Jarak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Menghitung jarak Euclidean setiap alternatif terhadap solusi ideal positif dan solusi ideal negatif.
                  Jarak ini menunjukkan seberapa dekat atau jauh setiap kosan dari kondisi ideal.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    6
                  </div>
                  Menghitung Skor TOPSIS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Menghitung skor preferensi relatif dengan rumus: Skor = Jarak ke Negatif Ideal / (Jarak ke Positif
                  Ideal + Jarak ke Negatif Ideal). Skor berkisar antara 0-1, dimana skor yang lebih tinggi menunjukkan
                  alternatif yang lebih baik.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Advantages */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Keunggulan Metode TOPSIS</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Mengapa TOPSIS menjadi pilihan yang tepat untuk pengambilan keputusan
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Target className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Objektif</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Menggunakan perhitungan matematis yang sistematis, mengurangi bias subjektif dalam pengambilan
                  keputusan.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calculator className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Mudah Dipahami</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Konsep dan langkah-langkah perhitungan relatif sederhana dan mudah diimplementasikan.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Fleksibel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Dapat menangani berbagai jenis kriteria (benefit dan cost) dengan jumlah alternatif yang tidak
                  terbatas.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Konsisten</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Memberikan hasil yang konsisten dan dapat direproduksi dengan data dan bobot yang sama.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <ArrowRight className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Efisien</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Proses perhitungan yang relatif cepat, cocok untuk pengambilan keputusan yang membutuhkan respon
                  segera.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Transparan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Setiap langkah perhitungan dapat ditelusuri dan diverifikasi, memberikan transparansi penuh dalam
                  proses pengambilan keputusan.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Application in Kosan Selection */}
        <section className="mb-16">
          <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
            <CardHeader>
              <CardTitle className="text-2xl">Penerapan dalam Pemilihan Kosan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg leading-relaxed">
                Dalam konteks pemilihan kosan, metode TOPSIS membantu mahasiswa dan orang tua untuk membuat keputusan
                yang objektif berdasarkan data faktual. Sistem ini mempertimbangkan berbagai faktor penting seperti:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Harga:</strong> Biaya sewa bulanan yang sesuai dengan budget
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Jarak:</strong> Kedekatan dengan kampus atau tempat aktivitas utama
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Fasilitas:</strong> Kelengkapan fasilitas seperti WiFi, AC, kamar mandi dalam, dll.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Rating:</strong> Penilaian dari penghuni sebelumnya atau review online
                  </span>
                </li>
              </ul>
              <p className="text-lg leading-relaxed">
                Dengan menggunakan TOPSIS, setiap kriteria dapat diberi bobot sesuai dengan prioritas individu, dan
                sistem akan memberikan ranking objektif yang membantu dalam pengambilan keputusan final.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Mathematical Foundation */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Dasar Matematis</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Rumus dan perhitungan yang digunakan dalam metode TOPSIS
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Normalisasi Vektor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Setiap elemen matriks dinormalisasi menggunakan rumus:</p>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  r<sub>ij</sub> = x<sub>ij</sub> / √(Σx<sub>ij</sub>²)
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  dimana r<sub>ij</sub> adalah nilai normalisasi, x<sub>ij</sub> adalah nilai asli
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pembobotan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Matriks ternormalisasi dikalikan dengan bobot:</p>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  v<sub>ij</sub> = w<sub>j</sub> × r<sub>ij</sub>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  dimana w<sub>j</sub> adalah bobot kriteria j
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Jarak Euclidean</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Jarak ke solusi ideal dihitung dengan:</p>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  D<sup>+</sup> = √(Σ(v<sub>ij</sub> - v<sub>j</sub>
                  <sup>+</sup>)²)
                  <br />D<sup>-</sup> = √(Σ(v<sub>ij</sub> - v<sub>j</sub>
                  <sup>-</sup>)²)
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skor Preferensi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Skor akhir TOPSIS dihitung dengan:</p>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  C<sub>i</sub> = D<sup>-</sup> / (D<sup>+</sup> + D<sup>-</sup>)
                </div>
                <p className="text-sm text-muted-foreground mt-2">Nilai berkisar 0-1, semakin tinggi semakin baik</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
