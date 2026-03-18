import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RiAddLine, RiDeleteBin6Line } from '@remixicon/react';
import type { FC } from 'react';
import { useState } from 'react';
import { LicenseEditDialog } from '#/components/Character/Form/Gear/LicenseEditDialog.tsx';
import { SinEditDialog } from '#/components/Character/Form/Gear/SinEditDialog.tsx';
import {
  computeLicenseAvailability,
  computeLicenseNuyen,
  computeSinAvailability,
  computeSinNuyen,
  formatNuyen,
  useGearFormGroup,
} from '#/components/Character/Form/Gear/UseGearFormGroup.ts';
import type {
  LicenseFormItem,
  PlayerCharacterForm,
  SinFormItem,
} from '#/components/Character/Form/UseCharacterForm.ts';

interface SinsAndLicensesSectionProps {
  form: PlayerCharacterForm;
}

type DialogState =
  | { type: 'add-sin' }
  | { type: 'edit-sin'; sin: SinFormItem }
  | { type: 'add-license'; sinId?: string }
  | { type: 'edit-license'; license: LicenseFormItem }
  | { type: 'confirm-remove-sin'; sin: SinFormItem; licenseCount: number }
  | null

export const SinsAndLicensesSection: FC<SinsAndLicensesSectionProps> = ({
  form,
}) => {
  const {
    sins,
    licenses,
    hasRealSin,
    addSin,
    updateSin,
    removeSin,
    addLicense,
    updateLicense,
    removeLicense,
  } = useGearFormGroup(form);

  const [dialogState, setDialogState] = useState<DialogState>(null);

  const licensesForSin = (sinId: string) =>
    licenses.filter((lic) => lic.sinId === sinId);

  const handleSinSave = (sinData: Omit<SinFormItem, 'id'>) => {
    if (dialogState?.type === 'edit-sin') {
      updateSin(dialogState.sin.id, sinData);
    } else {
      addSin(sinData);
    }
  };

  const handleLicenseSave = (licenseData: Omit<LicenseFormItem, 'id'>) => {
    if (dialogState?.type === 'edit-license') {
      updateLicense(dialogState.license.id, licenseData);
    } else {
      addLicense(licenseData);
    }
  };

  const handleRemoveSinClick = (event: React.MouseEvent, sin: SinFormItem) => {
    event.stopPropagation();
    const attachedLicenses = licensesForSin(sin.id);
    if (attachedLicenses.length > 0) {
      setDialogState({
        type: 'confirm-remove-sin',
        sin,
        licenseCount: attachedLicenses.length,
      });
    } else {
      removeSin(sin.id);
    }
  };

  const canAddRealSin =
    !hasRealSin ||
    (dialogState?.type === 'edit-sin' && dialogState.sin.kind === 'real');

  return (
    <Stack gap={1}>
      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={16} />}
        onClick={() => setDialogState({ type: 'add-sin' })}
        fullWidth
      >
        Add SIN
      </Button>

      <Stack gap={0.5}>
        {sins.map((sin) => {
          const sinAvailability = computeSinAvailability(sin);
          const sinCost = formatNuyen(computeSinNuyen(sin));

          return (
            <Box key={sin.id}>
              <Stack
                direction="column"
                sx={{
                  p: 1,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
                onClick={() => setDialogState({ type: 'edit-sin', sin })}
              >
                <Stack direction="row" alignItems="center" gap={1}>
                  <Typography sx={{ flexGrow: 1, fontSize: '0.875rem' }}>
                    {sin.name}
                  </Typography>

                  <Typography
                    sx={{
                      minWidth: 64,
                      textAlign: 'right',
                      fontSize: '0.875rem',
                    }}
                  >
                    {sinCost}
                  </Typography>

                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSinClick(e, sin);
                    }}
                    aria-label={`Remove ${sin.name}`}
                  >
                    <RiDeleteBin6Line size={16} />
                  </IconButton>
                </Stack>

                <Stack direction="row" gap={1} sx={{ pt: 1 }}>
                  <Chip
                    label={
                      sin.kind === 'real' ? 'Real' : `Rating: ${sin.rating}`
                    }
                    size="small"
                    variant="outlined"
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />

                  {sinAvailability !== '-' && (
                    <Chip
                      label={`Avail: ${sinAvailability}`}
                      size="small"
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  )}
                </Stack>
              </Stack>

              <Box
                sx={{
                  paddingLeft: 1,
                  borderLeft: '4px solid',
                  borderColor: 'divider',
                }}
              >
                <Stack gap={1}>
                  {licensesForSin(sin.id).map((license) => {
                    const licenseAvailability = computeLicenseAvailability(
                      license,
                      sins,
                    );
                    const licenseCost = formatNuyen(
                      computeLicenseNuyen(license, sins),
                    );

                    return (
                      <Box key={license.id}>
                        <Stack
                          direction="column"
                          gap={0}
                          sx={{
                            p: 1,
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'action.hover' },
                          }}
                          onClick={() =>
                            setDialogState({ type: 'edit-license', license })
                          }
                        >
                          <Stack direction="row" alignItems="center" gap={1}>
                            <Typography
                              sx={{ flexGrow: 1, fontSize: '0.8125rem' }}
                            >
                              {license.name}
                            </Typography>

                            <Typography
                              sx={{
                                minWidth: 64,
                                textAlign: 'right',
                                fontSize: '0.8125rem',
                              }}
                            >
                              {licenseCost}
                            </Typography>

                            <IconButton
                              size="small"
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeLicense(license.id);
                              }}
                              aria-label={`Remove ${license.name}`}
                            >
                              <RiDeleteBin6Line size={16} />
                            </IconButton>
                          </Stack>

                          <Stack direction="row" gap={1} sx={{ pt: 1 }}>
                            {sin.kind === 'fake' && (
                              <Chip
                                label={`Rating: ${license.rating}`}
                                size="small"
                                variant="outlined"
                                sx={{ height: 20, fontSize: '0.7rem' }}
                              />
                            )}

                            {licenseAvailability !== '-' && (
                              <Chip
                                label={`Avail: ${licenseAvailability}`}
                                size="small"
                                variant="outlined"
                                sx={{ height: 20, fontSize: '0.7rem' }}
                              />
                            )}
                          </Stack>
                        </Stack>
                      </Box>
                    );
                  })}
                </Stack>

                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<RiAddLine size={14} />}
                  onClick={() =>
                    setDialogState({ type: 'add-license', sinId: sin.id })
                  }
                  fullWidth
                >
                  Add License
                </Button>
              </Box>
            </Box>
          );
        })}
      </Stack>

      <SinEditDialog
        key={
          dialogState?.type === 'edit-sin'
            ? `edit-sin-${dialogState.sin.id}`
            : 'add-sin'
        }
        open={
          dialogState?.type === 'add-sin' || dialogState?.type === 'edit-sin'
        }
        onClose={() => setDialogState(null)}
        onSave={handleSinSave}
        initialValues={
          dialogState?.type === 'edit-sin' ? dialogState.sin : undefined
        }
        canAddRealSin={canAddRealSin}
      />

      <LicenseEditDialog
        key={
          dialogState?.type === 'edit-license'
            ? `edit-license-${dialogState.license.id}`
            : dialogState?.type === 'add-license'
              ? `add-license-${dialogState.sinId}`
              : 'add-license'
        }
        open={
          dialogState?.type === 'add-license' ||
          dialogState?.type === 'edit-license'
        }
        onClose={() => setDialogState(null)}
        onSave={handleLicenseSave}
        initialValues={
          dialogState?.type === 'edit-license' ? dialogState.license : undefined
        }
        sins={sins}
        defaultSinId={
          dialogState?.type === 'add-license' ? dialogState.sinId : undefined
        }
      />

      <Dialog
        open={dialogState?.type === 'confirm-remove-sin'}
        onClose={() => setDialogState(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ p: 1 }}>Remove SIN?</DialogTitle>
        <DialogContent sx={{ p: 1 }}>
          <DialogContentText>
            {dialogState?.type === 'confirm-remove-sin' && (
              <>
                <strong>{dialogState.sin.name}</strong> has{' '}
                {dialogState.licenseCount} attached license
                {dialogState.licenseCount !== 1 ? 's' : ''}. Removing this SIN
                will also remove all its licenses.
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 1 }}>
          <Button onClick={() => setDialogState(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              if (dialogState?.type === 'confirm-remove-sin') {
                removeSin(dialogState.sin.id);
                setDialogState(null);
              }
            }}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
