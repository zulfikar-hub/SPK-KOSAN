"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import Slider from "@/components/ui/slider";
import { Navigation } from "@/components/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Plus,
  Trash2,
  Calculator,
  Download,
  Home,
  MapPin,
  DollarSign,
  Star,
  Wifi,
  Shield,
  Camera,
} from "lucide-react";

interface KosanData {
  id: string;
  nama: string;
  harga: number;
  jarak: number;
  fasilitas: number;
  rating: number;
  skor?: number;
  sistem_keamanan: number;
  skor_keamanan?: number;
}

interface Bobot {
  harga: number;
  jarak: number;
  fasilitas: number;
  rating: number;
  sistem_keamanan: number;
}

  interface Kriteria {
  id: number;
  nama: string;
  bobot: number;
}

// --- Fungsi bantu untuk warna kriteria ---

export default function DashboardPage() {
  useEffect(() => {
    const fetchKosan = async () => {
      try {
        const res = await fetch("/api/kosan"); // ambil dari API kamu
        const data = await res.json();
        setKosanList(data); // isi hasilnya ke state
      } catch (error) {
        console.error("Gagal ambil data kosan:", error);
      }
    };

    fetchKosan();
  }, []); 
const [kriteriaList, setKriteriaList] = useState<Kriteria[]>([]);
const [kosanList, setKosanList] = useState<KosanData[]>([]);
const [newKosan, setNewKosan] = useState<Omit<KosanData, "id">>({
  nama: "",
  harga: 0,
  jarak: 0,
  fasilitas: 0,
  rating: 0,
  sistem_keamanan: 0,
});
const [hasCalculated, setHasCalculated] = useState(false);
const [bobot, setBobot] = useState<Bobot>({
  harga: 25,
  jarak: 20,
  fasilitas: 20,
  rating: 15,
  sistem_keamanan: 20,
});


useEffect(() => {
  const fetchKriteria = async () => {
    try {
      const res = await fetch("/api/kriteria");
      const data = await res.json();
      setKriteriaList(data);
    } catch (error) {
      console.error("Gagal ambil data kriteria:", error);
    }
  };

  fetchKriteria();
}, []);

// === FUNGSI TOPSIS ===
const calculateTOPSIS = () => {
  if (kosanList.length === 0 || kriteriaList.length === 0) return;

  // Ubah data kriteria jadi bentuk objek (biar mudah dipanggil)
  const bobotMap = Object.fromEntries(
    kriteriaList.map((item) => [item.nama.toLowerCase(), item.bobot])
  );

  // --- NORMALISASI ---
  const normalizedMatrix = kosanList.map((kosan) => {
    const hargaNorm =
      kosan.harga /
      Math.sqrt(kosanList.reduce((sum, k) => sum + k.harga ** 2, 0));

    const jarakNorm =
      kosan.jarak /
      Math.sqrt(kosanList.reduce((sum, k) => sum + k.jarak ** 2, 0));

    const fasilitasNorm =
      kosan.fasilitas /
      Math.sqrt(kosanList.reduce((sum, k) => sum + k.fasilitas ** 2, 0));

    const ratingNorm =
      kosan.rating /
      Math.sqrt(kosanList.reduce((sum, k) => sum + k.rating ** 2, 0));

    const sistemKeamananNorm =
      kosan.sistem_keamanan /
      Math.sqrt(
        kosanList.reduce((sum, k) => sum + k.sistem_keamanan ** 2, 0)
      );

    return {
      ...kosan,
      hargaNorm,
      jarakNorm,
      fasilitasNorm,
      ratingNorm,
      sistemKeamananNorm,
    };
  });

  // --- PEMBOBOTAN ---
  const weightedMatrix = normalizedMatrix.map((kosan) => ({
    ...kosan,
    hargaWeighted: kosan.hargaNorm * (bobotMap.harga / 100),
    jarakWeighted: kosan.jarakNorm * (bobotMap.jarak / 100),
    fasilitasWeighted: kosan.fasilitasNorm * (bobotMap.fasilitas / 100),
    ratingWeighted: kosan.ratingNorm * (bobotMap.rating / 100),
    sistemKeamananWeighted:
      kosan.sistemKeamananNorm * (bobotMap.sistem_keamanan / 100),
  }));

  // --- SOLUSI IDEAL & NEGATIF ---
  const idealSolution = {
    harga: Math.min(...weightedMatrix.map((k) => k.hargaWeighted)), // cost
    jarak: Math.min(...weightedMatrix.map((k) => k.jarakWeighted)), // cost
    fasilitas: Math.max(...weightedMatrix.map((k) => k.fasilitasWeighted)), // benefit
    rating: Math.max(...weightedMatrix.map((k) => k.ratingWeighted)), // benefit
    sistem_keamanan: Math.max(
      ...weightedMatrix.map((k) => k.sistemKeamananWeighted)
    ), // benefit
  };

  const negativeIdealSolution = {
    harga: Math.max(...weightedMatrix.map((k) => k.hargaWeighted)),
    jarak: Math.max(...weightedMatrix.map((k) => k.jarakWeighted)),
    fasilitas: Math.min(...weightedMatrix.map((k) => k.fasilitasWeighted)),
    rating: Math.min(...weightedMatrix.map((k) => k.ratingWeighted)),
    sistem_keamanan: Math.min(
      ...weightedMatrix.map((k) => k.sistemKeamananWeighted)
    ),
  };

  // --- HITUNG SKOR AKHIR ---
  const updatedKosanList = weightedMatrix.map((kosan) => {
    const distanceToIdeal = Math.sqrt(
      (kosan.hargaWeighted - idealSolution.harga) ** 2 +
        (kosan.jarakWeighted - idealSolution.jarak) ** 2 +
        (kosan.fasilitasWeighted - idealSolution.fasilitas) ** 2 +
        (kosan.ratingWeighted - idealSolution.rating) ** 2 +
        (kosan.sistemKeamananWeighted - idealSolution.sistem_keamanan) ** 2
    );

    const distanceToNegativeIdeal = Math.sqrt(
      (kosan.hargaWeighted - negativeIdealSolution.harga) ** 2 +
        (kosan.jarakWeighted - negativeIdealSolution.jarak) ** 2 +
        (kosan.fasilitasWeighted - negativeIdealSolution.fasilitas) ** 2 +
        (kosan.ratingWeighted - negativeIdealSolution.rating) ** 2 +
        (kosan.sistemKeamananWeighted -
          negativeIdealSolution.sistem_keamanan) ** 2
    );

    const skor =
      distanceToNegativeIdeal / (distanceToIdeal + distanceToNegativeIdeal);

      return {
        id: kosan.id,
        nama: kosan.nama,
        harga: kosan.harga,
        jarak: kosan.jarak,
        fasilitas: kosan.fasilitas,
        rating: kosan.rating,
        sistem_keamanan: kosan.sistem_keamanan,
        skor: Number(skor.toFixed(3)),
        skor_keamanan: kosan.skor_keamanan,
      };
    });

    updatedKosanList.sort((a, b) => (b.skor || 0) - (a.skor || 0));
    setKosanList(updatedKosanList);
    setHasCalculated(true);
  };
// === Fungsi Tambah Kosan ===
const addKosan = async () => {
  if (newKosan.nama && newKosan.harga > 0) {
    try {
      const res = await fetch("/api/kosan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newKosan),
      });

      if (res.ok) {
        const saved = await res.json();
        setKosanList([...kosanList, { ...saved, id: saved.id.toString() }]);
        setNewKosan({
          nama: "",
          harga: 0,
          jarak: 0,
          fasilitas: 0,
          rating: 0,
          sistem_keamanan: 0,
        });
        alert("Kosan berhasil ditambahkan ke database!");
      } else {
        alert("Gagal menyimpan ke database.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan ke database.");
    }
  }
};

// === Fungsi Hapus Kosan ===
const removeKosan = (id: string) => {
  setKosanList(kosanList.filter((kosan) => kosan.id !== id));
  setHasCalculated(false);
};

// === Data Chart ===
const chartData = kosanList.map((kosan) => ({
  nama: kosan.nama,
  skor: kosan.skor || 0,
}));

// (hapus securityChartData, karena keamanan sudah jadi bagian dari skor total)

// === Pie Chart Data ===
const kriteriaColors: Record<string, string> = {
  harga: "#8b5cf6",
  jarak: "#06b6d4",
  fasilitas: "#f59e0b",
  rating: "#10b981",
  sistem_keamanan: "#ef4444",
};
      
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard TOPSIS</h1>
          <p className="text-muted-foreground">
            Kelola data kosan dan analisis dengan metode TOPSIS
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Kosan</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kosanList.length}</div>
              <p className="text-xs text-muted-foreground">Kosan terdaftar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Kosan Terbaik
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hasCalculated && kosanList.length > 0
                  ? kosanList[0].nama
                  : "-"}
              </div>
              <p className="text-xs text-muted-foreground">
                Skor:{" "}
                {hasCalculated && kosanList.length > 0
                  ? kosanList[0].skor
                  : "-"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Rata-rata Harga
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {kosanList.length > 0
                  ? `Rp ${Math.round(kosanList.reduce((sum, k) => sum + k.harga, 0) / kosanList.length).toLocaleString()}`
                  : "-"}
              </div>
              <p className="text-xs text-muted-foreground">Per bulan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Status Analisis
              </CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Badge variant={hasCalculated ? "default" : "secondary"}>
                  {hasCalculated ? "Selesai" : "Belum"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Perhitungan TOPSIS
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="data" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="data">Data Kosan</TabsTrigger>
            <TabsTrigger value="bobot">Bobot Kriteria</TabsTrigger>
            <TabsTrigger value="hasil">Hasil Analisis</TabsTrigger>
            <TabsTrigger value="keamanan">Analisis Keamanan</TabsTrigger>
            <TabsTrigger value="laporan">Laporan</TabsTrigger>
          </TabsList>

          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tambah Data Kosan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="nama">Nama Kosan</Label>
                    <Input
                      id="nama"
                      value={newKosan.nama}
                      onChange={(e) =>
                        setNewKosan({ ...newKosan, nama: e.target.value })
                      }
                      placeholder="Masukkan nama kosan"
                    />
                  </div>
                  <div>
                    <Label htmlFor="harga">Harga (Rp)</Label>
                    <Input
                      id="harga"
                      type="number"
                      value={newKosan.harga || ""}
                      onChange={(e) =>
                        setNewKosan({
                          ...newKosan,
                          harga: Number(e.target.value),
                        })
                      }
                      placeholder="800000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="jarak">Jarak (km)</Label>
                    <Input
                      id="jarak"
                      type="number"
                      step="0.1"
                      value={newKosan.jarak || ""}
                      onChange={(e) =>
                        setNewKosan({
                          ...newKosan,
                          jarak: Number(e.target.value),
                        })
                      }
                      placeholder="2.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fasilitas">Fasilitas (1-10)</Label>
                    <Input
                      id="fasilitas"
                      type="number"
                      min="1"
                      max="10"
                      value={newKosan.fasilitas || ""}
                      onChange={(e) =>
                        setNewKosan({
                          ...newKosan,
                          fasilitas: Number(e.target.value),
                        })
                      }
                      placeholder="8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rating">Rating (1-5)</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={newKosan.rating || ""}
                      onChange={(e) =>
                        setNewKosan({
                          ...newKosan,
                          rating: Number(e.target.value),
                        })
                      }
                      placeholder="4.5"
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Sistem Keamanan (1-10)
                  </h4>
                  <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sistem_keamanan">Sistem Keamanan</Label>
                      <Input
                        id="sistem_keamanan"
                        type="number"
                        min="1"
                        max="10"
                        value={newKosan.sistem_keamanan || ""}
                        onChange={(e) =>
                          setNewKosan({
                            ...newKosan,
                            sistem_keamanan: Number(e.target.value),
                          })
                        }
                        placeholder="6"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        CCTV, alarm, security guard, akses kontrol
                      </p>
                    </div>
                  </div>
                </div>

                <Button onClick={addKosan} className="w-full md:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Kosan
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daftar Kosan</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Harga</TableHead>
                      <TableHead>Jarak</TableHead>
                      <TableHead>Fasilitas</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Sistem Keamanan</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kosanList.map((kosan) => (
                      <TableRow key={kosan.id}>
                        <TableCell className="font-medium">
                          {kosan.nama}
                        </TableCell>
                        <TableCell>Rp {kosan.harga.toLocaleString()}</TableCell>
                        <TableCell>{kosan.jarak} km</TableCell>
                        <TableCell>{kosan.fasilitas}/10</TableCell>
                        <TableCell>{kosan.rating}/5</TableCell>
                        <TableCell>{kosan.sistem_keamanan}/10</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeKosan(kosan.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bobot" className="space-y-6">
  <Card>
    <CardHeader>
      <CardTitle>Pengaturan Bobot Kriteria</CardTitle>
      <p className="text-sm text-muted-foreground">
        Sesuaikan bobot setiap kriteria sesuai prioritas Anda (Total:{" "}
        {Object.values(bobot).reduce((a, b) => a + b, 0)}%)
      </p>
    </CardHeader>
    <CardContent className="space-y-6">

      {/* Wrapper utama untuk slider */}
      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(bobot).map(([key, value]) => {
          const icons: Record<string, JSX.Element> = {
            harga: <DollarSign className="h-4 w-4" />,
            jarak: <MapPin className="h-4 w-4" />,
            fasilitas: <Wifi className="h-4 w-4" />,
            rating: <Star className="h-4 w-4" />,
            sistem_keamanan: <Shield className="h-4 w-4" />,
          };

          // Hanya return satu elemen parent <div> per kriteria
          return (
            <div key={key} className="space-y-2">
              <Label className="flex items-center gap-2">
                {icons[key] || null}
                {key
                  .split("_")
                  .map((w) => w[0].toUpperCase() + w.slice(1))
                  .join(" ")}{" "}
                ({value}%)
              </Label>
              <Slider
                value={[value]}
                onValueChange={(v) =>
                  setBobot({ ...bobot, [key]: v[0] })
                }
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          );
        })}
      </div>

      {/* Pie Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={Object.entries(bobot).map(([key, value]) => ({
                name: key
                  .split("_")
                  .map((w) => w[0].toUpperCase() + w.slice(1))
                  .join(" "),
                value,
                color: kriteriaColors[key],
              }))}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}%`}
            >
              {Object.entries(bobot).map(([key], index) => (
                <Cell key={`cell-${index}`} fill={kriteriaColors[key]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value}%`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </CardContent>
  </Card>
</TabsContent>


          <TabsContent value="hasil" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Hasil Analisis TOPSIS</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {hasCalculated
                      ? "Perhitungan selesai"
                      : "Klik tombol hitung untuk memulai analisis"}
                  </p>
                </div>
                <Button
                  onClick={calculateTOPSIS}
                  disabled={kosanList.length === 0}
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Hitung TOPSIS
                </Button>
              </CardHeader>
              <CardContent>
                {hasCalculated ? (
                  <div className="space-y-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Peringkat</TableHead>
                          <TableHead>Nama Kosan</TableHead>
                          <TableHead>Skor TOPSIS</TableHead>
                          <TableHead>Progress</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {kosanList.map((kosan, index) => (
                          <TableRow key={kosan.id}>
                            <TableCell>
                              <Badge
                                variant={index === 0 ? "default" : "secondary"}
                              >
                                #{index + 1}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                              {kosan.nama}
                            </TableCell>
                            <TableCell>{kosan.skor}</TableCell>
                            <TableCell>
                              <Progress
                                value={(kosan.skor || 0) * 100}
                                className="w-24"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="nama" />
                          <YAxis />
                          <Tooltip
                            formatter={(value) => [value, "Skor TOPSIS"]}
                          />
                          <Bar dataKey="skor" fill="#8b5cf6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Belum ada hasil analisis. Klik tombol &quot;Hitung
                      TOPSIS&quot; untuk memulai.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keamanan" className="space-y-6">
  <Card>
    <CardHeader>
      <CardTitle>
        <Camera className="h-5 w-5 text-primary" />
        Analisis Sistem Keamanan
      </CardTitle>
      <p className="text-sm text-muted-foreground">
        Nilai keamanan tiap kosan berdasarkan hasil TOPSIS gabungan.
      </p>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Kosan</TableHead>
            <TableHead>Nilai Sistem Keamanan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {kosanList.map((k) => (
            <TableRow key={k.id}>
              <TableCell>{k.nama}</TableCell>
              <TableCell>{k.sistem_keamanan}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</TabsContent>


          <TabsContent value="laporan" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ekspor Laporan</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Unduh hasil analisis dalam berbagai format untuk dokumentasi
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Button variant="outline" disabled={!hasCalculated}>
                    <Download className="h-4 w-4 mr-2" />
                    Unduh CSV
                  </Button>
                  <Button variant="outline" disabled={!hasCalculated}>
                    <Download className="h-4 w-4 mr-2" />
                    Unduh PDF
                  </Button>
                </div>
                {!hasCalculated && (
                  <p className="text-sm text-muted-foreground">
                    Lakukan perhitungan TOPSIS terlebih dahulu untuk
                    mengaktifkan fitur ekspor.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
