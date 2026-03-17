import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useStore } from '@tanstack/react-store';
import { type FC, useState } from 'react';
import { QualityForm } from '#/components/Qualities/Form/QualityForm.tsx';
import type { QualityData } from '#/lib/system/types/qualityData.ts';

export interface AddQualityDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (quality: QualityData) => void;
}

const createEmptyQuality = (): QualityData => ({
  id: crypto.randomUUID(),
  name: '',
  type: 'positive',
  description: '',
});

function FormActions ({
  form,
  onClose,
  onAdd,
}: {
  form: any;
  onClose: () => void;
  onAdd: (q: QualityData) => void;
}) {
  const canSubmit = useStore(form.store, (s) => s.canSubmit);

  return (
    <>
      <Button onClick={onClose}>Cancel</Button>
      <Button
        variant="contained"
        onClick={() => {
          form.handleSubmit();
        }}
        disabled={!canSubmit}
      >
        Add
      </Button>
    </>
  );
}

export const AddQualityDialog: FC<AddQualityDialogProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [formInstance, setFormInstance] = useState<any | null>(null);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Quality</DialogTitle>
      <DialogContent sx={{ p: 1 }}>
        <QualityForm
          initialValues={createEmptyQuality()}
          onMount={(f) => setFormInstance(f)}
          onSubmit={(q) => {
            onAdd(q);
            onClose();
          }}
        />
      </DialogContent>
      <DialogActions>
        {formInstance ? (
          <FormActions form={formInstance} onClose={onClose} onAdd={onAdd} />
        ) : (
          <>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="contained" disabled>
              Add
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
