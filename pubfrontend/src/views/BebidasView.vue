<template>
  <div class="rock-wrapper">
    <div class="container">
      <div class="header-actions">
        <h1>🎸 MENU DE BEBIDAS</h1>
        <button @click="novaBebida" class="btn-rock">NOVA BEBIDA ⚡</button>
      </div>

      <table class="rock-table">
        <thead>
        <tr>
          <th>ID</th>
          <th>NOME</th>
          <th>PREÇO</th>
          <th>TIPO</th>
          <th>AÇÕES</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="bebida in bebidas" :key="bebida.id">
          <td>{{ bebida.id }}</td>
          <td>{{ bebida.nome }}</td>
          <td>R$ {{ bebida.preco }}</td>
          <td>{{ bebida.tipo }}</td>
          <td>
            <button @click="editarBebida(bebida.id)" class="btn-edit">EDITAR</button>
            <button @click="deletarBebida(bebida.id)" class="btn-delete">APAGAR</button>
          </td>
        </tr>
        <tr v-if="bebidas.length === 0">
          <td colspan="5">Nenhuma bebida cadastrada. Que tal adicionar uma?</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const bebidas = ref([]);

const carregarBebidas = async () => {
  try {
    const res = await api.get('/bebidas');

    // O Backend responde em XML, precisamos transformar em Javascript
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(res.data, "application/xml");

    // O Spring gera o XML listando tags de acordo com a classe ou tags <item>
    // Dependendo do retorno, ele usa o nome da classe. Buscamos por <Bebida> ou <item>
    let nodes = xmlDoc.getElementsByTagName("item");
    if(nodes.length === 0) nodes = xmlDoc.getElementsByTagName("Bebida");

    const lista = [];
    for (let i = 0; i < nodes.length; i++) {
      lista.push({
        id: nodes[i].getElementsByTagName("id")[0]?.textContent,
        nome: nodes[i].getElementsByTagName("nome")[0]?.textContent,
        preco: parseFloat(nodes[i].getElementsByTagName("preco")[0]?.textContent).toFixed(2),
        tipo: nodes[i].getElementsByTagName("tipo")[0]?.textContent,
      });
    }
    bebidas.value = lista;
  } catch (error) {
    console.error("Erro ao carregar bebidas", error);
  }
};

const novaBebida = () => router.push('/bebidas/nova');
const editarBebida = (id) => router.push(`/bebidas/editar/${id}`);

const deletarBebida = async (id) => {
  // Modal de Confirmação exigido na US
  if (confirm("Você tem certeza que deseja APAGAR esta bebida do menu?")) {
    try {
      await api.delete(`/bebidas/${id}`);
      alert("Bebida apagada com sucesso!");
      carregarBebidas(); // Atualiza a lista automaticamente
    } catch (error) {
      alert("Erro ao excluir bebida.");
    }
  }
};

onMounted(() => {
  carregarBebidas();
});
</script>

<style scoped>
.rock-wrapper {
  min-height: 100vh;
  background: radial-gradient(circle, #1a1a1a 0%, #000000 100%);
  color: #eee;
  padding: 40px 20px;
  font-family: 'Roboto', sans-serif;
}
.container {
  max-width: 900px;
  margin: 0 auto;
  background: #111;
  padding: 30px;
  border-top: 4px solid #e74c3c;
  box-shadow: 0 10px 50px rgba(0,0,0,0.8);
  border-radius: 4px;
}
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
h1 {
  color: #fff;
  font-family: 'Saira Extra Condensed', sans-serif;
  margin: 0;
  letter-spacing: 2px;
}
.btn-rock {
  background: #2ecc71;
  color: #000;
  border: none;
  padding: 10px 20px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 2px;
}
.btn-rock:hover { background: #27ae60; }

.rock-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}
.rock-table th {
  background: #222;
  color: #e74c3c;
  padding: 12px;
  border-bottom: 2px solid #333;
}
.rock-table td {
  padding: 12px;
  border-bottom: 1px solid #222;
}
.btn-edit {
  background: #f39c12;
  color: #fff;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 2px;
  font-weight: bold;
  margin-right: 10px;
}
.btn-delete {
  background: #e74c3c;
  color: #fff;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 2px;
  font-weight: bold;
}
</style>