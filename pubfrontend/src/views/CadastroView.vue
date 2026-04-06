<template>
  <div class="rock-wrapper">
    <div class="rock-card">
      <div class="rock-header">
        <h1>NOVO MEMBRO</h1>
        <p>Cadastre-se para gerenciar o Pub.</p>
      </div>

      <form @submit.prevent="handleCadastro">
        <div class="input-group">
          <label>USUÁRIO</label>
          <input v-model="user.username" type="text" placeholder="Seu usuário: Pucca do Axé" required />
        </div>

        <div class="input-group">
          <label>SENHA</label>
          <input v-model="user.password" type="password" placeholder="Sua senha..." required />
        </div>

        <button type="submit" class="btn-rock" :disabled="loading">
          {{ loading ? 'PROCESSANDO...' : 'CADASTRAR' }}
        </button>
      </form>

      <div class="rock-footer">
        <router-link to="/login" class="link-voltar">← VOLTAR PARA LOGIN</router-link>
      </div>

      <p v-if="mensagem" :class="statusClass">{{ mensagem }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const user = reactive({ username: '', password: '' });
const loading = ref(false);
const mensagem = ref('');
const statusClass = ref('');

const handleCadastro = async () => {
  loading.value = true;
  mensagem.value = '';


  const xmlPayload = `
    <CadastroRequestDTO>
      <username>${user.username}</username>
      <password>${user.password}</password>
    </CadastroRequestDTO>
  `.trim();

  try {
    // 2. Enviando a string XML em vez do objeto 'user'
    await api.post('/auth/cadastro', xmlPayload);

    statusClass.value = 'msg-sucesso';
    mensagem.value = "SUCESSO! INDO PARA O LOGIN...";
    setTimeout(() => router.push('/login'), 2000);
  } catch (error) {
    statusClass.value = 'msg-erro';
    mensagem.value = error.response?.data || "ERRO NO CADASTRO.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.rock-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #000; /* Fundo total Black */
  font-family: sans-serif;
}
.rock-card {
  background: #1a1a1a;
  padding: 40px;
  border-radius: 8px;
  width: 100%;
  max-width: 380px;
  border-top: 5px solid #2ecc71; /* Linha verde de cadastro */
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}
.rock-header h1 {
  color: #fff;
  margin: 0;
  text-align: center;
}
.rock-header p {
  color: #666;
  text-align: center;
  margin-bottom: 30px;
}
.input-group {
  margin-bottom: 20px;
}
.input-group label {
  display: block;
  color: #2ecc71;
  font-weight: bold;
  margin-bottom: 8px;
}
.input-group input {
  width: 100%;
  padding: 12px;
  background: #000;
  border: 1px solid #333;
  color: #fff;
  border-radius: 4px;
  box-sizing: border-box;
}
.btn-rock {
  width: 100%;
  padding: 15px;
  background: #2ecc71;
  color: #000;
  border: none;
  font-weight: bold;
  cursor: pointer;
  border-radius: 4px;
  text-transform: uppercase;
}
.rock-footer {
  margin-top: 25px;
  text-align: center;
  border-top: 1px solid #333;
  padding-top: 15px;
}
.link-voltar {
  color: #2ecc71;
  text-decoration: none;
  font-size: 0.9rem;
}
.msg-erro { color: #ff4d4d; text-align: center; margin-top: 15px; }
.msg-sucesso { color: #2ecc71; text-align: center; margin-top: 15px; }
</style>