# 🛒 App de Produtos com Login (React Native + Expo)

Este é um aplicativo mobile criado com **React Native** e **Expo**, que permite o gerenciamento de produtos pessoais com autenticação de usuário. O foco principal é o uso de **componentes funcionais com Context API**, navegação com `expo-router` e armazenamento local com `AsyncStorage`.

## ⚙️ Funcionalidades

- Registro e login de usuários
- Listagem de produtos
- Adição de novos produtos
- Edição e exclusão de produtos
- Navegação protegida por autenticação
- Armazenamento de sessão com `AsyncStorage`

## 💡 Estrutura de Componentes

### 📁 `/app/(auth)/login.js`

Tela de login do usuário. Utiliza `TextInput` para capturar email e senha e chama o contexto `AuthContext` para autenticar o usuário.

### 📁 `/app/(auth)/register.js`

Tela de registro de novo usuário. Coleta os dados e envia para o contexto `AuthContext` para criar uma nova conta.

### 📁 `/app/(app)/products.js`

Tela principal. Exibe a lista de produtos cadastrados pelo usuário autenticado. Usa `ProductsContext` para buscar os dados.

### 📁 `/app/(app)/addProduct.js`

Tela de adição de produto. Permite preencher nome, preço e descrição. Ao salvar, chama `addProduct()` do contexto de produtos.

### 📁 `/app/(app)/editProduct.js`

Tela de edição de um produto existente. Permite atualizar os dados ou excluir o item. Usa `updateProduct()` e `deleteProduct()` do contexto.

---

## 🌐 Contextos React

### 📄 `AuthContext.js`

Gerencia o estado de autenticação:
- `login()`: Verifica se o email e senha são válidos
- `register()`: Cria novo usuário
- `logout()`: Limpa a sessão e redireciona para o login

### 📄 `ProductsContext.js`

Gerencia a lista de produtos do usuário:
- `fetchProducts()`: Carrega os produtos do usuário logado
- `addProduct()`: Adiciona um novo produto
- `updateProduct()`: Atualiza dados de um produto
- `deleteProduct()`: Exclui um produto

---

## 🧠 Tecnologias Utilizadas

- **React Native**
- **Expo**
- **React Context API**
- **expo-router** (para navegação baseada em pastas)
- **AsyncStorage** (para salvar sessão)
- **Firebase Firestore** (como backend para dados)

---

## 🚀 Como rodar

```bash
npm install
npx expo install react-native-get-random-values
npx expo start
