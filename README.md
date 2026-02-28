# React Admin Dashboard – CRUD + Auth Flow

一個使用 **React + Vite** 製作的後台商品管理系統。  
本專案重點在於實作完整的 **登入驗證流程 + 商品 CRUD 管理 + Modal 狀態控制**，並針對架構與責任分離進行優化。

🔗 Live Demo  
https://nonwhen07.github.io/react3_2026

---

## 🎯 專案目標

- 建立完整登入驗證流程（Token-based Auth）
- 實作商品 CRUD（Create / Read / Update / Delete）
- 管理複雜表單狀態與 Modal 控制
- 優化元件責任分離與資料流設計
- 練習 GitHub Pages 自動部署流程

---

## 🧠 架構設計思維

### 1️⃣ 責任分離（Separation of Concerns）

- `LoginPage`：僅負責登入與通知 Auth 狀態
- `App`：負責驗證流程、資料抓取與狀態管理
- Modal 操作集中於 App 層統一控制

登入成功後：

LoginPage → setIsAuth(true)  
App → 根據 isAuth 觸發 getProducts()

避免登入元件直接操作資料，降低耦合。

---

### 2️⃣ Token 驗證流程設計

登入成功後：

1. 將 token 寫入 cookie
2. 設定 axios 預設 Authorization header
3. App 初始化時：
   - 讀取 cookie
   - 呼叫 `/v2/api/user/check`
   - 驗證成功後取得商品列表

此設計模擬真實後台管理系統的驗證流程。

---

### 3️⃣ Modal 狀態管理策略

使用 Bootstrap 原生 JS API：

```js
Modal.getOrCreateInstance(ref.current).show();
```

避免 React 與 Bootstrap DOM 操作衝突。

Modal 狀態透過：

- `modalMode`（create / edit）
- `tempProduct`（暫存編輯資料）

---

### 4️⃣ 資料轉換處理

送出 API 前統一轉換：

字串 → Number

Boolean → 0 / 1

避免 API 型別錯誤。

```js
const formatProductData = (product) => ({
  ...product,
  origin_price: Number(product.origin_price),
  price: Number(product.price),
  is_enabled: product.is_enabled ? 1 : 0,
});
```

---

## 🧰 技術棧

- React 19
- Vite 7
- Axios
- Bootstrap 5
- Sass
- ESLint
- gh-pages

### 📦 套件安裝（本專案用到的 dependencies）

```bash
npm i axios bootstrap gh-pages prop-types react react-dom react-router-dom sass
```

---

## 📂 專案結構

```bash
src/
 ├── main.jsx
 ├── App.jsx
 └── pages/
      └── LoginPage.jsx
```

---

## 🔐 API 設計

### 登入

```bash
POST /v2/admin/signin
```

### 驗證

```bash
POST /v2/api/user/check
```

### 商品 CRUD

```bash
GET    /v2/api/{apiPath}/admin/products
POST   /v2/api/{apiPath}/admin/product
PUT    /v2/api/{apiPath}/admin/product/{id}
DELETE /v2/api/{apiPath}/admin/product/{id}
```

---

## 🚀 部署流程

### 使用 gh-pages：

```bash
npm run build
npm run deploy
```

dist 目錄會推送至 gh-pages 分支。

---

## 🔮 未來優化方向、已知限制

### 已知限制

- Token 使用 cookie 儲存（非 HttpOnly）
- ESLint 依賴存在 dev-only audit 警告（不影響 production）

### 未來優化方向

- 抽離 axios instance
- 將 Modal 拆分為獨立元件
- 導入 React Router
- 使用 Context API 管理 Auth
- 升級為 TypeScript 專案
