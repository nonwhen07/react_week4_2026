# React Admin Dashboard – CRUD + Auth Flow

一個使用 **React + Vite** 製作的後台商品管理系統。  
本專案目的是模擬真實後台管理系統的登入驗證與商品管理流程，
實作完整的 **登入驗證 + 商品 CRUD + Modal 狀態管理**，
並練習前端專案在架構設計與責任分離上的實作方式。

🔗 Live Demo  
https://nonwhen07.github.io/react_week4_2026

---

## 🎯 專案目標

- 建立完整登入驗證流程（Token-based Auth）
- 實作商品 CRUD（Create / Read / Update / Delete）
- 管理複雜表單狀態與 Modal 控制
- 優化元件責任分離與資料流設計
- 練習 GitHub Pages 自動部署流程

---

## 🧰 技術棧

- React 19
- Vite 7
- Axios
- Bootstrap 5
- Sass
- ESLint
- gh-pages

### 📦 核心依賴說明

本專案主要使用以下核心套件：

- axios：API 請求
- bootstrap：UI 框架
- react-router-dom：路由管理
- gh-pages：部署工具
- sass：樣式預處理器

所有依賴已於 package.json 中定義，請使用 npm install 安裝。

```bash
npm install
```

<details> 
<summary>📌 手動安裝依賴（快速小抄）</summary>

```bash
npm install axios bootstrap gh-pages prop-types react react-dom react-router-dom sass
```

</details>

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
此設計可避免未來在導入 Router 或 Context 時產生過度耦合，
並保留架構擴充彈性。

---

### 2️⃣ Token 驗證流程設計

登入成功後：

1. 將 token 寫入 cookie
2. 設定 axios 預設 Authorization header
3. App 初始化時：
   - 讀取 cookie
   - 呼叫 `/v2/api/user/check`
   - 驗證成功後取得商品列表

目前使用 Cookie 儲存 Token，
未來可改為 HttpOnly Cookie 搭配後端驗證以提升安全性。

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

## ⚙ 本地開發

```bash
npm install      # 安裝依賴
npm run dev      # 開發模式
npm run build    # 產生 production build
```

### 預設啟動：

```http
http://localhost:5173
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

所有 API 請求透過 Axios 進行封裝，
登入成功後統一設定 Authorization header，
並透過狀態驅動（state-driven）方式重新抓取資料，
避免直接在登入元件中操作資料請求。

### 登入

```http
POST /v2/admin/signin
```

### 驗證

```http
POST /v2/api/user/check
```

### 商品 CRUD

```http
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
並透過 GitHub Pages 進行靜態頁面部署。

---

## 🧩 開發規範與格式化設定

本專案使用 Prettier 統一排版規範，並搭配 VSCode 自動格式化設定。
此設定確保團隊開發時排版一致，
並減少 Git diff 因格式差異造成的噪音。

### 📄 .prettierrc

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 80,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "auto"
}
```

### 📄 .vscode/settings.json

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

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
