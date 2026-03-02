// import { useState, useEffect, useRef, useCallback } from 'react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';

// import Pagination from '../components/Pagination';
// import ProductModal from '../components/ProductModal';
import DeleteModal from '../components/DeleteModal';

function ProductPage() {
  // 環境變數
  const baseURL = import.meta.env.VITE_BASE_URL;
  const apiPath = import.meta.env.VITE_API_PATH;
  // Modal Ref 定義
  const productModalRef = useRef(null);
  // const deleteModalRef = useRef(null);
  // 管理Modal元件開關
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 狀態管理 (State)
  // const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
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
  // 開始前的 get API & 認證相關函式
  // const getProducts = useCallback(async () => {
  //   try {
  //     const res = await axios.get(`${baseURL}/v2/api/${apiPath}/admin/products`);
  //     setProducts(res.data.products);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, [baseURL, apiPath]);
  // 將try catch交給呼叫的函式處理，讓getProducts專注在抓資料，並且能在需要時重複使用
  const getProducts = async () => {
    const res = await axios.get(`${baseURL}/v2/api/${apiPath}/admin/products`);
    setProducts(res.data.products);
  };

  // 由於 ProductPage 不需要登入狀態，所以把檢查登入的邏輯放在 App useEffect裡面
  // const checkLogin = useCallback(async () => {
  //   try {
  //     await axios.post(`${baseURL}/v2/api/user/check`);
  //     setIsAuth(true);
  //     await getProducts(); // 只在這裡抓
  //   } catch (error) {
  //     setIsAuth(false);
  //     console.error(error);
  //   }
  // }, [baseURL, getProducts]);

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
      handleCloseProductModal();
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
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error(error);
      setModalError(error.response?.data?.message || '刪除商品失敗');
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
    setTempProduct(normalizeProduct(product));
    const modal = Modal.getOrCreateInstance(productModalRef.current);
    modal.show();
  };
  const handleCloseProductModal = () => {
    const modal = Modal.getOrCreateInstance(productModalRef.current);
    modal.hide();
  };
  // DeleteModal
  const handleOpenDeleteModal = (product = defaultModalState) => {
    setTempProduct(
      // 避免 api 回傳 product 為空物件時，無法正確設定tempProduct更保險
      product && Object.keys(product).length > 0 ? product : defaultModalState,
    );
    // const modal = Modal.getOrCreateInstance(deleteModalRef.current);
    // modal.show();
    // 改由 isDeleteModalOpen 狀態控制 DeleteModal 的開關，並將 tempProduct 傳遞給 DeleteModal 顯示對應的產品資訊
    setIsDeleteModalOpen(true);
  };
  // const handleCloseDeleteModal = () => {
  //   const modal = Modal.getOrCreateInstance(deleteModalRef.current);
  //   modal.hide();
  // };

  // useEffect getProducts 初始載入產品資料
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await getProducts();
      } catch (error) {
        console.error(error);
        setModalError(error.response?.data?.message || '初始載入產品資料失敗');
      }
    };
    fetchProducts();
  }, []);

  // useEffect(() => {
  //   if (productModalRef.current) {
  //     new Modal(productModalRef.current, { backdrop: false });
  //   }
  //   if (deleteModalRef.current) {
  //     new Modal(deleteModalRef.current, { backdrop: false });
  //   }
  // }, []);

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
      </div>

      <div
        id="productModal"
        ref={productModalRef}
        className="modal fade"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fs-4">
                {modalMode === 'create' ? '新增產品' : '編輯 - ' + tempProduct.title}
              </h5>
              <button
                type="button"
                onClick={handleCloseProductModal}
                className="btn-close"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body p-4">
              {modalError && <div className="alert alert-danger">{modalError}</div>}
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="mb-4">
                    <label htmlFor="primary-image" className="form-label">
                      主圖
                    </label>
                    <div className="input-group">
                      <input
                        value={tempProduct.imageUrl || ''}
                        onChange={handleModalInputChange}
                        name="imageUrl"
                        type="text"
                        id="primary-image"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                      />
                    </div>
                    {/* <img src={tempProduct.imageUrl} alt="" className="img-fluid" /> */}
                    {tempProduct.imageUrl && (
                      <img src={tempProduct.imageUrl} alt="" className="img-fluid" />
                    )}
                  </div>
                  {/* 副圖 */}
                  <div className="border border-2 border-dashed rounded-3 p-3">
                    {tempProduct.imagesUrl?.length > 0 &&
                      tempProduct.imagesUrl.map((image, index) => (
                        <div key={index} className="mb-2">
                          <label htmlFor={`imagesUrl-${index + 1}`} className="form-label">
                            副圖 {index + 1}
                          </label>
                          <input
                            value={image}
                            onChange={(e) => {
                              handleImageChange(e, index);
                            }}
                            id={`imagesUrl-${index + 1}`}
                            type="text"
                            placeholder={`圖片網址 ${index + 1}`}
                            className="form-control mb-2"
                          />
                          {image && (
                            <img src={image} alt={`副圖 ${index + 1}`} className="img-fluid mb-2" />
                          )}
                        </div>
                      ))}
                  </div>
                  <div className="btn-group w-100">
                    {tempProduct.imagesUrl.length < 5 &&
                      tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1] !== '' && (
                        <button
                          onClick={handleAddImage}
                          className="btn btn-outline-primary btn-sm w-100"
                        >
                          新增圖片
                        </button>
                      )}
                    {tempProduct.imagesUrl.length > 1 && (
                      <button
                        onClick={handleDeleteImage}
                        className="btn btn-outline-danger btn-sm w-100"
                      >
                        刪除圖片
                      </button>
                    )}
                  </div>
                </div>

                <div className="col-md-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      value={tempProduct.title}
                      onChange={handleModalInputChange}
                      name="title"
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      分類
                    </label>
                    <input
                      value={tempProduct.category}
                      onChange={handleModalInputChange}
                      name="category"
                      id="category"
                      type="text"
                      className="form-control"
                      placeholder="請輸入分類"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="unit" className="form-label">
                      單位
                    </label>
                    <input
                      value={tempProduct.unit}
                      onChange={handleModalInputChange}
                      name="unit"
                      id="unit"
                      type="text"
                      className="form-control"
                      placeholder="請輸入單位"
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        value={tempProduct.origin_price}
                        onChange={handleModalInputChange}
                        name="origin_price"
                        id="origin_price"
                        type="number"
                        min={0}
                        className="form-control"
                        placeholder="請輸入原價"
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        value={tempProduct.price}
                        onChange={handleModalInputChange}
                        name="price"
                        id="price"
                        type="number"
                        min={0}
                        className="form-control"
                        placeholder="請輸入售價"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      value={tempProduct.description}
                      onChange={handleModalInputChange}
                      name="description"
                      id="description"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入產品描述"
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      value={tempProduct.content}
                      onChange={handleModalInputChange}
                      name="content"
                      id="content"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入說明內容"
                    ></textarea>
                  </div>

                  <div className="form-check">
                    <input
                      checked={Boolean(tempProduct.is_enabled)}
                      onChange={handleModalInputChange}
                      name="is_enabled"
                      type="checkbox"
                      className="form-check-input"
                      id="isEnabled"
                    />
                    <label className="form-check-label" htmlFor="isEnabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer border-top bg-light">
              <button type="button" onClick={handleCloseProductModal} className="btn btn-secondary">
                取消
              </button>
              <button type="button" onClick={handleUpdateProduct} className="btn btn-primary">
                確認
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <div
        className="modal fade"
        ref={deleteModalRef}
        id="delProductModal"
        tabIndex="-1"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">刪除產品</h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              你是否要刪除
              <span className="text-danger fw-bold">{tempProduct.title}</span>
            </div>
            <div className="modal-footer">
              <button type="button" onClick={handleCloseDeleteModal} className="btn btn-secondary">
                取消
              </button>
              <button type="button" onClick={handleDeleteProduct} className="btn btn-danger">
                刪除
              </button>
            </div>
          </div>
        </div>
      </div> */}

      {/* <DeleteModal
        tempProduct={tempProduct}
        getProducts={getProducts}
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
      /> */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProduct}
        productTitle={tempProduct.title}
      />
    </>
  );
}

export default ProductPage;
