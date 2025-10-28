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
  const [bobotSementara, setBobotSementara] = useState<Record<string, number>>(
    {}
  );
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

  useEffect(() => {
    const fetchKriteria = async () => {
      try {
        const res = await fetch("/api/kriteria");
        const data = await res.json();
        console.log("🔥 Data dari /api/kriteria:", data); // 👈 CEK di console
        setKriteriaList(data);

        const initialBobot = Array.isArray(data)
          ? data.reduce(
              (acc, item) => {
                if (item?.nama && item?.bobot) {
                  acc[item.nama.toLowerCase().replace(/\s+/g, "_")] =
                    item.bobot;
                }
                return acc;
              },
              {} as Record<string, number>
            )
          : {};
        setBobotSementara(initialBobot);
      } catch (err) {
        console.error("Gagal ambil data kriteria:", err);
      }
    };
    fetchKriteria();
  }, []);

  // === FUNGSI TOPSIS ===
  const calculateTOPSIS = () => {
    if (kosanList.length === 0) return;

    // === 1) Bangun bobotMap dengan pengecekan tipe yang aman ===
    const bobotMap = (Array.isArray(kriteriaList) ? kriteriaList : []).reduce<
      Record<string, number>
    >((acc, item) => {
      if (
        typeof item === "object" &&
        item !== null &&
        "nama" in item &&
        "bobot" in item
      ) {
        const nama = String((item as { nama: unknown }).nama);
        const bobot = Number((item as { bobot: unknown }).bobot);
        const key = nama.toLowerCase().replace(/\s+/g, "_");
        acc[key] = bobot;
      }
      return acc;
    }, {});

    // jika bobotMap kosong, fallback ke state lokal bobot (agar UI slider tetap berpengaruh)
    // pastikan keys juga seragam: gunakan key lowercase dengan underscore
    const getWeight = (key: keyof Bobot) => bobotMap[key] ?? bobot[key] ?? 0; // angka dalam persen, mis: 20

    // --- NORMALISASI ---
    const normalizedMatrix = kosanList.map((kosan) => {
      const hargaNorm =
        kosan.harga /
        Math.sqrt(kosanList.reduce((sum, k) => sum + k.harga ** 2, 0) || 1);

      const jarakNorm =
        kosan.jarak /
        Math.sqrt(kosanList.reduce((sum, k) => sum + k.jarak ** 2, 0) || 1);

      const fasilitasNorm =
        kosan.fasilitas /
        Math.sqrt(kosanList.reduce((sum, k) => sum + k.fasilitas ** 2, 0) || 1);

      const ratingNorm =
        kosan.rating /
        Math.sqrt(kosanList.reduce((sum, k) => sum + k.rating ** 2, 0) || 1);

      const sistem_KeamananNorm =
        kosan.sistem_keamanan /
        Math.sqrt(
          kosanList.reduce((sum, k) => sum + k.sistem_keamanan ** 2, 0) || 1
        );

      return {
        ...kosan,
        hargaNorm,
        jarakNorm,
        fasilitasNorm,
        ratingNorm,
        sistem_KeamananNorm,
      };
    });

    // --- PEMBOBOTAN (pakai getWeight dan bagi 100 karena bobot disimpan persen) ---
    const weightedMatrix = normalizedMatrix.map((kosan) => ({
      ...kosan,
      hargaWeighted: kosan.hargaNorm * (getWeight("harga") / 100),
      jarakWeighted: kosan.jarakNorm * (getWeight("jarak") / 100),
      fasilitasWeighted: kosan.fasilitasNorm * (getWeight("fasilitas") / 100),
      ratingWeighted: kosan.ratingNorm * (getWeight("rating") / 100),
      sistem_KeamananWeighted:
        kosan.sistem_KeamananNorm * (getWeight("sistem_keamanan") / 100),
    }));

    // --- SOLUSI IDEAL & NEGATIF ---
    const idealSolution = {
      harga: Math.min(...weightedMatrix.map((k) => k.hargaWeighted)),
      jarak: Math.min(...weightedMatrix.map((k) => k.jarakWeighted)),
      fasilitas: Math.max(...weightedMatrix.map((k) => k.fasilitasWeighted)),
      rating: Math.max(...weightedMatrix.map((k) => k.ratingWeighted)),
      sistem_keamanan: Math.max(
        ...weightedMatrix.map((k) => k.sistem_KeamananWeighted)
      ),
    };

    const negativeIdealSolution = {
      harga: Math.max(...weightedMatrix.map((k) => k.hargaWeighted)),
      jarak: Math.max(...weightedMatrix.map((k) => k.jarakWeighted)),
      fasilitas: Math.min(...weightedMatrix.map((k) => k.fasilitasWeighted)),
      rating: Math.min(...weightedMatrix.map((k) => k.ratingWeighted)),
      sistem_keamanan: Math.min(
        ...weightedMatrix.map((k) => k.sistem_KeamananWeighted)
      ),
    };

    // --- HITUNG SKOR AKHIR ---
    const updatedKosanList = weightedMatrix.map((kosan) => {
      const distanceToIdeal = Math.sqrt(
        (kosan.hargaWeighted - idealSolution.harga) ** 2 +
          (kosan.jarakWeighted - idealSolution.jarak) ** 2 +
          (kosan.fasilitasWeighted - idealSolution.fasilitas) ** 2 +
          (kosan.ratingWeighted - idealSolution.rating) ** 2 +
          (kosan.sistem_KeamananWeighted - idealSolution.sistem_keamanan) ** 2
      );

      const distanceToNegativeIdeal = Math.sqrt(
        (kosan.hargaWeighted - negativeIdealSolution.harga) ** 2 +
          (kosan.jarakWeighted - negativeIdealSolution.jarak) ** 2 +
          (kosan.fasilitasWeighted - negativeIdealSolution.fasilitas) ** 2 +
          (kosan.ratingWeighted - negativeIdealSolution.rating) ** 2 +
          (kosan.sistem_KeamananWeighted -
            negativeIdealSolution.sistem_keamanan) **
            2
      );

      const skor =
        distanceToNegativeIdeal /
        (distanceToIdeal + distanceToNegativeIdeal || 1);

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
          setKosanList([
            ...kosanList,
            { ...saved, id: saved?.id?.toString?.() ?? Date.now().toString() },
          ]);
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
  const bobot: Bobot = {
    harga: bobotSementara.harga ?? 25,
    jarak: bobotSementara.jarak ?? 20,
    fasilitas: bobotSementara.fasilitas ?? 20,
    rating: bobotSementara.rating ?? 15,
    sistem_keamanan: bobotSementara.sistem_keamanan ?? 20,
  };
  const totalBobot = kriteriaList.length > 0
  ? kriteriaList.reduce((sum, k) => sum + (k.bobot ?? 0) * 100, 0)
  : Object.values(bobotSementara).reduce((sum, v) => sum + (v ?? 0) * 100, 0);

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
        Sesuaikan bobot setiap kriteria sesuai prioritas Anda (Total: {totalBobot}%)
      </p>
    </CardHeader>

    <CardContent className="space-y-6">
      {/* Grid Slider */}
      <div className="grid md:grid-cols-3 gap-6">
        {(kriteriaList.length > 0
          ? kriteriaList
          : Object.entries(bobotSementara).map(([nama, bobot]) => ({ nama, bobot }))
        ).map((k) => {
          const keyNormalized = (k.nama ?? "").toLowerCase().replace(/\s+/g, "_");
          const sliderValue = kriteriaList.length > 0
            ? k.bobot ?? 0
            : bobotSementara[keyNormalized] ?? 0;

          const icons: Record<string, JSX.Element> = {
            harga: <DollarSign className="h-6 w-6 text-purple-600" />,
            jarak: <MapPin className="h-6 w-6 text-cyan-500" />,
            fasilitas: <Wifi className="h-6 w-6 text-yellow-500" />,
            rating: <Star className="h-6 w-6 text-green-500" />,
            sistem_keamanan: <Shield className="h-6 w-6 text-red-500" />,
          };

          return (
            <div
              key={keyNormalized}
              className="bg-white p-4 rounded-xl shadow flex flex-col items-center"
            >
              {/* Icon & Name */}
              <div className="flex flex-col items-center mb-3">
                {icons[keyNormalized] || null}
                <span className="font-medium text-gray-700 mt-1 text-center">
                  {keyNormalized
                    .split("_")
                    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
                    .join(" ")}
                </span>
              </div>

              {/* Slider */}
              <Slider
                value={[sliderValue * 100]}
                onValueChange={(v) => {
                  const newValue = v[0] / 100;

                  // Batasi total bobot max 100%
                  const otherTotal = (kriteriaList.length > 0
                    ? kriteriaList.reduce((sum, item) => {
                        const key = (item.nama ?? "").toLowerCase().replace(/\s+/g, "_");
                        return key === keyNormalized ? sum : sum + (item.bobot ?? 0);
                      }, 0)
                    : Object.entries(bobotSementara).reduce((sum, [name, val]) => {
                        return name === keyNormalized ? sum : sum + (val ?? 0);
                      }, 0)
                  );
                  const maxValue = Math.min(newValue, 1 - otherTotal);

                  if (kriteriaList.length > 0) {
                    setKriteriaList((prev) =>
                      prev.map((item) =>
                        (item.nama ?? "").toLowerCase().replace(/\s+/g, "_") === keyNormalized
                          ? { ...item, bobot: maxValue }
                          : item
                      )
                    );
                  } else {
                    setBobotSementara((prev) => ({
                      ...prev,
                      [keyNormalized]: maxValue,
                    }));
                  }
                }}
                max={100}
                step={5}
                className="w-full mt-2"
              />

              {/* Persen */}
              <div className="mt-1 text-sm font-medium">{(sliderValue * 100).toFixed(0)}%</div>
            </div>
          );
        })}
      </div>

      {/* Total Bobot */}
      <div className="text-right font-medium">
        Total Bobot: <span className={totalBobot === 100 ? "text-green-600" : "text-red-500"}>{totalBobot}%</span>
      </div>

      {/* Pie Chart */}
      <div className="h-64 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={kriteriaList.length > 0 ? kriteriaList.map(k => ({
                key: k.nama,
                value: k.bobot ?? 0,
                displayValue: ((k.bobot ?? 0) * 100).toFixed(0)
              })) : Object.entries(bobotSementara).map(([nama, val]) => ({
                key: nama,
                value: val,
                displayValue: (val * 100).toFixed(0)
              }))}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              label={({ payload }) => `${payload.key}: ${payload.displayValue}%`}
            >
              {(kriteriaList.length > 0 ? kriteriaList : Object.entries(bobotSementara).map(([n, v]) => ({ nama: n, bobot: v }))).map((k, index) => {
                const lower = (k.nama ?? "").toLowerCase();
                const color =
                  lower === "harga"
                    ? "#8b5cf6"
                    : lower === "jarak"
                      ? "#06b6d4"
                      : lower === "fasilitas"
                        ? "#f59e0b"
                        : lower === "rating"
                          ? "#10b981"
                          : lower === "sistem_keamanan"
                            ? "#ef4444"
                            : "#9ca3af";
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Pie>
            <Tooltip formatter={(value: number) => `${(value * 100).toFixed(0)}%`} />
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
