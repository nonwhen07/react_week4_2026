// import { useState, useEffect, useRef, useCallback } from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
// import { Modal } from 'bootstrap';

import Pagination from '../components/Pagination';
import ProductModal from '../components/ProductModal';
import DeleteModal from '../components/DeleteModal';

function ProductPage() {
  // 環境變數
  const baseURL = import.meta.env.VITE_BASE_URL;
  const apiPath = import.meta.env.VITE_API_PATH;
  // 管理Modal元件開關
  const [isProdModalOpen, setIsProdModalOpen] = useState(false);
  const [isDeleModalOpen, setIsDeleModalOpen] = useState(false);

  // 狀態管理 (State)
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  // Modal 錯誤訊息狀態
  const [modalError, setModalError] = useState('');
  //Modal 資料狀態的預設值
  const defaultModalState = {
    imageUrl: '',
    title: '',
    category: '',
    unit: '',
    origin_price: '',
    price: '',
    description: '',
    content: '',
    is_enabled: 0,
    imagesUrl: [''],
  };
  const [tempProduct, setTempProduct] = useState(defaultModalState);
  const [modalMode, setModalMode] = useState(null);

  // 將try catch交給呼叫的函式處理，讓getProducts專注在抓資料，並且能在需要時重複使用
  const getProducts = async (page = 1) => {
    const res = await axios.get(`${baseURL}/v2/api/${apiPath}/admin/products?page=${page}`);
    setProducts(res.data.products);
    setPageInfo(res.data.pagination);
  };

  // 產品列表分頁
  const handlePageChange = (page = 1) => {
    getProducts(page);
  };

  // Modal表單
  const handleModalInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setTempProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value, //透過type判斷是否為checkbox，綁定 checkbox 的勾選狀態時，應透過 checked 屬性，而非 value
    }));
  };
  const handleImageChange = (e, index) => {
    const { value } = e.target;
    const newImagesUrl = [...tempProduct.imagesUrl]; // 複製一份原本的副圖陣列
    newImagesUrl[index] = value; // 找出要修改的陣列index，進行修改
    setTempProduct((prev) => ({
      ...prev,
      imagesUrl: newImagesUrl,
    }));
  };
  // Modal表單 - 新增、刪除副圖
  const handleAddImage = () => {
    const newImagesUrl = [...tempProduct.imagesUrl, '']; // 複製一份原本的副圖陣列
    setTempProduct((prev) => ({
      ...prev,
      imagesUrl: newImagesUrl,
    }));
  };
  const handleDeleteImage = () => {
    const newImagesUrl = [...tempProduct.imagesUrl]; // 複製一份原本的副圖陣列
    newImagesUrl.pop(); // 移除最後一筆
    setTempProduct((prev) => ({
      ...prev,
      imagesUrl: newImagesUrl,
    }));
  };

  // 傳值data時，需包裝成物件{data: {}}，
  // 並將tempProduct的origin_price、price轉換為數字，is_enabled轉換為數字0或1
  const formatProductData = (product) => ({
    ...product,
    origin_price: Number(product.origin_price),
    price: Number(product.price),
    is_enabled: product.is_enabled ? 1 : 0,
  });
  //做前端驗證函式 - 確保必填欄位都有填寫，並回傳對應的錯誤訊息
  const validateProduct = (product) => {
    if (!product.title) return '請輸入產品標題';
    if (!product.category) return '請輸入產品分類';
    if (!product.unit) return '請輸入產品單位';
    if (product.origin_price === '' || Number(product.origin_price) <= 0) return '請輸入原價';
    if (product.price === '' || Number(product.price) <= 0) return '請輸入售價';

    return null;
  };

  // 新增產品
  const createProduct = async () => {
    return axios.post(`${baseURL}/v2/api/${apiPath}/admin/product`, {
      data: formatProductData(tempProduct),
    });
  };
  // 編輯產品
  const updateProduct = async () => {
    return axios.put(`${baseURL}/v2/api/${apiPath}/admin/product/${tempProduct.id}`, {
      data: formatProductData(tempProduct),
    });
  };
  // 更新產品 - 包含前端驗證、錯誤訊息顯示
  const handleUpdateProduct = async () => {
    setModalError('');

    const validationError = validateProduct(tempProduct);

    if (validationError) {
      setModalError(validationError);
      return;
    }

    try {
      if (modalMode === 'create') {
        await createProduct();
      } else {
        await updateProduct();
      }
      await getProducts();
      setIsProdModalOpen(false); // 成功才關閉 Modal
    } catch (error) {
      console.error(error);
      setModalError(error.response?.data?.message || '操作失敗');
    }
  };

  //刪除產品
  const deleteProduct = async () => {
    return axios.delete(`${baseURL}/v2/api/${apiPath}/admin/product/${tempProduct.id}`);
  };
  const handleDeleteProduct = async () => {
    try {
      await deleteProduct();
      await getProducts();
      setIsDeleModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Modal 控制
  // imagesUrl雙重確認函式 - 確保即使api回傳的product物件中imagesUrl為空陣列或非陣列，
  // 也能正確設定tempProduct的imagesUrl為至少包含一個空字串的陣列，避免後續操作出錯
  const normalizeProduct = (p = {}) => ({
    ...defaultModalState,
    ...p,
    imagesUrl: Array.isArray(p.imagesUrl) && p.imagesUrl.length > 0 ? [...p.imagesUrl] : [''],
  });
  // ProductModal
  const handleOpenProductModal = (mode, product = defaultModalState) => {
    setModalMode(mode);

    if (mode === 'create') {
      setTempProduct(defaultModalState);
    } else {
      setTempProduct(normalizeProduct(product));
    }
    setIsProdModalOpen(true);
  };

  // DeleteModal
  const handleOpenDeleteModal = (product = defaultModalState) => {
    setTempProduct(
      // 避免 api 回傳 product 為空物件時，無法正確設定tempProduct更保險
      product && Object.keys(product).length > 0 ? product : defaultModalState,
    );
    // 改由 isDeleteModalOpen 狀態控制 DeleteModal 的開關，並將 tempProduct 傳遞給 DeleteModal 顯示對應的產品資訊
    setIsDeleModalOpen(true);
  };

  // useEffect getProducts 初始載入產品資料
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await getProducts();
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <div className="container py-5">
        <div className="d-flex justify-content-between">
          <h2>產品列表</h2>
          <button
            className="btn btn-primary"
            onClick={() => {
              handleOpenProductModal('create');
            }}
          >
            新增產品
          </button>
        </div>
        <table className="table mt-4">
          <thead>
            <tr>
              <th width="120">分類</th>
              <th width="500">產品名稱</th>
              <th width="120">原價</th>
              <th width="120">售價</th>
              <th width="100">是否啟用</th>
              <th width="120"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <th scope="row">{product.category}</th>
                <td>{product.title}</td>
                <td>{product.origin_price}</td>
                <td>{product.price}</td>
                <td>
                  {product.is_enabled ? (
                    <span className="text-success">啟用</span>
                  ) : (
                    <span>未啟用</span>
                  )}
                </td>
                <td>
                  <div className="btn-group">
                    <button
                      type="button"
                      onClick={() => {
                        handleOpenProductModal('edit', product);
                      }}
                      className="btn btn-outline-primary btn-sm"
                    >
                      編輯
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleOpenDeleteModal(product);
                      }}
                      className="btn btn-outline-danger btn-sm"
                    >
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
      </div>

      <ProductModal
        isOpen={isProdModalOpen}
        onClose={() => setIsProdModalOpen(false)}
        modalMode={modalMode}
        tempProduct={tempProduct}
        onModalChange={handleModalInputChange}
        onImageChange={handleImageChange}
        addImage={handleAddImage}
        deleteImage={handleDeleteImage}
        modalError={modalError}
        onConfirm={handleUpdateProduct}
      />

      <DeleteModal
        isOpen={isDeleModalOpen}
        onClose={() => setIsDeleModalOpen(false)}
        productTitle={tempProduct.title}
        onConfirm={handleDeleteProduct}
      />
    </>
  );
}

export default ProductPage;
