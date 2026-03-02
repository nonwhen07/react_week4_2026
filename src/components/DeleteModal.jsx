import { useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import PropTypes from 'prop-types';

function DeleteModal({ isOpen, onClose, onConfirm, productTitle }) {
  // Modal Ref 定義
  const deleteModalRef = useRef(null);

  //初始化 Modal
  useEffect(() => {
    if (deleteModalRef.current) {
      new Modal(deleteModalRef.current, { backdrop: false });
    }
  }, []);

  // 根據 isOpen 控制 Modal 的顯示與隱藏
  useEffect(() => {
    if (!deleteModalRef.current) return;

    const modal = Modal.getOrCreateInstance(deleteModalRef.current);

    if (isOpen) {
      modal.show();
    } else {
      modal.hide();
    }
  }, [isOpen]);

  // 專門處理「取消按鈕」
  const handleClose = () => {
    const modal = Modal.getOrCreateInstance(deleteModalRef.current);
    modal.hide();
    onClose(); // 通知父層
  };

  return (
    <div
      id="delProductModal"
      ref={deleteModalRef}
      className="modal fade"
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
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            你是否要刪除
            <span className="text-danger fw-bold">{productTitle}</span>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onConfirm} className="btn btn-danger">
              刪除
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

export default DeleteModal;
