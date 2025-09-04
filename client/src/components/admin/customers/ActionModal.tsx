import { useEffect } from 'react';
import Modal from '../modal';
import CustomerForm from './customerForm';
import CustomerProfile from './customersProfile';
import { Customer } from './customersData'; // Assuming this is where Customer type is defined

interface IActionModalProps {
  actionType: 'edit' | 'add' | 'view' | null;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  selectedCustomer: Customer | null;
  handleFormSubmit: (data: Customer) => void; // Adjust as needed
}

const ActionModal: React.FC<IActionModalProps> = ({
  actionType,
  showModal,
  setShowModal,
  selectedCustomer,
  handleFormSubmit,
}) => {
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const getTitle = () => {
    switch (actionType) {
      case 'edit':
        return 'Edit Customer';
      case 'add':
        return 'Add New Customer';
      case 'view':
        return 'Customer Profile';
      default:
        return '';
    }
  };

  useEffect(() => {
    if (actionType === null) handleCloseModal();
  }, [actionType]);

  return (
    <Modal isOpen={showModal} onClose={handleCloseModal} title={getTitle()}>
      {actionType === 'view' ? (
        <CustomerProfile customer={selectedCustomer} />
      ) : (
        <CustomerForm
          initialData={actionType === 'edit' ? selectedCustomer || {} : {}}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
        />
      )}
    </Modal>
  );
};

export default ActionModal;
