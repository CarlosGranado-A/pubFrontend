<template>
  <div class="layout">
    <aside class="sidebar">
      <h2>🍺 Pub Manager</h2>
      <router-link to="/bebidas" class="menu-link">
  🍺 Cardápio do Bar
</router-link>
    </aside>

    <div class="main">
      <header class="header">
        <h1>Painel</h1>
      </header>


      <router-view />
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh; /* garante altura total */
  background: #000;
}

.sidebar {
  width: 220px;
  background: #0d0d0d;
  color: white;
  padding: 20px;
  border-right: 2px solid #1f1f1f;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.sidebar h2 {
  margin-bottom: 20px;
}

.sidebar a {
  display: block;
  color: #ffffff;
  margin-top: 10px;
  text-decoration: none;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  background: #1a1a1a;
  color: white;
  padding: 15px 30px;
  border-bottom: 2px solid #222;
}

.content {
  flex: 1;
  display: flex;
  justify-content: center; /* CENTRALIZA */
  align-items: flex-start; /* NÃO GRUDA EM CIMA */
  padding: 40px;
}
</style>