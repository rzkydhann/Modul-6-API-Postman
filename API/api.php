<?php

// Jika ingin menampilkan pesan error, beri komentar pada baris di bawah
error_reporting(0);

// Koneksi Database
$host = "localhost";
$user = "root";
$pass = "";
$db   = "api_rn";

$koneksi = mysqli_connect($host, $user, $pass, $db);

// Cek koneksi
if (!$koneksi) {
    die("Koneksi gagal: " . mysqli_connect_error());
}

// Ambil parameter operasi (op)
$op = isset($_GET['op']) ? $_GET['op'] : 'normal';

// Routing fungsi berdasarkan parameter
switch ($op) {
    case 'create':
        create();
        break;
    case 'detail':
        detail();
        break;
    case 'update':
        update();
        break;
    case 'delete':
        delete();
        break;
    default:
        normal();
        break;
}

// ============================================================
// FUNGSI UNTUK MENAMPILKAN SEMUA DATA
// ============================================================
function normal()
{
    global $koneksi;
    $sql = "SELECT * FROM mahasiswa ORDER BY id DESC";
    $q   = mysqli_query($koneksi, $sql);
    $hasil = [];

    while ($r = mysqli_fetch_array($q)) {
        $hasil[] = array(
            'id'             => $r['id'],
            'npm'            => $r['npm'],
            'nama'           => $r['nama'],
            'program_studi'  => $r['program_studi'],
            'tanggal_input'  => $r['tanggal_input']
        );
    }

    $data['data']['result'] = $hasil;
    echo json_encode($data);
}

// ============================================================
// FUNGSI CREATE (TAMBAH DATA)
// ============================================================
function create()
{
    global $koneksi;

    $npm           = $_POST['npm'];
    $nama          = $_POST['nama'];
    $program_studi = $_POST['program_studi'];

    $hasil = "Gagal menambahkan data";

    if ($nama && $npm && $program_studi) {
        $sql = "INSERT INTO mahasiswa (npm, nama, program_studi) 
                VALUES ('$npm', '$nama', '$program_studi')";
        $q = mysqli_query($koneksi, $sql);

        if ($q) {
            $hasil = "Berhasil menambahkan data";
        }
    }

    $data['data']['result'] = $hasil;
    echo json_encode($data);
}

// ============================================================
// FUNGSI DETAIL (AMBIL DATA BERDASARKAN ID)
// ============================================================
function detail()
{
    global $koneksi;

    $id = $_GET['id'];
    $sql = "SELECT * FROM mahasiswa WHERE id = '$id'";
    $q = mysqli_query($koneksi, $sql);
    $hasil = [];

    while ($r = mysqli_fetch_array($q)) {
        $hasil[] = array(
            'id'             => $r['id'],
            'npm'            => $r['npm'],
            'nama'           => $r['nama'],
            'program_studi'  => $r['program_studi'],
            'tanggal_input'  => $r['tanggal_input']
        );
    }

    $data['data']['result'] = $hasil;
    echo json_encode($data);
}

// ============================================================
// FUNGSI UPDATE (UBAH DATA)
// ============================================================
function update()
{
    global $koneksi;

    $id            = $_GET['id'];
    $npm           = $_POST['npm'];
    $nama          = $_POST['nama'];
    $program_studi = $_POST['program_studi'];

    $set = [];

    if ($npm)           $set[] = "npm='$npm'";
    if ($nama)          $set[] = "nama='$nama'";
    if ($program_studi) $set[] = "program_studi='$program_studi'";

    $hasil = "Gagal melakukan update data";

    if (!empty($set)) {
        $sql = "UPDATE mahasiswa SET " . implode(",", $set) . ", tanggal_input=NOW() WHERE id='$id'";
        $q = mysqli_query($koneksi, $sql);

        if ($q) {
            $hasil = "Data berhasil diupdate";
        }
    }

    $data['data']['result'] = $hasil;
    echo json_encode($data);
}

// ============================================================
// FUNGSI DELETE (HAPUS DATA)
// ============================================================
function delete()
{
    global $koneksi;

    $id = $_GET['id'];
    $sql = "DELETE FROM mahasiswa WHERE id='$id'";
    $q = mysqli_query($koneksi, $sql);

    if ($q) {
        $hasil = "Berhasil menghapus data";
    } else {
        $hasil = "Gagal menghapus data";
    }

    $data['data']['result'] = $hasil;
    echo json_encode($data);
}
?>
