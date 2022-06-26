import React, { forwardRef } from 'react';
import { ConfirmModal } from './ConfirmModal';
import { ConfirmButtonProps } from 'types';
import { useConfirmButton } from 'hooks/useConfirmButton';

export const ConfirmButton: React.FC<ConfirmButtonProps> = forwardRef(
  (
    {
      as = 'button',
      onConfirm,
      onDismiss,
      dialogTitle = 'Confirmer cette action',
      dialogDesc,
      confirmLabel = 'Confirmer',
      dismissLabel = 'Annuler',
      hideIcon,
      icon,
      ...props
    },
    ref
  ) => {
    const { dismiss, confirm, close, isOpen, open } = useConfirmButton({
      onConfirm,
      onDismiss,
    });

    const element = React.createElement(as, {
      ...props,
      onClick: open,
      ref,
    });

    return (
      <>
        <ConfirmModal
          open={isOpen}
          onClose={close}
          onConfirm={confirm}
          onDismiss={dismiss}
          dialogTitle={dialogTitle}
          dialogDesc={dialogDesc}
          confirmLabel={confirmLabel}
          dismissLabel={dismissLabel}
          hideIcon={hideIcon}
          icon={icon}
        />
        {element}
      </>
    );
  }
);
ConfirmButton.displayName = 'ConfirmButton';
