# React Admin Dashboard – CRUD + Auth Flow

一個使用 React + Vite 製作的後台商品管理系統。
本專案模擬真實後台管理流程，實作完整的：

- Token 驗證登入
- 商品 CRUD 管理
- Modal 表單控制
- 狀態與 UI 責任分離設計

🔗 Live Demo  
https://nonwhen07.github.io/react_week4_2026

---

## 🎯 專案目標

### Week 3 - 登入驗證流程

- 建立 Token-based Auth 流程
- 使用 Cookie 儲存 Token
- App 初始化驗證登入狀態
- 驗證成功後載入商品資料

### Week 4 – 商品 CRUD 與架構優化

- 實作完整商品 CRUD
- 拆分 ProductModal / DeleteModal
- 統一資料轉換與驗證流程
- 優化元件責任分離與資料流設計

---

## 🧰 技術棧

- React 19
- Vite 7
- Axios
- Bootstrap 5
- Sass
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

Auth 與資料流

- LoginPage：僅負責登入
- App：負責驗證流程與資料抓取
- 登入成功後由 App 統一呼叫 getProducts()

避免登入元件直接操作資料，保持單向資料流。

---

### 2️⃣ Token 驗證流程設計

登入成功後：

1. 將 token 寫入 cookie
2. 設定 axios 預設 Authorization header
3. App 初始化時呼叫 /v2/api/user/check

目前使用 Cookie 儲存 Token，
未來可改為 HttpOnly Cookie 搭配後端驗證以提升安全性。

---

### 3️⃣ CRUD 與 Modal 架構設計（Week 4 重構重點）

資料流設計

- ProductPage：集中管理
  - products
  - tempProduct
  - modalMode
  - modalError

- ProductModal：純 UI 元件
- DeleteModal：純 UI 元件

為什麼不讓 Modal 打 API？

- 保持 UI 與業務邏輯分離
- 避免耦合
- 成功後由父層統一重新抓資料

---

### 4️⃣ 表單處理流程

資料提交前會經過三層處理：
1.validateProduct() → 前端驗證
2.formatProductData() → 型別轉換
3.API request → 後端操作

範例：

```js
const formatProductData = (product) => ({
  ...product,
  origin_price: Number(product.origin_price),
  price: Number(product.price),
  is_enabled: product.is_enabled ? 1 : 0,
});
```

---

### 5️⃣ Modal 動畫控制策略

為避免關閉時動畫閃退：

- 使用 closing 狀態保留 DOM
- 給 Bootstrap fade-out 300ms 時間
- 動畫結束後再卸載元件

確保：

- UI 平滑過渡
- 不產生 DOM 殘留

---

資料提交前會經過三層處理：
1.validateProduct() → 前端驗證
2.formatProductData() → 型別轉換
3.API request → 後端操作

範例：

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
 ├── App.jsx
 ├── pages/
 │     ├── LoginPage.jsx
 │     └── ProductPage.jsx
 └── components/
       ├── ProductModal.jsx
       ├── DeleteModal.jsx
       └── Pagination.jsx
```

---

## 📘 API 文件來源與設計（Week 3 未補充）

Swagger 文件

https://hexschool.github.io/ec-courses-api-swaggerDoc/

測試後台管理平台

https://ec-course-api.hexschool.io/

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
- 導入 React Router
- 使用 Context API 管理 Auth
- 表單改用 useReducer
- 升級為 TypeScript 專案
