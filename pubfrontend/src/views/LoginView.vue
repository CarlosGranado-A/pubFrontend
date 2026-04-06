<template>
  <div class="rock-auth-wrapper">
    <div class="rock-auth-card">
      <div class="rock-auth-header">
        <span class="rock-icon">⚡</span>
        <h1>PUB CODE</h1>
        <div class="rock-divider"></div>
        <p>Login do Pub</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="rock-input-group">
          <label for="username">USUÁRIO</label>
          <div class="input-with-icon">
            <span class="icon">🤘</span>
            <input 
              type="text" 
              id="username" 
              v-model="credentials.username" 
              required 
              placeholder="Seu usuário: Hello Kitty"
            />
          </div>
        </div>

        <div class="rock-input-group">
          <label for="password">SENHA</label>
          <div class="input-with-icon">
            <span class="icon">🔒</span>
            <input 
              type="password" 
              id="password" 
              v-model="credentials.password" 
              required 
              placeholder="••••••••"
            />
          </div>
        </div>

        <button type="submit" class="btn-rock-primary" :disabled="isLoading">
          {{ isLoading ? 'AUTENTICANDO...' : 'ENTRAR' }}
        </button>
      </form>

      <div class="rock-auth-footer">
        <p>Ainda não tem acesso?</p>
        <router-link to="/cadastro" class="rock-link">CADASTRE-SE</router-link>
      </div>
      
      <transition name="fade">
        <p v-if="errorMessage" class="rock-error-msg">{{ errorMessage }}</p>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();

const credentials = reactive({
  username: '',
  password: ''
});

const isLoading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  // 1. Montando o XML com as credenciais (LoginRequestDTO)
  const xmlPayload = `
    <LoginRequestDTO>
      <username>${credentials.username}</username>
      <password>${credentials.password}</password>
    </LoginRequestDTO>
  `.trim();

  try {
    // 2. Enviando o XML
    const response = await api.post('/auth/login', xmlPayload);

    // 3. O backend devolve XML. Precisamos ler e extrair a tag <token>
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, "application/xml");

    // Pega o texto de dentro da tag <token>
    const token = xmlDoc.getElementsByTagName("token")[0]?.textContent;

    if (token) {
      localStorage.setItem('token', token);
      router.push('/bebidas');
    } else {
      errorMessage.value = 'FALHA AO OBTER O TOKEN DO SERVIDOR.';
    }

  } catch (error) {
    console.error(error);
    errorMessage.value = 'ACESSO NEGADO. VERIFIQUE SUAS CREDENCIAIS.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* --- ESTILOS GLOBAIS DA TELA (ROCK DARK MODE) --- */
.rock-auth-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  /* Fundo preto com um leve degradê radial chumbo */
  background: radial-gradient(circle, #1a1a1a 0%, #000000 100%);
  font-family: 'Roboto', sans-serif;
  color: #eeeeee;
  padding: 20px;
  box-sizing: border-box;
}

/* --- O CARD DE LOGIN (ESTILO INDUSTRIAL/ROCK) --- */
.rock-auth-card {
  background: #111111; /* Preto ligeiramente mais claro que o fundo */
  padding: 3rem 2rem;
  border-radius: 4px; /* Bordas mais secas, menos arredondadas */
  border: 1px solid #333; /* Borda sutil chumbo */
  box-shadow: 0 10px 50px rgba(0,0,0,0.8); /* Sombra pesada */
  width: 100%;
  max-width: 400px;
  position: relative;
  overflow: hidden;
}

/* Detalhe: Linha vermelha no topo do card */
.rock-auth-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: #e74c3c; /* Vermelho Rock */
  box-shadow: 0 0 15px #e74c3c; /* Efeito Neon */
}

/* --- CABEÇALHO --- */
.rock-auth-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.rock-icon {
  font-size: 2rem;
  color: #e74c3c;
  display: block;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 10px #e74c3c;
}

.rock-auth-header h1 {
  font-family: 'Saira Extra Condensed', sans-serif;
  font-weight: 800;
  font-size: 2.5rem;
  color: #ffffff;
  margin: 0;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.rock-divider {
  width: 60px;
  height: 3px;
  background: #333;
  margin: 1rem auto;
}

.rock-auth-header p {
  color: #888;
  font-size: 0.9rem;
  margin: 0;
}

/* --- INPUTS (ESTILO DARK COM FOCO NEON) --- */
.rock-input-group {
  margin-bottom: 1.5rem;
}

.rock-input-group label {
  display: block;
  font-family: 'Saira Extra Condensed', sans-serif;
  color: #e74c3c; /* Labels vermelhas */
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon .icon {
  position: absolute;
  left: 12px;
  color: #555;
  font-size: 1.1rem;
  transition: color 0.3s;
}

.rock-input-group input {
  width: 100%;
  padding: 12px 12px 12px 40px; /* Espaço para o ícone */
  background: #080808; /* Fundo input quase preto */
  border: 1px solid #222; /* Borda escura */
  border-radius: 2px;
  color: #ffffff;
  font-size: 1rem;
  box-sizing: border-box;
  transition: all 0.3s;
}

/* Efeito de Foco no Input (Neon Vermelho) */
.rock-input-group input:focus {
  outline: none;
  border-color: #e74c3c;
  background: #111;
  box-shadow: 0 0 10px rgba(231, 76, 60, 0.5);
}

/* Muda a cor do ícone quando o input tem foco */
.rock-input-group input:focus + .icon,
.input-with-icon:focus-within .icon {
  color: #e74c3c;
  text-shadow: 0 0 5px #e74c3c;
}

/* --- BOTÃO (VERMELHO IMPACTANTE COM EFEITO) --- */
.btn-rock-primary {
  width: 100%;
  padding: 12px;
  background: #e74c3c;
  color: #ffffff;
  border: none;
  border-radius: 2px;
  font-family: 'Saira Extra Condensed', sans-serif;
  font-weight: 800;
  font-size: 1.3rem;
  letter-spacing: 1px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.3s;
  box-shadow: 0 4px 0 #c0392b; /* Sombra sólida embaixo */
  margin-top: 1rem;
}

.btn-rock-primary:hover:not(:disabled) {
  background: #ff5252;
  box-shadow: 0 2px 0 #c0392b;
  transform: translateY(2px); /* Efeito de apertar botão */
}

.btn-rock-primary:active:not(:disabled) {
  box-shadow: 0 0px 0 #c0392b;
  transform: translateY(4px);
}

.btn-rock-primary:disabled {
  background: #555;
  box-shadow: none;
  color: #888;
  cursor: not-allowed;
}

/* --- FOOTER --- */
.rock-auth-footer {
  margin-top: 2rem;
  text-align: center;
  border-top: 1px solid #222;
  padding-top: 1.5rem;
  font-size: 0.9rem;
}

.rock-auth-footer p {
  color: #666;
  margin: 0 0 0.5rem 0;
}

.rock-link {
  color: #e74c3c;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;
}

.rock-link:hover {
  color: #ff5252;
  text-decoration: underline;
}

/* --- MENSAGEM DE ERRO (VISUAL ALERTA URGENCIAL) --- */
.rock-error-msg {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
  padding: 12px;
  border-radius: 2px;
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.85rem;
  font-weight: bold;
  border: 1px solid #e74c3c;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 0 10px rgba(231, 76, 60, 0.3);
}

/* Animação Fade */
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>