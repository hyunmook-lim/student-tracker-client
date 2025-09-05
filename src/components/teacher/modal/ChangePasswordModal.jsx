import React, { useState } from 'react';
import './ChangePasswordModal.css';

function ChangePasswordModal({ isOpen, onClose, onChangePassword }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 입력 시 해당 필드 에러 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = '현재 비밀번호를 입력해주세요.';
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = '새 비밀번호를 입력해주세요.';
    } else if (formData.newPassword.length < 4) {
      newErrors.newPassword = '비밀번호는 4자 이상이어야 합니다.';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = '새 비밀번호 확인을 입력해주세요.';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = '새 비밀번호가 일치하지 않습니다.';
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = '현재 비밀번호와 새 비밀번호가 같습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onChangePassword({
        password: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      handleClose();
    } catch (error) {
      console.error('비밀번호 변경 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setErrors({});
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='change-password-modal-overlay' onClick={handleClose}>
      <div
        className='change-password-modal-content'
        onClick={e => e.stopPropagation()}
      >
        <div className='change-password-modal-header'>
          <h3>비밀번호 변경</h3>
          <button className='change-password-close-btn' onClick={handleClose}>
            ×
          </button>
        </div>
        <div className='change-password-modal-body'>
          <div className='change-password-form-group'>
            <label>현재 비밀번호</label>
            <input
              type='password'
              value={formData.currentPassword}
              onChange={e =>
                handleInputChange('currentPassword', e.target.value)
              }
              placeholder='현재 비밀번호를 입력하세요'
            />
            {errors.currentPassword && (
              <div className='change-password-error'>
                {errors.currentPassword}
              </div>
            )}
          </div>
          <div className='change-password-form-group'>
            <label>새 비밀번호</label>
            <input
              type='password'
              value={formData.newPassword}
              onChange={e => handleInputChange('newPassword', e.target.value)}
              placeholder='새 비밀번호를 입력하세요'
            />
            {errors.newPassword && (
              <div className='change-password-error'>{errors.newPassword}</div>
            )}
          </div>
          <div className='change-password-form-group'>
            <label>새 비밀번호 확인</label>
            <input
              type='password'
              value={formData.confirmPassword}
              onChange={e =>
                handleInputChange('confirmPassword', e.target.value)
              }
              placeholder='새 비밀번호를 다시 입력하세요'
            />
            {errors.confirmPassword && (
              <div className='change-password-error'>
                {errors.confirmPassword}
              </div>
            )}
          </div>
        </div>
        <div className='change-password-modal-actions'>
          <button
            className='change-password-cancel-btn'
            onClick={handleClose}
            disabled={isLoading}
          >
            취소
          </button>
          <button
            className='change-password-save-btn'
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? '변경 중...' : '변경'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
