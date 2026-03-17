import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useStore } from "@tanstack/react-store";
import { type FC, useRef } from "react";
import type { QualityForm } from "#/components/Qualities/Form/UseQualityForm";
import { noop } from "#/lib/noop";
import type { QualityData } from "#/lib/system/types/qualityData.ts";
import { QualityEditForm } from "../Form/QualityEditForm";

export interface QualityDialogProps {
  quality: QualityData;
  open: boolean;
  onSave: (updated: QualityData) => void;
  onDelete?: () => void;
  onClose: () => void;
  onClosed?: () => void;
}

export const QualityDialog: FC<QualityDialogProps> = ({
  quality,
  open,
  onSave,
  onDelete,
  onClose,
  onClosed = noop,
}) => {
  const formRef = useRef<QualityForm>(null);

  return (
    <Dialog open={open} onTransitionExited={onClosed} fullWidth>
      <DialogTitle>
        {quality.type === "positive" ? "Positive Quality" : "Negative Quality"}
      </DialogTitle>
      <DialogContent sx={{ p: 1 }}>
        <QualityEditForm
          formRef={formRef}
          quality={quality}
          onSubmit={(values) => {
            onSave(values);
            onClose();
          }}
        />
      </DialogContent>
      <DialogActions>
        {formRef.current && (
          <FormActions
            form={formRef.current}
            onCancel={onClose}
            onDelete={onDelete}
          />
        )}
      </DialogActions>
    </Dialog>
  );
};

interface FormActionProps {
  form: QualityForm;
  onCancel: () => void;
  onDelete?: () => void;
}

const FormActions: FC<FormActionProps> = ({ form, onCancel, onDelete }) => {
  const canSubmit = useStore(form.store, (s) => s.canSubmit);

  const onSave = () => {
    form.handleSubmit();
  };

  return (
    <Stack justifyContent={"space-between"} direction="row" width="100%">
      <Box>
        {onDelete && (
          <Button color="error" onClick={onDelete}>
            Delete
          </Button>
        )}
      </Box>

      <Box>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="contained" onClick={onSave} disabled={!canSubmit}>
          Save
        </Button>
      </Box>
    </Stack>
  );
};
