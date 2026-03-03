import { useEffect, useState } from 'react';
// import { Modal } from 'bootstrap';
import PropTypes from 'prop-types';

function ProductModal({
  isOpen,
  onClose,
  modalMode,
  tempProduct,
  onModalChange,
  onImageChange,
  addImage,
  deleteImage,
  modalError,
  onConfirm,
}) {
  // // Modal Ref 定義
  // const productModalRef = useRef(null);
  const [closing, setClosing] = useState(false);

  const shouldRender = isOpen || closing;

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      return;
    }

    // 開始關閉
    if (!isOpen && shouldRender) {
      document.body.classList.remove('modal-open');
      setClosing(true);

      const timer = setTimeout(() => {
        setClosing(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  if (!shouldRender) return null;

  return (
    <div
      id="productModal"
      className={`modal fade ${isOpen ? 'show d-block' : ''}`}
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
              onClick={onClose}
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
                      onChange={onModalChange}
                      name="imageUrl"
                      type="text"
                      id="primary-image"
                      className="form-control"
                      placeholder="請輸入圖片連結"
                    />
                  </div>
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
                            onImageChange(e, index);
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
                      <button onClick={addImage} className="btn btn-outline-primary btn-sm w-100">
                        新增圖片
                      </button>
                    )}
                  {tempProduct.imagesUrl.length > 1 && (
                    <button onClick={deleteImage} className="btn btn-outline-danger btn-sm w-100">
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
                    onChange={onModalChange}
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
                    onChange={onModalChange}
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
                    onChange={onModalChange}
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
                      onChange={onModalChange}
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
                      onChange={onModalChange}
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
                    onChange={onModalChange}
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
                    onChange={onModalChange}
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
                    onChange={onModalChange}
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
            <button type="button" onClick={onConfirm} className="btn btn-primary">
              確認
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// === 新增 `propTypes` 驗證 ===
ProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  modalMode: PropTypes.oneOf(['create', 'edit']).isRequired,

  tempProduct: PropTypes.shape({
    // 確保 `tempProduct` 是物件，且內部特定屬性為必填
    imageUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
    origin_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    is_enabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    description: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    imagesUrl: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,

  onModalChange: PropTypes.func.isRequired,
  onImageChange: PropTypes.func.isRequired,
  addImage: PropTypes.func.isRequired,
  deleteImage: PropTypes.func.isRequired,
  modalError: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
};

ProductModal.defaultProps = {
  tempProduct: {
    is_enabled: 0, // 確保未設定時預設為 0（未啟用）
  },
};

export default ProductModal;
