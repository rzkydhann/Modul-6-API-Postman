import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  FlatList, 
  TouchableOpacity,
  StyleSheet 
} from "react-native";

const API_URL = "http://192.168.1.3/API/api.php";

export default function App() {
  const [data, setData] = useState([]);
  const [npm, setNpm] = useState("");
  const [nama, setNama] = useState("");
  const [prodi, setProdi] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fungsi universal fetch aman
  const safeFetch = async (url, options = {}) => {
    try {
      const res = await fetch(url, options);

      // Cek status
      if (!res.ok) {
        console.log("HTTP Error:", res.status, url);
        return null;
      }

      // Coba parse JSON
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch (jsonErr) {
        console.log("❌ Gagal parse JSON (server mengirim HTML)");
        console.log("Isi respon:", text);
        return null;
      }

    } catch (err) {
      console.log("❌ Fetch Error:", err.message);
      return null;
    }
  };


  // LOAD DATA
  const loadData = async () => {
    const json = await safeFetch(`${API_URL}?op=normal`);
    if (json && json.data) {
      setData(json.data.result || []);
    }
  };

  useEffect(() => {
    loadData();
  }, []);


  // CREATE / UPDATE
  const saveData = async () => {
    let formData = new FormData();
    formData.append("npm", npm);
    formData.append("nama", nama);
    formData.append("program_studi", prodi);

    let url = editingId
      ? `${API_URL}?op=update&id=${editingId}`
      : `${API_URL}?op=create`;

    const json = await safeFetch(url, {
      method: "POST",
      body: formData,
    });

    if (json) {
      setNpm("");
      setNama("");
      setProdi("");
      setEditingId(null);
      loadData();
    }
  };


  // DELETE
  const deleteData = async (id) => {
    const json = await safeFetch(`${API_URL}?op=delete&id=${id}`);
    if (json) loadData();
  };


  // EDIT
  const editData = (item) => {
    setEditingId(item.id);
    setNpm(item.npm);
    setNama(item.nama);
    setProdi(item.program_studi);
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRUD Mahasiswa - React Native</Text>

      <TextInput
        style={styles.input}
        placeholder="NPM"
        value={npm}
        onChangeText={setNpm}
      />
      <TextInput
        style={styles.input}
        placeholder="Nama"
        value={nama}
        onChangeText={setNama}
      />
      <TextInput
        style={styles.input}
        placeholder="Program Studi"
        value={prodi}
        onChangeText={setProdi}
      />

      <Button
        title={editingId ? "Update Data" : "Tambah Data"}
        onPress={saveData}
      />

      <Text style={styles.subtitle}>Daftar Mahasiswa</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>NPM: {item.npm}</Text>
            <Text style={styles.cardText}>Nama: {item.nama}</Text>
            <Text style={styles.cardText}>Prodi: {item.program_studi}</Text>

            <View style={styles.row}>
              <TouchableOpacity
                style={styles.btnEdit}
                onPress={() => editData(item)}
              >
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnDelete}
                onPress={() => deleteData(item.id)}
              >
                <Text style={styles.btnText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 40 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: "bold", marginVertical: 20 },
  input: {
    borderWidth: 1, borderColor: "#777",
    padding: 10, marginBottom: 10, borderRadius: 5
  },
  card: {
    backgroundColor: "#eee",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8
  },
  cardText: { fontSize: 16 },
  row: { flexDirection: "row", marginTop: 10 },
  btnEdit: {
    backgroundColor: "orange",
    padding: 10,
    marginRight: 10,
    borderRadius: 5
  },
  btnDelete: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5
  },
  btnText: { color: "#fff", fontWeight: "bold" }
});
