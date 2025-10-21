"use client";

import { useState } from "react";
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
}

export default function DashboardPage() {
  const [kosanList, setKosanList] = useState<KosanData[]>([
    {
      id: "1",
      nama: "Kosan Melati",
      harga: 800000,
      jarak: 2.5,
      fasilitas: 8,
      rating: 4.5,
      sistem_keamanan: 6,
    },
    {
      id: "2",
      nama: "Kosan Mawar",
      harga: 650000,
      jarak: 3.2,
      fasilitas: 7,
      rating: 4.2,
      sistem_keamanan: 5,
    },
    {
      id: "3",
      nama: "Kosan Anggrek",
      harga: 900000,
      jarak: 1.8,
      fasilitas: 9,
      rating: 4.7,
      sistem_keamanan: 8,
    },
  ]);

  const [bobot, setBobot] = useState<Bobot>({
    harga: 30,
    jarak: 25,
    fasilitas: 25,
    rating: 20,
  });

  const [newKosan, setNewKosan] = useState<Omit<KosanData, "id">>({
    nama: "",
    harga: 0,
    jarak: 0,
    fasilitas: 0,
    rating: 0,
    sistem_keamanan: 0,
  });

  const [hasCalculated, setHasCalculated] = useState(false);
  const [hasCalculatedSecurity, setHasCalculatedSecurity] = useState(false);

  const calculateTOPSIS = () => {
    if (kosanList.length === 0) return;

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

      return {
        ...kosan,
        hargaNorm,
        jarakNorm,
        fasilitasNorm,
        ratingNorm,
      };
    });

    const weightedMatrix = normalizedMatrix.map((kosan) => ({
      ...kosan,
      hargaWeighted: kosan.hargaNorm * (bobot.harga / 100),
      jarakWeighted: kosan.jarakNorm * (bobot.jarak / 100),
      fasilitasWeighted: kosan.fasilitasNorm * (bobot.fasilitas / 100),
      ratingWeighted: kosan.ratingNorm * (bobot.rating / 100),
    }));

    const idealSolution = {
      harga: Math.min(...weightedMatrix.map((k) => k.hargaWeighted)),
      jarak: Math.min(...weightedMatrix.map((k) => k.jarakWeighted)),
      fasilitas: Math.max(...weightedMatrix.map((k) => k.fasilitasWeighted)),
      rating: Math.max(...weightedMatrix.map((k) => k.ratingWeighted)),
    };

    const negativeIdealSolution = {
      harga: Math.max(...weightedMatrix.map((k) => k.hargaWeighted)),
      jarak: Math.max(...weightedMatrix.map((k) => k.jarakWeighted)),
      fasilitas: Math.min(...weightedMatrix.map((k) => k.fasilitasWeighted)),
      rating: Math.min(...weightedMatrix.map((k) => k.ratingWeighted)),
    };

    const updatedKosanList = weightedMatrix.map((kosan) => {
      const distanceToIdeal = Math.sqrt(
        (kosan.hargaWeighted - idealSolution.harga) ** 2 +
          (kosan.jarakWeighted - idealSolution.jarak) ** 2 +
          (kosan.fasilitasWeighted - idealSolution.fasilitas) ** 2 +
          (kosan.ratingWeighted - idealSolution.rating) ** 2
      );

      const distanceToNegativeIdeal = Math.sqrt(
        (kosan.hargaWeighted - negativeIdealSolution.harga) ** 2 +
          (kosan.jarakWeighted - negativeIdealSolution.jarak) ** 2 +
          (kosan.fasilitasWeighted - negativeIdealSolution.fasilitas) ** 2 +
          (kosan.ratingWeighted - negativeIdealSolution.rating) ** 2
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

  const calculateSecurityTOPSIS = () => {
    if (kosanList.length === 0) return;

    // Normalize sistem_keamanan values
    const normalizedMatrix = kosanList.map((kosan) => {
      const sistemNorm =
        kosan.sistem_keamanan /
        Math.sqrt(
          kosanList.reduce((sum, k) => sum + k.sistem_keamanan ** 2, 0)
        );

      return {
        ...kosan,
        sistemNorm,
      };
    });

    // Since we only have one criterion, the weighted value is the same as normalized
    const weightedMatrix = normalizedMatrix.map((kosan) => ({
      ...kosan,
      sistemWeighted: kosan.sistemNorm, // 100% weight for sistem_keamanan
    }));

    // Find ideal and negative ideal solutions
    const idealSolution = {
      sistem: Math.max(...weightedMatrix.map((k) => k.sistemWeighted)),
    };

    const negativeIdealSolution = {
      sistem: Math.min(...weightedMatrix.map((k) => k.sistemWeighted)),
    };

    // Calculate TOPSIS scores
    const updatedKosanList = weightedMatrix.map((kosan) => {
      const distanceToIdeal = Math.abs(
        kosan.sistemWeighted - idealSolution.sistem
      );
      const distanceToNegativeIdeal = Math.abs(
        kosan.sistemWeighted - negativeIdealSolution.sistem
      );

      const skor_keamanan =
        distanceToNegativeIdeal / (distanceToIdeal + distanceToNegativeIdeal);

      return {
        id: kosan.id,
        nama: kosan.nama,
        harga: kosan.harga,
        jarak: kosan.jarak,
        fasilitas: kosan.fasilitas,
        rating: kosan.rating,
        sistem_keamanan: kosan.sistem_keamanan,
        skor: kosan.skor,
        skor_keamanan: Number(skor_keamanan.toFixed(3)),
      };
    });

    updatedKosanList.sort(
      (a, b) => (b.skor_keamanan || 0) - (a.skor_keamanan || 0)
    );
    setKosanList(updatedKosanList);
    setHasCalculatedSecurity(true);
  };

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

  const removeKosan = (id: string) => {
    setKosanList(kosanList.filter((kosan) => kosan.id !== id));
    setHasCalculated(false);
    setHasCalculatedSecurity(false);
  };

  const chartData = kosanList.map((kosan) => ({
    nama: kosan.nama,
    skor: kosan.skor || 0,
  }));

  const securityChartData = kosanList.map((kosan) => ({
    nama: kosan.nama,
    skor: kosan.skor_keamanan || 0,
  }));

  const pieData = [
    { name: "Harga", value: bobot.harga, color: "#8b5cf6" },
    { name: "Jarak", value: bobot.jarak, color: "#06b6d4" },
    { name: "Fasilitas", value: bobot.fasilitas, color: "#10b981" },
    { name: "Rating", value: bobot.rating, color: "#f59e0b" },
  ];

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
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Harga ({bobot.harga}%)
                    </Label>
                    <Slider
                      value={[bobot.harga]}
                      onValueChange={(value) =>
                        setBobot({ ...bobot, harga: value[0] })
                      }
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Jarak ({bobot.jarak}%)
                    </Label>
                    <Slider
                      value={[bobot.jarak]}
                      onValueChange={(value) =>
                        setBobot({ ...bobot, jarak: value[0] })
                      }
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Wifi className="h-4 w-4" />
                      Fasilitas ({bobot.fasilitas}%)
                    </Label>
                    <Slider
                      value={[bobot.fasilitas]}
                      onValueChange={(value) =>
                        setBobot({ ...bobot, fasilitas: value[0] })
                      }
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Rating ({bobot.rating}%)
                    </Label>
                    <Slider
                      value={[bobot.rating]}
                      onValueChange={(value) =>
                        setBobot({ ...bobot, rating: value[0] })
                      }
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
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
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-primary" />
                    Analisis Sistem Keamanan TOPSIS
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {hasCalculatedSecurity
                      ? "Perhitungan sistem keamanan selesai"
                      : "Klik tombol hitung untuk memulai analisis sistem keamanan"}
                  </p>
                </div>
                <Button
                  onClick={calculateSecurityTOPSIS}
                  disabled={kosanList.length === 0}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Hitung Sistem Keamanan TOPSIS
                </Button>
              </CardHeader>
              <CardContent>
                <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Camera className="h-4 w-4 text-primary" />
                    Kriteria Sistem Keamanan
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Analisis ini fokus pada sistem keamanan yang meliputi: CCTV,
                    sistem alarm, security guard, akses kontrol, dan teknologi
                    keamanan lainnya yang tersedia di kosan.
                  </p>
                </div>

                {hasCalculatedSecurity ? (
                  <div className="space-y-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Peringkat</TableHead>
                          <TableHead>Nama Kosan</TableHead>
                          <TableHead>Skor Sistem Keamanan</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Nilai Sistem Keamanan</TableHead>
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
                            <TableCell>{kosan.skor_keamanan}</TableCell>
                            <TableCell>
                              <Progress
                                value={(kosan.skor_keamanan || 0) * 100}
                                className="w-24"
                              />
                            </TableCell>
                            <TableCell>{kosan.sistem_keamanan}/10</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={securityChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="nama" />
                          <YAxis />
                          <Tooltip
                            formatter={(value) => [
                              value,
                              "Skor Sistem Keamanan TOPSIS",
                            ]}
                          />
                          <Bar dataKey="skor" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Belum ada hasil analisis sistem keamanan. Klik tombol
                      &quot;Hitung Sistem Keamanan TOPSIS&quot; untuk memulai.
                      memulai.
                    </p>
                  </div>
                )}
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
