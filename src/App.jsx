import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [barang, setBarang] = useState('');
  const [harga, setHarga] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [belanja, setBelanja] = useState([]);
  const [daftarBarang, setDaftarBarang] = useState([
    { nama: 'Ayam', harga: 15000 },
    { nama: 'Telur', harga: 2000 },
    { nama: 'Minyak', harga: 30000 }
  ]);
  const [barangManual, setBarangManual] = useState('');
  const [hargaManual, setHargaManual] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [hargaBaru, setHargaBaru] = useState('');
  const [nomorStruk, setNomorStruk] = useState(1);
  const [waktuPembelian, setWaktuPembelian] = useState('');

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('nomorStrukData')) || {};
    const today = new Date().toDateString();
    if (savedData.tanggal === today) {
      setNomorStruk(savedData.nomor);
    } else {
      setNomorStruk(1);
      localStorage.setItem('nomorStrukData', JSON.stringify({ tanggal: today, nomor: 1 }));
    }
  }, []);

  const tambahBarang = () => {
    let namaBarang = barang;
    let hargaBarang = parseFloat(harga);

    if (barangManual && hargaManual) {
      namaBarang = barangManual;
      hargaBarang = parseFloat(hargaManual);
      const index = daftarBarang.findIndex(item => item.nama.toLowerCase() === barangManual.toLowerCase());
      if (index >= 0) {
        const updated = [...daftarBarang];
        updated[index].harga = hargaBarang;
        setDaftarBarang(updated);
      } else {
        setDaftarBarang([...daftarBarang, { nama: barangManual, harga: hargaBarang }]);
      }
    }

    if (namaBarang && hargaBarang && jumlah) {
      const total = hargaBarang * parseInt(jumlah);
      setBelanja([...belanja, { barang: namaBarang, harga: hargaBarang, jumlah: parseInt(jumlah), total }]);
      setBarang('');
      setHarga('');
      setJumlah('');
      setBarangManual('');
      setHargaManual('');
    }
  };

  const hapusBarang = (index) => {
    const baru = [...belanja];
    baru.splice(index, 1);
    setBelanja(baru);
  };

  const hapusDariDaftar = (index) => {
    const baru = [...daftarBarang];
    baru.splice(index, 1);
    setDaftarBarang(baru);
  };

  const totalBelanja = belanja.reduce((acc, item) => acc + item.total, 0);

  const handlePilihBarang = (value) => {
    const selected = daftarBarang.find(item => item.nama === value);
    if (selected) {
      setBarang(selected.nama);
      setHarga(selected.harga);
    }
  };

  const cetakStruk = () => {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const tanggal = now.toLocaleDateString('id-ID', options);
    const jam = now.toLocaleTimeString('id-ID');
    setWaktuPembelian(`${tanggal} ${jam}`);

    setTimeout(() => {
      window.print();
      const nextNomor = nomorStruk + 1;
      const today = new Date().toDateString();
      setBelanja([]);
      setNomorStruk(nextNomor);
      localStorage.setItem('nomorStrukData', JSON.stringify({ tanggal: today, nomor: nextNomor }));
    }, 500);
  };

  const toggleEditHarga = (index) => {
    if (editIndex === index) {
      setEditIndex(null);
      setHargaBaru('');
    } else {
      setEditIndex(index);
      setHargaBaru(daftarBarang[index].harga);
    }
  };

  const simpanHargaBaru = (index) => {
    if (hargaBaru) {
      const updatedBarang = [...daftarBarang];
      updatedBarang[index].harga = parseFloat(hargaBaru);
      setDaftarBarang(updatedBarang);
      setEditIndex(null);
      setHargaBaru('');
    }
  };

  const resetNomorStruk = () => {
    const today = new Date().toDateString();
    setNomorStruk(1);
    localStorage.setItem('nomorStrukData', JSON.stringify({ tanggal: today, nomor: 1 }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">WARUNG MANCES</h1>

      {/* Form */}
      <div className="bg-white p-4 rounded shadow w-full max-w-md mb-4">
        <select
          value={barang}
          onChange={(e) => handlePilihBarang(e.target.value)}
          className="border p-2 w-full mb-2"
        >
          <option value="">-- Pilih Barang --</option>
          {daftarBarang.map((item, i) => (
            <option key={i} value={item.nama}>{item.nama}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Harga Otomatis / Manual"
          value={harga}
          onChange={(e) => setHarga(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <h2 className="font-bold mb-2">Input Manual Barang (Opsional)</h2>
        <input
          placeholder="Nama Barang Manual"
          value={barangManual}
          onChange={(e) => setBarangManual(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input
          type="number"
          placeholder="Harga Barang Manual"
          value={hargaManual}
          onChange={(e) => setHargaManual(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <input
          type="number"
          placeholder="Jumlah"
          value={jumlah}
          onChange={(e) => setJumlah(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <button onClick={tambahBarang} className="bg-blue-500 text-white w-full py-2 rounded">
          Tambah ke Struk
        </button>
      </div>

      {/* Daftar Barang */}
      <div className="bg-white p-4 rounded shadow w-full max-w-md mb-4">
        <h2 className="font-bold mb-2">Daftar Barang</h2>
        {daftarBarang.map((item, i) => (
          <div key={i} className="flex flex-col border-b py-1">
            <div className="flex justify-between items-center">
              <div>{item.nama} - Rp{item.harga}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleEditHarga(i)}
                  className="text-blue-500 text-sm no-print"
                >
                  {editIndex === i ? 'Tutup' : 'Edit'}
                </button>
                <button
                  onClick={() => hapusDariDaftar(i)}
                  className="text-red-500 text-sm no-print"
                >
                  Hapus
                </button>
              </div>
            </div>
            {editIndex === i && (
              <div className="flex mt-2">
                <input
                  type="number"
                  value={hargaBaru}
                  onChange={(e) => setHargaBaru(e.target.value)}
                  className="border p-1 mr-2 w-24"
                />
                <button
                  onClick={() => simpanHargaBaru(i)}
                  className="bg-green-500 text-white px-2 rounded"
                >
                  Simpan
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Struk */}
      <div className="bg-white p-4 rounded shadow w-full max-w-md receipt-print">
        <h2 className="font-bold mb-2">Nomor Pembelian : {nomorStruk}</h2>
        {waktuPembelian && (
          <div className="mb-2 text-sm text-gray-700">{waktuPembelian}</div>
        )}
        {belanja.map((item, i) => (
          <div key={i} className="flex justify-between items-center border-b py-2">
            <div>
              {item.barang} - Rp{item.harga} x {item.jumlah} = <strong>Rp{item.total}</strong>
            </div>
            <button
              onClick={() => hapusBarang(i)}
              className="text-red-500 text-sm no-print"
            >
              Hapus
            </button>
          </div>
        ))}
        <div className="mt-4 text-right font-bold">Total: Rp{totalBelanja}</div>
        <div className="mt-4 text-center italic">*** Terima Kasih ***</div>
      </div>

      <button
        onClick={cetakStruk}
        className="bg-green-500 text-white w-full max-w-md py-2 mt-4 rounded"
      >
        Cetak Struk
      </button>

      <button
        onClick={resetNomorStruk}
        className="bg-red-500 text-white w-full max-w-md py-2 mt-2 rounded no-print"
      >
        Reset Nomor Struk Manual
      </button>
    </div>
  );
}

export default App;
