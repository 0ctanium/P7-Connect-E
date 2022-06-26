import { UseConfirmButton } from 'types';
import { useCallback, useState } from 'react';
import { checkIfFunctionFalse } from 'lib/utils';

export const useConfirmButton: UseConfirmButton = ({
  onConfirm,
  onDismiss,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback((v?: any) => {
    setOpen(false);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (await checkIfFunctionFalse(onConfirm)) {
      handleClose();
    }
  }, [handleClose, onConfirm]);

  const handleDismiss = useCallback(async () => {
    if (await checkIfFunctionFalse(onDismiss)) {
      handleClose();
    }
  }, [handleClose, onDismiss]);

  return {
    isOpen: open,
    open: handleOpen,
    close: handleClose,
    confirm: handleConfirm,
    dismiss: handleDismiss,
  };
};
