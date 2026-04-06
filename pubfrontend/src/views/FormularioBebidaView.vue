<template>
  <div class="rock-wrapper">
    <div class="container">
      <h1>{{ isEdicao ? '🎸 EDITAR BEBIDA' : '🎸 NOVA BEBIDA' }}</h1>
      <div class="rock-divider"></div>

      <form @submit.prevent="salvarBebida">
        <div class="rock-input-group">
          <label>NOME DA BEBIDA</label>
          <input v-model="bebida.nome" type="text" placeholder="Ex: Chopp Artesanal" required />
        </div>

        <div class="rock-input-group">
          <label>PREÇO (R$)</label>
          <input v-model="bebida.preco" type="number" step="0.01" placeholder="Ex: 15.50" required />
        </div>

        <div class="rock-input-group">
          <label>TIPO</label>
          <input v-model="bebida.tipo" type="text" placeholder="Ex: Cerveja, Drink, Não Alcoólico" required />
        </div>

        <div class="rock-input-group">
          <label>DESCRIÇÃO</label>
          <textarea v-model="bebida.descricao" rows="4" placeholder="Detalhes da bebida..." required></textarea>
        </div>

        <div class="actions">
          <button type="submit" class="btn-rock-primary">SALVAR ⚡</button>
          <button type="button" @click="voltar" class="btn-voltar">CANCELAR</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const route = useRoute();

const isEdicao = ref(false);
const bebida = ref({ nome: '', preco: '', tipo: '', descricao: '' });

onMounted(async () => {
  if (route.params.id) {
    isEdicao.value = true;
    try {
      const res = await api.get(`/bebidas/${route.params.id}`);

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(res.data, "application/xml");

      bebida.value = {
        nome: xmlDoc.getElementsByTagName("nome")[0]?.textContent || '',
        preco: parseFloat(xmlDoc.getElementsByTagName("preco")[0]?.textContent || 0).toFixed(2),
        tipo: xmlDoc.getElementsByTagName("tipo")[0]?.textContent || '',
        descricao: xmlDoc.getElementsByTagName("descricao")[0]?.textContent || '',
      };
    } catch (error) {
      alert("Erro ao carregar dados para edição.");
      voltar();
    }
  }
});

const salvarBebida = async () => {
  // O Backend espera XML, então construímos a string XML na mão
  const xmlPayload = `
    <Bebida>
      <nome>${bebida.value.nome}</nome>
      <preco>${bebida.value.preco}</preco>
      <tipo>${bebida.value.tipo}</tipo>
      <descricao>${bebida.value.descricao}</descricao>
    </Bebida>
  `.trim();

  try {
    if (isEdicao.value) {
      await api.put(`/bebidas/${route.params.id}`, xmlPayload);
      alert("Bebida atualizada com sucesso!");
    } else {
      await api.post('/bebidas', xmlPayload);
      alert("Nova bebida adicionada com sucesso!");
    }
    voltar();
  } catch (error) {
    alert("Erro ao salvar a bebida. Verifique as informações.");
    console.error(error);
  }
};

const voltar = () => router.push('/bebidas');
</script>

<style scoped>
.rock-wrapper {
  min-height: 100vh;
  background: radial-gradient(circle, #1a1a1a 0%, #000000 100%);
  color: #eee;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
}
.container {
  width: 100%;
  max-width: 500px;
  background: #111;
  padding: 30px;
  border-top: 4px solid #e74c3c;
  box-shadow: 0 10px 50px rgba(0,0,0,0.8);
  border-radius: 4px;
}
h1 {
  text-align: center;
  color: #fff;
  font-family: 'Saira Extra Condensed', sans-serif;
  letter-spacing: 1px;
}
.rock-divider {
  width: 50px;
  height: 3px;
  background: #e74c3c;
  margin: 10px auto 30px auto;
}
.rock-input-group {
  margin-bottom: 20px;
}
.rock-input-group label {
  display: block;
  color: #e74c3c;
  font-weight: bold;
  margin-bottom: 8px;
}
.rock-input-group input, .rock-input-group textarea {
  width: 100%;
  padding: 12px;
  background: #080808;
  border: 1px solid #222;
  color: #fff;
  border-radius: 2px;
  box-sizing: border-box;
}
.rock-input-group input:focus, .rock-input-group textarea:focus {
  outline: none;
  border-color: #e74c3c;
  box-shadow: 0 0 8px rgba(231,76,60,0.4);
}
.actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}
.btn-rock-primary {
  flex: 1;
  background: #e74c3c;
  color: #fff;
  border: none;
  padding: 12px;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
}
.btn-rock-primary:hover { background: #c0392b; }
.btn-voltar {
  flex: 1;
  background: #333;
  color: #fff;
  border: none;
  padding: 12px;
  font-weight: bold;
  cursor: pointer;
}
.btn-voltar:hover { background: #555; }
</style>